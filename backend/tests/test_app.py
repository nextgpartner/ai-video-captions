"""Tests for Flask API endpoints."""
import io
import pytest

def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert "version" in data

def test_process_no_file(client):
    response = client.post("/api/process", data={"captionStyle": "hormozi", "captionPosition": "10"})
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

def test_process_invalid_style(client):
    data = {"file": (io.BytesIO(b"fake video content"), "test.mp4"), "captionStyle": "nonexistent", "captionPosition": "10"}
    response = client.post("/api/process", data=data, content_type="multipart/form-data")
    assert response.status_code == 400

def test_process_invalid_position(client):
    data = {"file": (io.BytesIO(b"fake video content"), "test.mp4"), "captionStyle": "hormozi", "captionPosition": "99"}
    response = client.post("/api/process", data=data, content_type="multipart/form-data")
    assert response.status_code == 400

def test_process_invalid_file_type(client):
    data = {"file": (io.BytesIO(b"not a video"), "test.txt"), "captionStyle": "hormozi", "captionPosition": "10"}
    response = client.post("/api/process", data=data, content_type="multipart/form-data")
    assert response.status_code == 400

def test_process_valid_request(client):
    data = {"file": (io.BytesIO(b"\x00" * 100), "test.mp4"), "captionStyle": "hormozi", "captionPosition": "10"}
    response = client.post("/api/process", data=data, content_type="multipart/form-data")
    assert response.status_code == 200
    result = response.get_json()
    assert "jobId" in result
    assert result["status"] == "pending"

def test_status_not_found(client):
    response = client.get("/api/status/nonexistent-id")
    assert response.status_code == 404

def test_status_after_submit(client):
    data = {"file": (io.BytesIO(b"\x00" * 100), "test.mp4"), "captionStyle": "mrbeast", "captionPosition": "20"}
    submit_response = client.post("/api/process", data=data, content_type="multipart/form-data")
    job_id = submit_response.get_json()["jobId"]
    response = client.get(f"/api/status/{job_id}")
    assert response.status_code == 200
    status_data = response.get_json()
    assert status_data["jobId"] == job_id
    assert status_data["status"] in ("pending", "processing")

def test_delete_job(client):
    data = {"file": (io.BytesIO(b"\x00" * 100), "test.mp4"), "captionStyle": "hormozi", "captionPosition": "10"}
    submit_response = client.post("/api/process", data=data, content_type="multipart/form-data")
    job_id = submit_response.get_json()["jobId"]
    response = client.delete(f"/api/jobs/{job_id}")
    assert response.status_code == 200
    assert response.get_json()["deleted"] is True
    response = client.get(f"/api/status/{job_id}")
    assert response.status_code == 404

def test_delete_nonexistent(client):
    response = client.delete("/api/jobs/nonexistent")
    assert response.status_code == 404

def test_download_not_found(client):
    response = client.get("/api/download/nonexistent")
    assert response.status_code == 404

def test_download_not_completed(client):
    data = {"file": (io.BytesIO(b"\x00" * 100), "test.mp4"), "captionStyle": "hormozi", "captionPosition": "10"}
    submit_response = client.post("/api/process", data=data, content_type="multipart/form-data")
    job_id = submit_response.get_json()["jobId"]
    response = client.get(f"/api/download/{job_id}")
    assert response.status_code == 409
