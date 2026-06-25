<div align="center">
  <br/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <br/><br/>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>
</p>

# NetWatch — Network & Infrastructure Monitoring System

A modern, real-time network monitoring system built with **React** (Vite) on the frontend and **NestJS** on the backend. Track devices, visualize topology, monitor alerts, and analyze network performance — all in one sleek dashboard.

---

## Features

- **Real-Time Dashboard** — Live overview of network health, device status, and performance metrics
- **Device Management** — Track routers, switches, servers, access points, and firewalls
- **Network Topology** — Visualize device relationships with an interactive topology map
- **Alert System** — Real-time alerts with severity levels (critical, high, warning, info)
- **Performance Analytics** — CPU, memory, latency, and traffic usage trends
- **Live Logs** — Searchable event log with real-time updates
- **Responsive Design** — Dark-themed UI with glassmorphism effects

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Recharts, React Router v6 |
| **Backend** | NestJS 10, TypeScript, Socket.IO, TypeORM |
| **Database** | PostgreSQL (production) / SQL.js (development) |
| **Real-Time** | WebSocket via Socket.IO |

---

## Project Structure

```
netwatch/
├── frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Dashboard/       # Dashboard widgets & panels
│   │   │   └── Layout/          # Sidebar, Header
│   │   ├── hooks/               # Custom hooks (useSocket)
│   │   ├── pages/               # Route pages
│   │   ├── services/            # API & Socket clients
│   │   ├── types/               # TypeScript type definitions
│   │   └── utils/               # Mock data & helpers
│   └── ...
├── backend/                     # NestJS API
│   ├── src/
│   │   ├── config/              # Database configuration
│   │   ├── engine/              # Monitoring engine & alert rules
│   │   ├── gateway/             # WebSocket gateway
│   │   └── modules/             # Feature modules
│   │       ├── alerts/          # Alert management
│   │       ├── devices/         # Device CRUD
│   │       ├── logs/            # Event logging
│   │       ├── metrics/         # Performance metrics
│   │       └── topology/        # Network topology
│   └── ...
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (optional — SQL.js works out of the box)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

### Backend

```bash
cd backend
npm install
npm run start:dev
```

The API runs on `http://localhost:3001`.

### Build for Production

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

---

## Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | API server port |
| `DB_TYPE` | `sqljs` | Database type (`postgres` or `sqljs`) |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |
| `DB_NAME` | `netwatch` | Database name |

---

## Screenshots

| | | |
|---|---|---|
| ![Login](https://placehold.co/400x250/0f172a/38bdf8?text=Login) | ![Dashboard](https://placehold.co/400x250/0f172a/38bdf8?text=Dashboard) | ![Devices](https://placehold.co/400x250/0f172a/38bdf8?text=Devices) |
| ![Topology](https://placehold.co/400x250/0f172a/38bdf8?text=Topology) | ![Alerts](https://placehold.co/400x250/0f172a/38bdf8?text=Alerts) | ![Analytics](https://placehold.co/400x250/0f172a/38bdf8?text=Analytics) |

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for network engineers & sysadmins
</p>
