"""Flask API application for AI Video Captions backend."""

import os
import pathlib
import tempfile
import threading
import uuid

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

from caption_styles import is_valid_caption_style
from job_storage import JobStorage

# Allowed video file extensions
ALLOWED_EXTENSIONS = {".mp4", ".mov", ".webm"}

# Caption position valid range (inclusive)
CAPTION_POSITION_MIN = 5
CAPTION_POSITION_MAX = 50


def _extension_allowed(filename: str) -> bool:
    """Return True if the file's extension is in ALLOWED_EXTENSIONS."""
    return pathlib.Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


def create_app(testing: bool = False) -> Flask:
    """Application factory.

    Args:
        testing: When True, skips background processing threads and uses an
                 in-memory-only (no-persist) JobStorage with a temp data dir.
    """
    app = Flask(__name__)

    # ------------------------------------------------------------------
    # Configuration
    # ------------------------------------------------------------------
    max_file_size_mb = int(os.environ.get("MAX_FILE_SIZE_MB", "500"))
    max_concurrent = int(os.environ.get("MAX_CONCURRENT_JOBS", "4"))
    frontend_url = os.environ.get("FRONTEND_URL", "*")

    app.config["TESTING"] = testing
    app.config["MAX_CONTENT_LENGTH"] = max_file_size_mb * 1024 * 1024
    app.config["MAX_FILE_SIZE_BYTES"] = max_file_size_mb * 1024 * 1024
    app.config["MAX_CONCURRENT"] = max_concurrent

    if testing:
        data_dir = tempfile.mkdtemp()
        storage = JobStorage(persist_path=None)
    else:
        data_dir = os.environ.get("DATA_DIR", str(pathlib.Path(__file__).parent / "data"))
        persist_path = os.path.join(data_dir, "jobs.json")
        storage = JobStorage(persist_path=persist_path)

    app.config["STORAGE"] = storage
    app.config["DATA_DIR"] = data_dir

    # ------------------------------------------------------------------
    # CORS
    # ------------------------------------------------------------------
    CORS(app, origins=[frontend_url] if frontend_url != "*" else "*")

    # ------------------------------------------------------------------
    # Routes
    # ------------------------------------------------------------------

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "version": "1.0.0"})

    @app.post("/api/process")
    def process():
        storage: JobStorage = app.config["STORAGE"]
        data_dir: str = app.config["DATA_DIR"]
        max_file_size_bytes: int = app.config["MAX_FILE_SIZE_BYTES"]

        # --- Validate file presence ---
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        if not file.filename:
            return jsonify({"error": "No file selected"}), 400

        # --- Validate file extension ---
        if not _extension_allowed(file.filename):
            ext = pathlib.Path(file.filename).suffix.lower()
            allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
            return jsonify({"error": f"Unsupported file type '{ext}'. Allowed: {allowed}"}), 400

        # --- Validate captionStyle ---
        caption_style = request.form.get("captionStyle", "")
        if not is_valid_caption_style(caption_style):
            return jsonify({"error": f"Invalid captionStyle '{caption_style}'"}), 400

        # --- Validate captionPosition ---
        caption_position_raw = request.form.get("captionPosition", "")
        try:
            caption_position = int(caption_position_raw)
        except (ValueError, TypeError):
            return jsonify({"error": "captionPosition must be an integer"}), 400

        if not (CAPTION_POSITION_MIN <= caption_position <= CAPTION_POSITION_MAX):
            return jsonify({
                "error": (
                    f"captionPosition must be between {CAPTION_POSITION_MIN} "
                    f"and {CAPTION_POSITION_MAX}"
                )
            }), 400

        # --- Read file content and check size ---
        file_bytes = file.read()
        file_size = len(file_bytes)
        if file_size > max_file_size_bytes:
            return jsonify({"error": f"File exceeds maximum size of {max_file_size_bytes // (1024*1024)} MB"}), 400

        # --- Save file to temp location ---
        upload_dir = os.path.join(data_dir, "temp")
        os.makedirs(upload_dir, exist_ok=True)

        file_id = str(uuid.uuid4())
        ext = pathlib.Path(file.filename).suffix.lower()
        saved_filename = f"{file_id}{ext}"
        video_path = os.path.join(upload_dir, saved_filename)

        with open(video_path, "wb") as fh:
            fh.write(file_bytes)

        # --- Create job ---
        job_id = storage.create_job(
            video_path=video_path,
            caption_style=caption_style,
            caption_position=caption_position,
            original_filename=file.filename,
            file_size=file_size,
        )

        # --- Update video_path directly (job was just created with the path) ---
        # The path is already correct from create_job, but update it to the
        # actual on-disk path if needed.
        with storage._lock:
            storage._jobs[job_id]["video_path"] = video_path

        # --- Start background processing (skipped in test mode) ---
        if not testing:
            _start_processing_thread(app, job_id)

        return jsonify({"jobId": job_id, "status": "pending"}), 200

    @app.get("/api/status/<job_id>")
    def status(job_id: str):
        storage: JobStorage = app.config["STORAGE"]
        job = storage.get_job(job_id)
        if job is None:
            return jsonify({"error": "Job not found"}), 404
        return jsonify({
            "jobId": job["job_id"],
            "status": job["status"],
            "progress": job["progress"],
            "currentPhase": job["current_phase"],
            "language": job["language"],
            "durationSeconds": job["duration_seconds"],
            "errorMessage": job["error_message"],
            "createdAt": job["created_at"],
            "updatedAt": job["updated_at"],
        })

    @app.get("/api/download/<job_id>")
    def download(job_id: str):
        storage: JobStorage = app.config["STORAGE"]
        job = storage.get_job(job_id)
        if job is None:
            return jsonify({"error": "Job not found"}), 404

        if job["status"] != "completed":
            return jsonify({"error": "Job not completed yet"}), 409

        output_path = job.get("output_path")
        if not output_path or not os.path.isfile(output_path):
            return jsonify({"error": "Output file not found"}), 404

        return send_file(output_path, as_attachment=True)

    @app.delete("/api/jobs/<job_id>")
    def delete_job(job_id: str):
        storage: JobStorage = app.config["STORAGE"]
        job = storage.get_job(job_id)
        if job is None:
            return jsonify({"error": "Job not found"}), 404

        # Remove associated files
        for path_key in ("video_path", "output_path"):
            path = job.get(path_key)
            if path and os.path.isfile(path):
                try:
                    os.remove(path)
                except OSError:
                    pass

        storage.delete_job(job_id)
        return jsonify({"deleted": True})

    return app


def _start_processing_thread(app: Flask, job_id: str) -> None:
    """Start a background thread to process the video job."""
    def run():
        with app.app_context():
            storage: JobStorage = app.config["STORAGE"]
            storage.update_status(job_id, status="processing", phase="starting")
            try:
                # Import here to avoid heavy deps at startup
                from processor import process_job  # type: ignore[import]
                process_job(app, job_id)
            except Exception as exc:  # noqa: BLE001
                storage.update_status(job_id, status="failed", error=str(exc))

    thread = threading.Thread(target=run, daemon=True)
    thread.start()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    application = create_app()
    application.run(host="0.0.0.0", port=port, debug=debug)
