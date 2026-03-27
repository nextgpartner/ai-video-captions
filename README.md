# AI Video Captions

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](docker-compose.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Free, open-source AI video caption generator.** Upload a video, pick from 6 trending caption styles, and download your video with word-by-word animated subtitles burned in.

Self-hosted with Docker. No accounts, no tracking, no limits.

## Features

- **AI Transcription** — Powered by faster-whisper with word-level timestamps
- **6 Caption Styles** — Hormozi, MrBeast, Karaoke, Minimal, Bounce, Classic
- **Word-Level Animation** — Each word animates individually with highlights, wipes, bounces, and scale effects
- **100+ Languages** — Automatic language detection with script-aware font selection
- **Self-Hosted** — Run on your own infrastructure with Docker Compose
- **HD Export** — Download captioned videos in full quality (CRF 18, audio preserved)

## Quick Start

```bash
git clone https://github.com/nicolaigaina/ai-video-captions.git
cd ai-video-captions
docker compose up
```

Open [http://localhost:3000](http://localhost:3000) and start adding captions to your videos.

## Architecture

```
ai-video-captions/
├── frontend/          Next.js 16 (React 19, Tailwind, shadcn/ui)
│   ├── src/app/       Pages: landing, history, result viewer
│   ├── src/components/ UI: dropzone, style picker, phone preview
│   ├── src/actions/   Server actions (proxy to backend)
│   └── prisma/        SQLite schema (job metadata)
│
├── backend/           Flask + faster-whisper + FFmpeg
│   ├── app.py         API endpoints
│   ├── caption_job.py Processing pipeline
│   ├── subtitles.py   ASS subtitle generation
│   └── caption_styles.py Style configuration
│
└── docker-compose.yml Production deployment
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `MAX_FILE_SIZE_MB` | 500 | Maximum upload file size |
| `MAX_DURATION_MINUTES` | 30 | Maximum video duration |
| `WHISPER_MODEL_SIZE` | base | Whisper model (tiny/base/small/medium/large) |
| `OUTPUT_TTL_HOURS` | 24 | Hours to keep output files |
| `MAX_CONCURRENT_JOBS` | 2 | Maximum simultaneous jobs |

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | Python, Flask, faster-whisper, pysubs2, FFmpeg |
| Database | SQLite (via Prisma) |
| Deployment | Docker Compose |

## Development

```bash
# Backend only
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py

# Frontend only
cd frontend
npm install
npm run dev

# Both with Docker (hot reload)
docker compose -f docker-compose.dev.yml up
```

## API Documentation

See [docs/API.md](docs/API.md) for backend endpoint documentation.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built by the team behind [AutoShorts](https://autoshorts.app) — AI-powered video repurposing for content creators.
