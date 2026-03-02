# FaultForge 🔥

A distributed chaos engineering and fault injection testing platform for resilience validation and system reliability testing.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**FaultForge** is a comprehensive chaos engineering platform designed to help teams validate system resilience through controlled fault injection. It enables you to simulate real-world failures (CPU stress, network latency) across distributed agents and monitor how your systems respond, ensuring high availability and reliability.

The platform follows a **distributed agent architecture** where multiple agents can be deployed across different machines, and a central control panel orchestrates attacks in real-time with live dashboard monitoring.

---

## Features

✨ **Core Capabilities:**

- 🤖 **Distributed Agent Architecture** - Deploy agents across multiple machines for comprehensive testing
- 🎯 **Multi-Attack Types** - CPU stress and network latency injection
- 📊 **Real-time Dashboard** - Live visualization of agents, attacks, and targets
- 🎮 **Centralized Control Panel** - Manage all agents and attacks from a single interface
- 🗄️ **Persistent Storage** - PostgreSQL backend for attack history and agent tracking
- ⚡ **RESTful API** - Complete API for programmatic control and integration
- 📱 **Responsive UI** - Modern React-based dashboard with Tailwind CSS
- 🔄 **Attack Scheduling** - Schedule targeted attacks on specific systems
- 📈 **Status Tracking** - Monitor attack status (Pending, In Progress, Completed, Failed, Cancelled)

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

## Tech Stack

### Frontend
- **React 18+** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built UI components

### Backend
- **Node.js + Express.js** - API server
- **TypeScript** - Type-safe backend development
- **Prisma** - ORM for database operations
- **PostgreSQL 15** - Primary database
- **Axios** - HTTP client for agent communication

### Architecture & DevOps
- **pnpm** - Fast, disk space efficient package manager
- **Monorepo** - Unified workspace for all packages
- **Docker Compose** - Local development environment
- **ts-node-dev** - TypeScript execution in development

---

## Project Structure

```
faultforge/
├── packages/
│   ├── agent/                    # Chaos Agent Package
│   │   ├── src/
│   │   │   ├── index.ts         # Agent entry point
│   │   │   ├── executor.ts      # Attack execution logic
│   │   │   ├── identity.ts      # Agent registration
│   │   │   ├── poller.ts        # Control panel polling
│   │   │   └── weapons/         # Attack implementations
│   │   │       ├── cpu-stress.ts
│   │   │       └── network-latency.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── control-panel/            # Control Panel API
│   │   ├── src/
│   │   │   ├── index.ts         # Express server setup
│   │   │   ├── controllers/
│   │   │   │   ├── agent.controller.ts
│   │   │   │   ├── attack.controller.ts
│   │   │   │   └── target.controller.ts
│   │   │   ├── routes/
│   │   │   │   ├── agent.routes.ts
│   │   │   │   ├── attack.routes.ts
│   │   │   │   └── target.routes.ts
│   │   │   └── lib/
│   │   │       └── prisma.ts    # Prisma client
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── dashboard/                # Frontend Dashboard
│   │   ├── src/
│   │   │   ├── main.tsx         # React entry point
│   │   │   ├── App.tsx          # Root component
│   │   │   ├── components/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── AttackTypeIconLabel.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   └── ui/          # UI component library
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── lib/
│   │   │   │   ├── api.ts       # API client
│   │   │   │   ├── types.ts     # Type definitions
│   │   │   └── pages/           # Page components
│   │   ├── vite.config.ts
│   │   └── tailwind.config.ts
│   │
│   └── shared/                   # Shared Types & Utils
│       ├── src/
│       │   └── index.ts
│       └── package.json
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
│
├── docker-compose.yml           # Local PostgreSQL setup
├── package.json                 # Root workspace config
├── pnpm-workspace.yaml          # Monorepo configuration
└── README.md
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18+ recommended)
- **pnpm** (v8+) - [Install pnpm](https://pnpm.io/installation)
- **PostgreSQL** (v15+) - or use Docker
- **Docker & Docker Compose** (for database in development)

**Verify installations:**
```bash
node --version
pnpm --version
docker --version
docker-compose --version
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/faultforge.git
cd faultforge
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install dependencies for all packages in the monorepo due to the `pnpm-workspace.yaml` configuration.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5433/faultforge"

# Control Panel Server
PORT=3000
NODE_ENV=development

# Agent Configuration
CONTROL_PANEL_URL="http://localhost:3000"
POLL_INTERVAL_MS=5000
AGENT_VERSION=0.1.0
```

Create a `.env.local` file in `packages/dashboard`:

```env
VITE_API_URL="http://localhost:3000/api"
```

### 4. Start PostgreSQL

Using Docker Compose:

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5433.

### 5. Set Up Database Schema

Run Prisma migrations:

```bash
pnpm exec prisma migrate deploy
```

Or for development with auto-generation:

```bash
pnpm exec prisma migrate dev
```

---

## Running the Application

### Development Mode

Run all services in development mode (from root directory):

**Terminal 1 - Control Panel API:**
```bash
pnpm dev:panel
```
Server runs on `http://localhost:3000`

**Terminal 2 - Dashboard:**
```bash
pnpm dev:dashboard
```
Frontend runs on `http://localhost:5173`

**Terminal 3 - Agent:**
```bash
pnpm dev:agent
```
Agent connects and polls the control panel

### Health Check

Verify the control panel is running:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "faultforge-control-panel",
  "timestamp": "2026-03-02T12:00:00.000Z"
}
```

---

## Configuration

### Environment Variables

#### Root `.env`
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5433/faultforge` |
| `PORT` | Control panel server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `CONTROL_PANEL_URL` | Base URL for agents to reach control panel | `http://localhost:3000` |
| `POLL_INTERVAL_MS` | How often agents poll for attacks (milliseconds) | `5000` |
| `AGENT_VERSION` | Agent version string | `0.1.0` |

#### Dashboard `.env.local`
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL for dashboard | `http://localhost:3000/api` |

### Database Configuration

PostgreSQL is configured via `DATABASE_URL`. The connection string format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

For local development:
- Host: `localhost`
- Port: `5433` (expose port in docker-compose)
- User: `postgres`
- Password: `password`
- Database: `faultforge`

---

## API Documentation

### Base URL: `http://localhost:3000/api`

### Agent Endpoints

#### Register Agent
```http
POST /api/agents/register
Content-Type: application/json

{
  "hostname": "my-machine",
  "ipAddress": "192.168.1.100",
  "platform": "linux",
  "arch": "x64",
  "version": "0.1.0"
}
```

**Response:** 
```json
{
  "id": "uuid",
  "hostname": "my-machine",
  "ipAddress": "192.168.1.100",
  "platform": "linux",
  "arch": "x64",
  "status": "IDLE",
  "lastSeenAt": "2026-03-02T12:00:00Z"
}
```

#### Get All Agents
```http
GET /api/agents
```

#### Get Agent by ID
```http
GET /api/agents/{agentId}
```

#### Get Agent Attacks
```http
GET /api/agents/{agentId}/attacks
```

---

### Attack Endpoints

#### Create Attack
```http
POST /api/attacks
Content-Type: application/json

{
  "agentId": "agent-uuid",
  "targetId": "target-uuid",
  "type": "CPU_STRESS",    // or "NETWORK_LATENCY"
  "payload": {
    "duration": 30000,     // milliseconds
    "intensity": 90        // CPU percentage or latency in ms
  }
}
```

#### Get All Attacks
```http
GET /api/attacks
```

#### Get Attack by ID
```http
GET /api/attacks/{attackId}
```

#### Cancel Attack
```http
PATCH /api/attacks/{attackId}/cancel
```

#### Get Attacks by Status
```http
GET /api/attacks?status=PENDING
GET /api/attacks?status=IN_PROGRESS
GET /api/attacks?status=COMPLETED
GET /api/attacks?status=FAILED
```

---

### Target Endpoints

#### Create Target
```http
POST /api/targets
Content-Type: application/json

{
  "name": "Production API",
  "baseUrl": "https://api.example.com",
  "description": "Main production API server"
}
```

#### Get All Targets
```http
GET /api/targets
```

#### Get Target by ID
```http
GET /api/targets/{targetId}
```

#### Update Target
```http
PUT /api/targets/{targetId}
```

#### Delete Target
```http
DELETE /api/targets/{targetId}
```

---

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "faultforge-control-panel",
  "timestamp": "2026-03-02T12:00:00.000Z"
}
```

---

## Database Schema

### Entities

#### Agent
Represents a registered chaos agent running on a machine.

```prisma
model Agent {
  id           String      @id @default(uuid())
  hostname     String
  ipAddress    String
  platform     String
  arch         String
  version      String
  status       AgentStatus @default(IDLE)
  lastSeenAt   DateTime    @default(now())
  registeredAt DateTime    @default(now())
  attacks      Attack[]
}
```

**Status Values:**
- `IDLE` - Agent is ready for attacks
- `BUSY` - Agent is currently executing attacks
- `OFFLINE` - Agent hasn't checked in recently

#### Attack
Represents a scheduled or completed fault injection attack.

```prisma
model Attack {
  id           String       @id @default(uuid())
  agentId      String
  agent        Agent        @relation(fields: [agentId], references: [id])
  targetId     String?
  target       Target?      @relation(fields: [targetId], references: [id])
  type         AttackType
  payload      Json
  status       AttackStatus @default(PENDING)
  scheduledAt  DateTime     @default(now())
  startedAt    DateTime?
  completedAt  DateTime?
  errorMessage String?
}
```

**Status Values:**
- `PENDING` - Attack scheduled but not started
- `IN_PROGRESS` - Attack is currently executing
- `COMPLETED` - Attack finished successfully
- `FAILED` - Attack failed with error
- `CANCELLED` - Attack was cancelled by user

**Attack Types:**
- `CPU_STRESS` - Intensive CPU utilization attack
- `NETWORK_LATENCY` - Network latency injection

#### Target
Represents a system or service that can be targeted by attacks.

```prisma
model Target {
  id          String   @id @default(uuid())
  name        String
  baseUrl     String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  attacks     Attack[]
}
```

---

## Development

### Project Scripts

```bash
# Install all dependencies (monorepo)
pnpm install

# Development servers
pnpm dev:panel       # Start control panel on port 3000
pnpm dev:dashboard   # Start dashboard on port 5173
pnpm dev:agent       # Start chaos agent with polling

# Build
pnpm -r build        # Build all packages

# Database
pnpm exec prisma studio              # Open Prisma Studio (GUI)
pnpm exec prisma migrate dev          # Create and run migrations
pnpm exec prisma migrate deploy       # Apply migrations
pnpm exec prisma generate             # Generate Prisma client

# Testing
pnpm -r test         # Run tests in all packages
```

### Code Structure

**Agent Package** - Distributed fault injection agent
- `executor.ts` - Main attack execution logic
- `identity.ts` - Agent self-registration
- `poller.ts` - Polls control panel for attack commands
- `weapons/*` - Individual attack implementations

**Control Panel Package** - Central orchestration API
- `controllers/*` - Business logic for agents, attacks, targets
- `routes/*` - API endpoint definitions
- RESTful interface for dashboard and external clients

**Dashboard Package** - React frontend
- `pages/*` - Main dashboard pages
- `components/*` - Reusable React components
- `lib/api.ts` - API client wrapper
- `hooks/*` - Custom React hooks for state management

### Adding New Attack Types

1. Create a new weapon in `packages/agent/src/weapons/{attack-name}.ts`
2. Add corresponding enum value to `prisma/schema.prisma`
3. Update the agent executor to handle the new type
4. Add controller logic in control panel
5. Update dashboard UI to support the new attack type

Example weapon implementation pattern:
```typescript
export async function executeAttack(payload: any): Promise<void> {
  // Implementation
}
```

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with clear, descriptive commits
   ```bash
   git commit -m "feat: add new attack type"
   ```

3. **Test thoroughly**
   - Test in development environment
   - Verify all packages still build
   - Check dashboard functionality

4. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Development Best Practices

- Use TypeScript for type safety
- Follow the existing code style
- Update documentation when adding features
- Test changes in development mode before pushing
- Keep commits focused and atomic

---

## Troubleshooting

### Agent can't connect to control panel

**Issue:** Agent keeps retrying connection
```
GET /api/agents/ping - Connection refused
```

**Solution:**
1. Ensure control panel is running: `pnpm dev:panel`
2. Check `CONTROL_PANEL_URL` matches server location
3. Verify firewall isn't blocking port 3000

### Database connection failed

**Issue:** `connect ECONNREFUSED 127.0.0.1:5433`

**Solution:**
1. Start PostgreSQL: `docker-compose up -d`
2. Verify container is running: `docker ps`
3. Check `DATABASE_URL` is correct
4. Run migrations: `pnpm exec prisma migrate deploy`

### Port already in use

**Issue:** `Error: listen EADDRINUSE :::3000`

**Solution:**
```bash
# Find process using port
lsof -i :3000      # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or use different port
kill -9 <PID>      # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change PORT in .env
PORT=3001 pnpm dev:panel
```

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Support & Feedback

For issues, questions, or feature requests, please open an issue on GitHub.

**Last Updated:** March 2, 2026

Happy chaos engineering! 🚀
