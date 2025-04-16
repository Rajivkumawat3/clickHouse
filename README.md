Here's the complete `README.md` file for your ClickHouse integration project:

---

```markdown
# ClickHouse Integration Project

This project is a full-stack solution for interacting with a ClickHouse database through a custom API layer. It consists of a **frontend built with Vite + React**, a **Node.js backend (server.js)** providing API routes, and a **ClickHouse server** running in a Docker container.

---

## 🧩 Architecture Overview

```bash
Frontend (Vite React App on port 5173)
         │
         ▼
Custom API Layer (Node.js in server.js on port 3000)
         │
         ▼
ClickHouse Server (Docker container on port 8123)
```

- **Frontend (React/Vite)** — Collects user input (ClickHouse connection info, table name, CSV-formatted data).
- **Backend (Node.js)** — Processes requests from the frontend, interacts with ClickHouse using HTTP API or client libraries.
- **ClickHouse Server (Docker)** — The actual database engine that stores and retrieves data.

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
```

---

### 2. Start ClickHouse Server (Docker)

First, pull the latest ClickHouse server image:

```bash
docker pull clickhouse/clickhouse-server:latest
```

Then run the container locally:

```bash
docker run -d --name demo-service-db \
  -e CLICKHOUSE_USER=name \
  -e CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1 \
  -e CLICKHOUSE_PASSWORD=secret \
  -p 8123:8123 \
  clickhouse/clickhouse-server
```

✅ This will start a ClickHouse server accessible at: `http://localhost:8123`

To manually interact with ClickHouse (without our APIs), visit:  
👉 [http://localhost:8123/play](http://localhost:8123/play)

---

### 3. Set Up the Backend (Node.js APIs)

Navigate to the clickhouse-client directory (where `server.js` is located):

```bash
cd backend
npm install
npm run dev
```

📡 The custom API server runs on: `http://localhost:3000`

---

### 4. Set Up the Frontend (React + Vite)

Navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

🌐 The React frontend runs on: `http://localhost:5173`

It provides a user interface to:
- Input ClickHouse credentials
- View available tables and schema
- Preview table data
- Ingest CSV-formatted data into tables

---

## 🧪 Testing the Flow

```bash
UI (React @ 5173) 
    ➜ sends data to 
Custom APIs (Node.js @ 3000)
    ➜ which talks to 
ClickHouse Server (Docker @ 8123)
```


