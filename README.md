# MILES

MILES is an AI-powered travel assistant that helps users discover destinations,
plan trips, generate personalized itineraries, save trips, and ask travel questions.
The application is split into three independently deployable services:

- **Frontend** — React and TypeScript single-page application.
- **Backend** — FastAPI API for authentication, persistence, and application
  orchestration.
- **AI Services** — FastAPI API for itinerary generation, retrieval-augmented chat,
  and destination recommendations.

## Architecture

```text
Browser
   |
   v
frontend (Vite / React) -----> backend (FastAPI / PostgreSQL)
                                    |
                                    v
                              aiServices (FastAPI)
                               |              |
                               v              v
                         Azure OpenAI   Azure AI Search
```

Clerk provides user authentication. The frontend sends authenticated requests to
the backend, which verifies Clerk tokens, persists trips and itineraries in
PostgreSQL, and calls `aiServices` for AI-generated content. Azure credentials and
database credentials belong on the server and must never be added to the frontend.

## Repository structure

```text
.
├── aiServices/       # AI generation, chat, search, and recommendations API
├── backend/          # Persistent application API and database migrations
├── frontend/         # React web application
├── .pipelines/       # Azure Pipelines build and deployment definitions
├── README.md
└── STRUCTURE.md      # Detailed component and module reference
```

For service-specific architecture, endpoints, and troubleshooting, see:

- [Backend README](backend/README.md)
- [AI Services README](aiServices/README.md)
- [Frontend README](frontend/README.md)
- [Detailed project structure](STRUCTURE.md)

## Prerequisites

- Git
- Python 3.11 or newer
- Node.js 22.x and npm
- A PostgreSQL database, such as the team Supabase instance
- A Clerk application and development credentials
- Azure OpenAI and Azure AI Search access for the AI service

## Local development

Each service runs in its own terminal. The commands below assume that the repository
root is the current directory.

### 1. Configure the AI service

```powershell
cd aiServices
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Fill in the Azure OpenAI, Azure AI Search, and Azure Blob Storage values in
`aiServices/.env`. Start the service on port `8001`:

```powershell
python -m uvicorn app.main:app --reload --port 8001
```

The API documentation is available at <http://127.0.0.1:8001/docs>.

### 2. Configure the backend

In a second terminal:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Set at least `DATABASE_URL` and `CLERK_WEBHOOK_SECRET` in `backend/.env`.
The example also configures the local AI service at `http://127.0.0.1:8001`.
Apply database migrations and start the API:

```powershell
alembic upgrade head
python -m uvicorn app.main:app --reload --port 8000
```

The API documentation is available at <http://127.0.0.1:8000/docs>. The liveness
endpoint is <http://127.0.0.1:8000/health>.

### 3. Configure the frontend

In a third terminal:

```powershell
cd frontend
npm ci
```

Create `frontend/.env` with:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_API_URL=http://127.0.0.1:8000/
```

Start the development server:

```powershell
npm run dev
```

Open the URL printed by Vite, normally <http://localhost:5173/>.

### macOS/Linux

Use the equivalent commands from each service README. Replace PowerShell commands
with `source .venv/bin/activate`, `cp .env.example .env`, and the corresponding
shell syntax.

## Environment variables

Use each service’s `.env.example` as the source of truth:

| Service | Example file | Main settings |
|---|---|---|
| Backend | [`backend/.env.example`](backend/.env.example) | Database, Clerk, CORS, and AI service URL |
| AI Services | [`aiServices/.env.example`](aiServices/.env.example) | Azure OpenAI, Azure AI Search, and Blob Storage |
| Frontend | `frontend/.env` | Clerk publishable key and backend URL |

Never commit `.env` files, API keys, database passwords, Clerk secrets, or other
private credentials. Only variables prefixed with `VITE_` belong in the frontend
environment, because Vite exposes them to browser code.

## Common development commands

Run commands from the relevant service directory:

```powershell
# Backend
python -m ruff check .
python -m ruff format --check .

# AI service
python -m pytest
python -m ruff check .

# Frontend
npm run lint
npm run build
npm run format:check
```

The backend and AI service READMEs contain additional smoke tests and service-specific
setup notes. Azure AI Search index setup, when required, is documented in
[aiServices/README.md](aiServices/README.md).

## CI/CD

Azure Pipelines validate and deploy each service independently:

- `.pipelines/backend/prBuild.yml` and `deploy.yml`
- `.pipelines/aiServices/prBuild.yml` and `deploy.yml`
- `.pipelines/frontend/prBuild.yml` and `deploy.yml`

Backend and AI service deployments target Azure App Service. The frontend is built
and deployed to Azure Static Web Apps. See [STRUCTURE.md](STRUCTURE.md) for the
pipeline responsibilities and known transitional areas.
