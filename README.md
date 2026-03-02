# FaultForge 🔥

Test system reliability by simulating failures (CPU stress, network latency) using distributed agents and monitor everything from a central dashboard.

---

## Quick Start (5 minutes)

### 1. Install & Setup (first time only)
```bash
# Install dependencies
pnpm install

# Set up database
docker-compose up -d
pnpm exec prisma migrate deploy
```

### 2. Start Everything
Open 3 terminals and run:
```bash
# Terminal 1 - API Server
pnpm dev:panel

# Terminal 2 - Dashboard
pnpm dev:dashboard

# Terminal 3 - Chaos Agent
pnpm dev:agent
```

**That's it!** 
- Dashboard: `http://localhost:5173`
- API: `http://localhost:3000`
- Database: PostgreSQL on port 5433

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FaultForge Dashboard                     │
│              (React + Vite + Tailwind CSS)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────────┐
│              Control Panel API (Express.js)                 │
│ • Agent Management    • Attack Orchestration                │
│ • Target Management   • Status Monitoring                   │
└─────────────────────────────────────────────────────────────┘
                           │ HTTP/Polling
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
│ Chaos Agent  │  │ Chaos Agent  │  │ Chaos Agent  │
│  (Machine 1) │  │  (Machine 2) │  │  (Machine N) │
│              │  │              │  │              │
│ • CPU Stress │  │ • CPU Stress │  │ • CPU Stress │
│ • Net Latency│  │ • Net Latency│  │ • Net Latency│
└──────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │ PostgreSQL
                 ┌─────────▼──────────┐
                 │   PostgreSQL DB    │
                 │ • Agents           │
                 │ • Attacks          │
                 │ • Targets          │
                 └────────────────────┘
```

---

## What You Need

- **Node.js** v18+
- **Docker & Docker Compose**
- **pnpm** (or npm/yarn)

---

## Basic Commands

```bash
# Build
pnpm build

# Run in development
pnpm dev:panel       # API server (port 3000)
pnpm dev:dashboard   # Web UI (port 5173)
pnpm dev:agent       # Chaos agent

# Database
pnpm exec prisma studio     # View database
pnpm exec prisma migrate dev # Apply migrations
```

---

## Project Folders

- **`packages/agent`** - Runs chaos attacks on machines
- **`packages/control-panel`** - REST API that controls agents
- **`packages/dashboard`** - React web interface
- **`prisma`** - Database schema & migrations

---

## Simple API Examples

**Create an attack:**
```bash
curl -X POST http://localhost:3000/api/attacks \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent-uuid",
    "type": "CPU_STRESS",
    "payload": {"duration": 30000, "intensity": 90}
  }'
```

**Get all agents:**
```bash
curl http://localhost:3000/api/agents
```

**Get attacks status:**
```bash
curl http://localhost:3000/api/attacks
```

---

## Common Issues

**Port 3000 already in use?**
```bash
PORT=3001 pnpm dev:panel
```

**Database won't connect?**
```bash
docker-compose up -d
pnpm exec prisma migrate deploy
```

**Agent can't reach control panel?**
- Make sure `CONTROL_PANEL_URL` in `.env` is correct
- Check if control panel is running

---

## Learn More

- React docs: https://react.dev
- Express docs: https://expressjs.com
- Prisma docs: https://prisma.io
- Docker docs: https://docker.com

---

Made with ❤️ for chaos engineering
