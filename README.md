# Jobber - AI Career Operating System

An AI-powered platform for managing the complete hiring lifecycle.

## Modules

| Module | Description |
|--------|-------------|
| Career Profile | Master career profile management |
| Resume Generator | AI-powered resume generation |
| ATS Optimizer | Applicant tracking system optimization |
| Job Analysis | Job description analysis |
| Company Research | Company intelligence gathering |
| Recruiter CRM | Recruiter relationship management |
| Email Intelligence | Smart email management |
| Interview Prep | Interview preparation tools |
| Portfolio | Portfolio generation |
| Analytics | Career analytics dashboard |

## Tech Stack

### Frontend
- React 19, TypeScript, Vite
- Tailwind CSS v4, shadcn/ui
- TanStack Query, Zustand, React Router

### Backend
- FastAPI, Python 3.13+
- SQLAlchemy 2 (async), Alembic, Pydantic v2
- PostgreSQL, Redis, Celery

### Infrastructure
- Docker, Docker Compose
- Nginx, GitHub Actions CI

## Project Structure

```
jobber/
  apps/
    frontend/       # React frontend
    backend/        # FastAPI backend
    admin/          # Admin panel (future)
    docs/           # Documentation (future)
  packages/
    shared/         # Shared types and constants
    api-client/     # API client library
    schemas/        # Shared data schemas
    utils/          # Utility functions
    config/         # Shared configuration
    prompts/        # AI prompt templates
    ui/             # Shared UI components
  infrastructure/
    docker/         # Dockerfiles
    nginx/          # Nginx configuration
    scripts/        # Utility scripts
    monitoring/     # Monitoring setup
  .github/
    workflows/      # CI/CD pipelines
```

## Getting Started

### Prerequisites

- Python 3.13+
- Node.js 22+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/jobber.git
   cd jobber
   ```

2. Start infrastructure services:
   ```bash
   docker compose up -d postgres redis
   ```

3. Set up the backend:
   ```bash
   cd apps/backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   alembic upgrade head
   uvicorn app.main:app --reload
   ```

4. Set up the frontend:
   ```bash
   cd apps/frontend
   npm install
   npm run dev
   ```

5. Open http://localhost:5173

### Docker Development

```bash
docker compose up
```

- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Backend Commands
```bash
# Lint
cd apps/backend && ruff check .
# Format
ruff format .
# Type check
mypy app/
# Tests
pytest
```

### Frontend Commands
```bash
# Lint
cd apps/frontend && npm run lint
# Format
npm run format
# Type check
npm run type-check
# Build
npm run build
```

## License

Private - All rights reserved.
