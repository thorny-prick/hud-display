# O.D.I.N — Agent Habitat

**Operational Design Intelligence Network**
A local AI-agent dashboard for visually watching agents process creative tasks.

---

## Folder Structure

```
odin-agent-habitat/
├── frontend/          React + Vite + Tailwind UI
│   └── src/
│       ├── components/    AgentCard, TaskForm, TaskQueue, EventLog, OutputPanel, ApprovalButtons
│       ├── pages/         Dashboard (main layout)
│       ├── hooks/         useSSE (live event stream)
│       └── api/           client.js (FastAPI wrappers)
├── backend/           Python + FastAPI server
│   ├── agents/        6 simulated agent workers
│   ├── api/           REST routes + SSE endpoint
│   ├── core/          Task runner + event bus
│   └── db/            SQLite schema + async connection
├── data/              odin.db (auto-created on first run)
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.11+ and **pip** (or `uv`)

---

## Setup & Run

### 1. Backend

```bash
cd odin-agent-habitat/backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server (from the odin-agent-habitat/ root)
cd ..
uvicorn backend.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000

### 2. Frontend

Open a second terminal:

```bash
cd odin-agent-habitat/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## How to Use

1. Open http://localhost:5173 in your browser.
2. Fill in the **New Task** form (title, service type, brief, style notes).
3. Click **[ LAUNCH PIPELINE ]**.
4. Watch the **Agent Cards** light up as each agent works.
5. Read the **Live Event Log** for real-time status.
6. Click a task in the **Task Queue** to see its **Agent Outputs**.
7. When status is **REVIEW**, use the approval buttons:
   - **[ APPROVE ]** → marks task `complete`
   - **[ REVISE ]** → sends task back to `pending`
   - **[ REJECT ]** → marks task `failed`

---

## Agents (Simulated — MVP)

| Agent | Role |
|---|---|
| Brief Agent | Parses the client brief into a structured summary |
| Concept Agent | Generates 3 thumbnail concept descriptions |
| Prompt Agent | Builds primary, alt, and negative image prompts |
| Design Agent | Outputs a full design spec (canvas, type, palette, layout) |
| QA Agent | Runs a checklist against all previous outputs |
| Delivery Agent | Stages a delivery manifest for client handoff |

All agents use `asyncio.sleep()` delays and hardcoded mock outputs. No external API calls are made.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/tasks` | List all tasks |
| `POST` | `/tasks` | Create task + launch pipeline |
| `GET` | `/tasks/{id}` | Get single task |
| `PATCH` | `/tasks/{id}/status` | Update task status |
| `GET` | `/tasks/{id}/logs` | Get task agent logs |
| `GET` | `/tasks/{id}/outputs` | Get task outputs |
| `GET` | `/agents` | List all agents + status |
| `GET` | `/events/stream` | SSE live event stream |

---

## Next Steps (Phase 2)

- Replace simulated agents with real Claude API calls
- Add image generation via Replicate / Stability AI
- Export actual files to `/exports`
- Add user authentication
- Fiverr order intake integration
