<div align="center">

# 🚂 Truck & Wagon AI Detection Platform

### AI-Powered Railway Inspection & Intelligent Monitoring System

**Real-time truck and wagon detection, object localization, analytics, and automated reporting — powered by YOLO11, FastAPI, Node.js, PostgreSQL, and Next.js.**

An end-to-end computer vision platform designed to modernize railway inspection workflows through automated detection, structured analytics, and enterprise-grade reporting — built for scale, reliability, and real-world deployment.

</div>

<div align="center">

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](#-license)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](#)
[![YOLO11](https://img.shields.io/badge/YOLO11-Ultralytics-purple?style=for-the-badge&logo=yolo&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](#)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](#)
[![GitHub Stars](https://img.shields.io/github/stars/samarthmantri07-cell/truck-wagon-ai-platform?style=for-the-badge&logo=github)](https://github.com/samarthmantri07-cell/truck-wagon-ai-platform)
</div>

---

## 📚 Table of Contents

- [🧭 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [🖼️ Screenshots](#️-screenshots)
- [📁 Folder Structure](#-folder-structure)
- [⚙️ Installation](#️-installation)
- [🔐 Environment Variables](#-environment-variables)
- [🔌 API Endpoints](#-api-endpoints)
- [🧠 AI Pipeline](#-ai-pipeline)
- [🗄️ Database Design](#️-database-design)
- [⚡ Performance](#-performance)
- [🚀 Future Enhancements](#-future-enhancements)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Author](#-author)
- [🙏 Acknowledgements](#-acknowledgements)

---

## 🧭 Project Overview

### Problem Statement

Manual railway inspection of trucks and wagons is time-consuming, inconsistent, and prone to human error. Inspectors must visually assess components across large rail yards, often without structured record-keeping, standardized confidence metrics, or centralized historical data — leading to delayed defect detection and inefficient maintenance scheduling.

### Solution

The **Truck & Wagon AI Detection Platform** automates this process end-to-end. It ingests images and video from inspection points, runs real-time object detection using a fine-tuned **YOLO11** model, and returns structured, confidence-scored results. These results are persisted, visualized, and made actionable through a modern web dashboard — enabling inspectors and rail operators to monitor detections, review historical trends, and generate formal reports in seconds instead of hours.

### Real-World Applications

| Application | Description |
|---|---|
| 🚆 **Rail Yard Inspection** | Automated scanning of trucks and wagons at inspection checkpoints |
| 🏭 **Depot Monitoring** | Continuous live-feed detection at maintenance depots |
| 📊 **Fleet Analytics** | Historical trend analysis across inspection cycles |
| 📝 **Compliance Reporting** | Auto-generated PDF reports for audits and regulatory review |

### Benefits

> [!TIP]
> - ⏱️ Drastically reduces manual inspection time
> - 🎯 Consistent, confidence-scored detection results
> - 📈 Centralized analytics for data-driven maintenance decisions
> - 🧩 Modular architecture enabling independent scaling of each service
> - 🖥️ Modern, responsive dashboard accessible from any device

## 📌 Project Statistics

| Property | Value |
|-----------|--------|
| Frontend | Next.js 15 |
| Backend | Express.js |
| AI Engine | FastAPI |
| Detection Model | YOLO11 |
| Database | PostgreSQL |
| ORM | Prisma |
| Language | TypeScript + Python |
| Authentication | JWT |
| Architecture | Three-Tier |
| License | MIT |

---

## ✨ Features

| Feature | Description | Status |
|---|---|:---:|
| 🖼️ Modern Landing Page | Professional, responsive marketing/entry page | ✅ Stable |
| 🔐 Authentication | Secure JWT-based login and session handling | ✅ Stable |
| 📊 Dashboard | Central hub for inspections, analytics, and history | ✅ Stable |
| 🎥 Live Detection | Real-time detection from live camera/video feed | ✅ Stable |
| 🖼️ Image Detection | Upload and detect objects in static images | ✅ Stable |
| 🎞️ Video Detection | Upload and process video files for detection | ✅ Stable |
| 🧠 YOLO11 Object Detection | Core detection engine for trucks/wagons | ✅ Stable |
| 🕒 Detection History | Persisted log of all past detection runs | ✅ Stable |
| 📈 Analytics Dashboard | Visualized trends and detection statistics | ✅ Stable |
| 📄 PDF Report Generation | Exportable, formatted inspection reports | ✅ Stable |
| 🔌 REST APIs | Well-documented endpoints across all services | ✅ Stable |
| 👥 Role-Based Authentication | Access control by user role | ✅ Stable |
| 📤 Image Upload | Multi-format image ingestion | ✅ Stable |
| 📤 Video Upload | Multi-format video ingestion | ✅ Stable |
| 🎯 Confidence Scores | Per-detection confidence metrics | ✅ Stable |
| 🔲 Bounding Boxes | Visual localization of detected objects | ✅ Stable |
| 🧾 Detection Logs | Structured logs for every inference run | ✅ Stable |
| 🗄️ PostgreSQL Database | Persistent relational data storage | ✅ Stable |
| 📱 Responsive UI | Fully responsive across devices | ✅ Stable |

---

## 🏗️ Architecture

<details>
<summary><b>📐 Click to expand system architecture diagram</b></summary>

```
                      ┌───────────────────────┐
                      │        Browser        │
                      │   (User Interaction)  │
                      └───────────┬───────────┘
                                  │  HTTPS
                                  ▼
                      ┌───────────────────────┐
                      │       Frontend        │
                      │  Next.js · TypeScript  │
                      │  Tailwind · Zustand    │
                      └───────────┬───────────┘
                                  │  REST API
                                  ▼
                      ┌───────────────────────┐
                      │        Backend        │
                      │ Node.js · Express.js   │
                      │ Prisma ORM · JWT Auth  │
                      └───────────┬───────────┘
                                  │  REST API
                                  ▼
                      ┌───────────────────────┐
                      │       AI Engine       │
                      │  Python · FastAPI      │
                      │  OpenCV · Ultralytics  │
                      └───────────┬───────────┘
                                  │  Inference
                                  ▼
                      ┌───────────────────────┐
                      │         YOLO11        │
                      │   Object Detection     │
                      └───────────┬───────────┘
                                  │  Structured Results
                                  ▼
                      ┌───────────────────────┐
                      │        Database        │
                      │       PostgreSQL       │
                      └───────────────────────┘
```

</details>

> [!NOTE]
> Each layer is independently deployable, allowing the AI Engine, Backend, and Frontend to scale separately based on load.

## 📊 System Flow

```mermaid
flowchart LR

A[User]

A --> B[Next.js Frontend]

B --> C[Express Backend]

C --> D[FastAPI AI Engine]

D --> E[YOLO11]

C --> F[(PostgreSQL)]
```
---

## 🛠️ Technology Stack

### Frontend

| Category | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 | Server-rendered React application framework |
| UI Library | React | Component-based UI construction |
| Language | TypeScript | Type-safe application development |
| Styling | Tailwind CSS | Utility-first responsive styling |
| Animation | Framer Motion | Smooth UI transitions and micro-interactions |
| 3D/Visuals | Three.js | Advanced visual/graphics rendering |
| Data Fetching | TanStack Query | Server-state management and caching |
| Forms | React Hook Form | Performant form validation and handling |
| State Management | Zustand | Lightweight global state management |

## 📈 Repository Information

| Item | Details |
|------|----------|
| Project Type | AI + Full Stack |
| Development Status | Active |
| Platform | Railway Inspection |
| AI Framework | YOLO11 |
| Backend | Express.js |
| Frontend | Next.js |
| API | REST |
| Database | PostgreSQL |
| License | MIT |

### Backend

| Category | Technology | Purpose |
|---|---|---|
| Runtime | Node.js | JavaScript server runtime |
| Framework | Express.js | REST API routing and middleware |
| ORM | Prisma ORM | Type-safe database access layer |
| Database Driver | PostgreSQL | Relational data persistence |
| Authentication | JWT | Stateless secure authentication |
| File Handling | Multer | Multipart image/video upload handling |

### AI Engine

| Category | Technology | Purpose |
|---|---|---|
| Language | Python | Core AI service implementation |
| Framework | FastAPI | High-performance async API layer |
| Detection Model | YOLO11 (Ultralytics) | Real-time object detection |
| Computer Vision | OpenCV | Image/video processing |
| Numerical Computing | NumPy | Array and matrix operations |
| Image Processing | Pillow | Image manipulation utilities |

### Database

| Category | Technology | Purpose |
|---|---|---|
| RDBMS | PostgreSQL | Primary structured data store |

---

## 📁 Folder Structure

```
truck-wagon-ai-platform/
│
├── frontend/                   # Next.js client application
│   ├── src/
│   │   ├── app/                 # App router pages & layouts
│   │   ├── components/          # Reusable UI components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── store/                # Zustand state stores
│   │   ├── lib/                  # Utilities & API clients
│   │   └── styles/                # Global Tailwind styles
│   ├── public/                    # Static assets
│   └── package.json
│
├── backend/                    # Node.js / Express API server
│   ├── src/
│   │   ├── controllers/          # Route controllers
│   │   ├── routes/                # Express route definitions
│   │   ├── middleware/            # Auth & validation middleware
│   │   ├── services/              # Business logic layer
│   │   └── utils/                  # Helper utilities
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   └── package.json
│
├── ai-engine/                  # FastAPI + YOLO11 inference service
│   ├── app/
│   │   ├── api/                    # FastAPI route definitions
│   │   ├── models/                  # YOLO11 model weights & loaders
│   │   ├── services/                 # Inference & processing logic
│   │   └── utils/                     # Image/video helper functions
│   ├── requirements.txt
│   └── main.py
│
├── database/                   # Database migrations & seed scripts
│   ├── migrations/
│   └── seed/
│
├── docs/                        # Documentation & screenshots
│   └── screenshots/
│
├── docker/                       # Dockerfiles & compose configs
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── ai-engine.Dockerfile
│
├── scripts/                       # Automation & setup scripts
│
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/samarthmantri07-cell/truck-wagon-ai-platform.git
```

<details>
<summary><b>2️⃣ Frontend Installation</b></summary>

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend will be available at `http://localhost:3000`

</details>

<details>
<summary><b>3️⃣ Backend Installation</b></summary>

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend API will be available at `http://localhost:5000`

</details>

<details>
<summary><b>4️⃣ AI Engine Installation</b></summary>

```bash
cd ai-engine
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

AI Engine will be available at `http://localhost:8000`

</details>

<details>
<summary><b>5️⃣ Database Setup</b></summary>

```bash
# Ensure PostgreSQL is running locally or via Docker
createdb truck_wagon_ai

cd backend
npx prisma migrate deploy
npx prisma db seed
```

</details>

> [!IMPORTANT]
> Ensure all three services (`frontend`, `backend`, `ai-engine`) are running concurrently, and that PostgreSQL is accessible before starting the backend service.

---

## 🔐 Environment Variables

<details>
<summary><b>Frontend — <code>.env.local</code></b></summary>

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Truck & Wagon AI Detection Platform
```

</details>

<details>
<summary><b>Backend — <code>.env</code></b></summary>

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/truck_wagon_ai
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
AI_ENGINE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
```

</details>

<details>
<summary><b>AI Engine — <code>.env</code></b></summary>

```env
MODEL_PATH=./app/models/yolo11.pt
CONFIDENCE_THRESHOLD=0.5
DEVICE=cuda
MAX_UPLOAD_SIZE_MB=100
BACKEND_CALLBACK_URL=http://localhost:5000/api
```

</details>

---

## 🔌 API Endpoints

### 🔑 Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT |
| `POST` | `/api/auth/logout` | Invalidate current session |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile |

### 🎯 Detection

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/detection/image` | Run detection on uploaded image |
| `POST` | `/api/detection/video` | Run detection on uploaded video |
| `POST` | `/api/detection/live` | Stream live feed for real-time detection |
| `GET` | `/api/detection/history` | Retrieve detection history |
| `GET` | `/api/detection/:id` | Retrieve a specific detection record |

### 📄 Reports

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reports/generate` | Generate a PDF inspection report |
| `GET` | `/api/reports` | List all generated reports |
| `GET` | `/api/reports/:id` | Download a specific report |

### 📊 Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/summary` | Retrieve aggregated detection statistics |
| `GET` | `/api/analytics/trends` | Retrieve trend data over time |

### 👥 Users

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List all users *(admin only)* |
| `GET` | `/api/users/:id` | Retrieve a specific user |
| `PUT` | `/api/users/:id` | Update user details |
| `DELETE` | `/api/users/:id` | Remove a user *(admin only)* |

---

## 🧠 AI Pipeline

```
   Image / Video Input
           │
           ▼
        Upload
           │
           ▼
       FastAPI Layer
           │
           ▼
      YOLO11 Model
           │
           ▼
       Inference
           │
           ▼
     Bounding Boxes
           │
           ▼
     JSON Response
           │
           ▼
    Backend (Express)
           │
           ▼
   PostgreSQL Database
           │
           ▼
   Frontend (Next.js)
           │
           ▼
       Dashboard
```

Each stage of the pipeline is decoupled — the AI Engine performs inference and returns structured JSON, the Backend persists and enriches this data, and the Frontend visualizes it in real time on the dashboard.

---

## 🗄️ Database Design

The platform uses **PostgreSQL** as its primary relational data store, managed through **Prisma ORM** for type-safe queries, schema migrations, and seed management.

> [!NOTE]
> Prisma's schema-first approach ensures the database structure stays in sync with backend models, while auto-generated types reduce runtime errors across the API layer.

Key responsibilities of the database layer include:

- Storing user accounts, roles, and authentication metadata
- Persisting detection records with confidence scores and bounding box coordinates
- Maintaining historical logs for every inspection run
- Supporting analytics queries through indexed, relational data

---

## ⚡ Performance

- 🚀 **Fast Inference** — Optimized YOLO11 pipeline for low-latency detection
- 📈 **Scalable Architecture** — Each service scales independently based on demand
- 🔌 **REST APIs** — Lightweight, stateless communication between services
- 🧩 **Modular Services** — Clear separation of Frontend, Backend, and AI Engine
- 🛳️ **Independent Deployment** — Each module can be deployed, updated, or scaled without affecting the others

---

## 🚀 Future Enhancements

- [ ] 🛰️ Drone-based aerial inspection
- [ ] 🌡️ Thermal camera integration for heat-based anomaly detection
- [ ] 🔤 OCR for wagon ID and serial number recognition
- [ ] 🔧 Predictive maintenance using historical detection trends
- [ ] ☁️ Cloud-native deployment support
- [ ] 🐳 Docker Swarm orchestration
- [ ] ☸️ Kubernetes-based deployment
- [ ] 🧱 Full microservices decomposition

---
## 🧹 Repository Structure

- Modular Architecture
- Independent AI Engine
- REST APIs
- Separate Frontend & Backend
- Prisma ORM
- PostgreSQL Database
- YOLO11 Detection Engine

## 🤝 Contributing

Contributions are welcome and appreciated! To contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

> [!TIP]
> Please ensure your code follows the existing style conventions and includes relevant tests where applicable.

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Truck & Wagon AI Detection Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, subject to the following conditions...
```

See the [LICENSE](LICENSE) file for full details.

---

## 👤 Author

<div align="center">

# Samarth Mantri

AI/ML Engineer • Full Stack Developer • Computer Engineering Student

Passionate about building AI-powered applications, computer vision systems, and scalable full-stack solutions.

[![GitHub](https://img.shields.io/badge/GitHub-@samarthmantri07--cell-181717?style=for-the-badge&logo=github)](https://github.com/samarthmantri07-cell)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Samarth_Mantri-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/samarth-mantri-64586736b)

</div>

---

## 🙏 Acknowledgements

- [Ultralytics](https://github.com/ultralytics/ultralytics) — for the YOLO11 object detection framework
- [Next.js](https://nextjs.org/) — for the powerful React framework powering the frontend
- [Prisma](https://www.prisma.io/) — for a seamless, type-safe database toolkit
- [FastAPI](https://fastapi.tiangolo.com/) — for the high-performance Python API framework
- [OpenCV](https://opencv.org/) — for robust computer vision processing

---

<div align="center">

**⭐ If you find this project useful, consider giving it a star!**

</div>
