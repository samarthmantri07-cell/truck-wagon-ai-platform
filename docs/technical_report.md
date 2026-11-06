# 1 Executive Summary

## What is this project?
The Truck & Wagon AI Platform is an enterprise-grade Computer Vision and Artificial Intelligence system designed specifically for the logistics, freight, and transportation industries. It utilizes state-of-the-art Deep Learning models (YOLO11) and real-time processing pipelines to automatically detect, classify, and track trucks and railway wagons as they pass through designated gates or rail yards.

## Why was it built?
The project was built to eliminate manual inspection and data entry at logistics chokepoints (like factory gates, weighbridges, and railway yards). Historically, security personnel and operators had to manually identify vehicles, verify if they were loaded or empty, and log their entry/exit times. This manual process is prone to human error, incredibly slow, and inefficient. This system automates the entire workflow with absolute precision.

## Which industry does it solve?
This solution directly targets the **Logistics, Supply Chain, Freight, and Mining** industries. Any industry that relies heavily on the constant movement of physical goods via road (trucks) and rail (wagons) benefits from this automated surveillance and data-aggregation platform.

## Main purpose
The primary purpose is to provide real-time visibility and throughput analytics for physical assets. By running continuous inference on RTSP camera streams, the system extracts critical metadata:
- Vehicle classification (Truck vs. Wagon)
- State classification (Loaded vs. Empty)
- Timestamps and gate tracking
- Confidence scores and anomaly detection

## Real world use case
A major coal mining facility receives thousands of trucks and trains daily. Using this platform, the facility installs cameras at every entry and exit gate. As a truck passes, the system instantly identifies the truck, determines if it is loaded with coal or empty, logs the timestamp, and updates the central dashboard. Operations managers use the dashboard to identify bottlenecks, measure hourly throughput, and cross-reference vehicle logs with weighbridge data to prevent theft.

---

# 2 Complete Project Overview

## Entire workflow
1. **Data Acquisition**: Edge cameras capture continuous video streams of moving traffic at gates.
2. **AI Inference**: The AI Engine ingests the RTSP streams. It runs a pre-trained YOLO11 model to detect objects frame-by-frame. 
3. **State Tracking**: A tracking algorithm (ByteTrack) maintains object identity across frames. 
4. **Data Persistence**: Once a vehicle passes the frame, the final metadata (Type, State, Confidence, Bounding Box) is posted to the Backend via a REST API.
5. **Database Storage**: The Backend (Node.js/Express) validates the payload and stores the event in the PostgreSQL database using Prisma ORM.
6. **Frontend Consumption**: The Next.js Frontend polls or receives WebSocket updates, rendering the live dashboard, analytical charts, and historical logs for operators.

## Architecture
The system follows a modern, decoupled microservices architecture:
- **Presentation Layer**: A Next.js 15 React application providing the UI/UX.
- **Application Layer**: A dual backend approach featuring a high-performance Node.js/Express server for business logic, REST APIs, and database interactions, supplemented by a FastAPI python backend for AI orchestration.
- **AI/Inference Layer**: A specialized Python container running PyTorch and Ultralytics YOLO models with GPU acceleration (CUDA).
- **Data Layer**: PostgreSQL database managed via Prisma ORM for relational data storage, audit logs, and prediction history.

## High level design
The architecture is orchestrated using Docker Compose, allowing all services (Frontend, Backend, AI, Postgres, Nginx) to run in isolated containers. Nginx acts as a reverse proxy, routing `/api/` traffic to the backend and `/` traffic to the Next.js frontend. The AI engine runs asynchronously, communicating with the backend via internal Docker network HTTP calls.

## Communication between services
- **Frontend ↔ Backend**: RESTful API over HTTP/HTTPS. JSON payloads.
- **AI Engine ↔ Backend**: Internal REST API (POST requests containing inference metadata).
- **Backend ↔ Database**: TCP connection over port 5432 using Prisma Client (binary query engine).
- **User ↔ Frontend**: Browser-based HTTP/HTTPS traffic.

## Data flow
Raw Pixels → PyTorch Tensors → YOLO Bounding Boxes → ByteTrack Tracking IDs → JSON Metadata → Express Controller → Prisma Client → PostgreSQL Table → Express Controller → Next.js React Query → Recharts Dashboard UI.

---

# 3 Folder Structure

The repository is modularly organized into specific domains:

### `/frontend`
The Next.js user interface.
- `src/app`: The Next.js 15 App Router directory containing all pages (`/dashboard`, `/live`, `/analytics`, `/reports`, `/history`, `/login`).
- `src/components/ui`: Highly reusable, atomic React components (Card, Button, Badge, Table, Input).
- `src/layouts`: Layout wrappers (DashboardLayout, AuthLayout) providing consistent navigation and structure.
- `src/store`: Zustand state management (e.g., `useUIStore.ts`).
- `src/constants`: Mock data and static configurations (`mockData.ts`).
- `src/styles`: Tailwind CSS global stylesheets.

### `/backend`
The core business logic and API gateway.
- `src/server.js`: The Express application entry point.
- `src/routes`: API route definitions (`authRoutes`, `detectionRoutes`, `dashboardRoutes`).
- `src/controllers`: Request/Response logic for endpoints.
- `src/middleware`: Custom middleware (e.g., JWT authentication, error handling).
- `src/services`: Business logic and external service integrations (e.g., `aiService.js`).
- `prisma/schema.prisma`: The PostgreSQL database schema and data models.

### `/ai-engine`
The machine learning pipeline.
- `inference/runner.py`: The main execution script that loads the YOLO model and processes video streams.
- `weights/`: Stores the PyTorch `.pt` model files (`yolo11n.pt`, `yolo11s.pt`).
- `training/` & `datasets/`: Scripts and tools for retraining the YOLO model on custom data.
- `api/`: A FastAPI wrapper for the AI engine to expose prediction capabilities.

### `/database`
Database management scripts, backups, and raw SQL schemas (handled largely by Prisma in the backend).

### `/docker`
Contains the `Dockerfile` definitions for each service (Frontend, Backend, AI Engine) and Nginx configuration.

### `/scripts`
PowerShell and bash scripts (`start-frontend.ps1`, `start-backend.ps1`) for rapid local development environment bootstrapping.

---

# 4 Frontend Analysis

The frontend is a robust Next.js 15 application leveraging Server Components and Client Components appropriately.

## Pages

### Landing Page (`/page.tsx`)
Acts as a root redirector. Automatically redirects authenticated traffic to the `/dashboard`.

### Dashboard (`/dashboard/page.tsx`)
The central command center. Displays high-level Key Performance Indicators (KPIs) like Total Detected, Loaded vs. Empty counts, and System Accuracy. Features a live-feed placeholder and a scrolling list of recent detections.

### Live Monitoring (`/live/page.tsx`)
Designed for security personnel. Features a massive main viewing area connecting to an RTSP stream (simulated) and a side panel with a real-time event stream of incoming detections. Elements animate into view using Framer Motion.

### Analytics (`/analytics/page.tsx`)
A data-heavy view utilizing `recharts`. Contains a "Throughput Over Time" LineChart and an "Hourly Distribution" stacked BarChart to help management analyze traffic peaks and troughs.

### Login (`/login/page.tsx`)
The authentication gateway. Uses an `AuthLayout` that splits the screen between corporate branding and the credential input form.

### Other Pages
- **Reports**: Interface for generating, viewing, and downloading automated PDF reports.
- **History**: A tabular view of all past detections with filtering and pagination capabilities.
- **Cameras**: Management console for adding/removing RTSP camera streams.
- **Settings**: System-wide configuration.

## Routing and Layouts
Routing relies entirely on the Next.js 15 App Router (`src/app`). 
- `DashboardLayout.tsx`: A persistent shell wrapping internal pages. It features a collapsible sidebar managed by Zustand, dynamic route highlighting, and a top navigation bar with notification badges and user profile access.
- `AuthLayout.tsx`: A minimal layout for public routes.

## State Management
Global state is handled by **Zustand**. 
- `useUIStore.ts` controls the sidebar toggle state (`sidebarOpen`) globally, allowing any component to expand or collapse the navigation without prop drilling.

## Styling & Animations
Tailwind CSS provides utility-class styling. The `tailwind.config.ts` extends the default theme with semantic color variables (`--primary`, `--destructive`, `--success`) supporting a complete Dark Mode implementation. **Framer Motion** powers smooth layout transitions and micro-interactions (e.g., list items sliding in on the Live page).

---

# 5 Backend Analysis

The backend serves as the nervous system, connecting the database, frontend, and AI engine.

## Server Architecture
It utilizes **Express.js** running on Node.js. `server.js` initializes the Express application, applies standard middleware (CORS, Morgan logger, JSON body parser), configures static file serving for the `/uploads` directory, and registers API routers.

## Routes & Controllers
- `/api/auth`: Handles user registration, login, and JWT token issuance.
- `/api/users`: CRUD operations for user management and RBAC (Role Based Access Control).
- `/api/detections`: Webhook endpoints for the AI engine to post inference results, and endpoints for the frontend to fetch paginated detection logs.
- `/api/dashboard`: Aggregation endpoints that compute statistics (counts, averages) directly via Prisma for the dashboard widgets.
- `/api/reports`: Triggers automated PDF generation via `pdfkit` based on date ranges.

## Middleware
- `errorMiddleware`: Catches unhandled exceptions, sanitizes error messages, and returns standard JSON error responses.
- `authMiddleware` (inferred): Verifies JWTs in the `Authorization` header to protect private routes.

## Database Integration
**Prisma ORM** is used for all database interactions. It provides a strongly typed query builder that prevents SQL injection and ensures data integrity between the Node.js application and the Postgres database.

---

# 6 AI Engine

The AI Engine is a standalone Python application optimized for GPU-accelerated computer vision tasks.

## YOLO11 Architecture
The system uses Ultralytics YOLO (You Only Look Once) version 11 for real-time object detection. Both Nano (`yolo11n.pt`) and Small (`yolo11s.pt`) weights are included, allowing a trade-off between inference speed and accuracy based on available hardware.

## Prediction Pipeline
1. **Video Capture**: OpenCV connects to an IP camera RTSP stream.
2. **Preprocessing**: Frames are extracted, resized, and normalized to the YOLO input dimensions (e.g., 640x640).
3. **Inference**: The tensor is passed through the PyTorch model on the GPU.
4. **Postprocessing**: Non-Maximum Suppression (NMS) filters out overlapping bounding boxes. 
5. **Tracking**: Bounding boxes are fed into a tracking algorithm to assign persistent IDs to moving vehicles, preventing double-counting.

## Output Extraction
For each tracked object, the engine determines:
- `className`: "Truck" or "Wagon"
- `state`: "Loaded" (e.g., full of coal) or "Empty"
- `confidence`: The model's certainty (e.g., 0.98)
- `x1, y1, x2, y2`: Bounding box coordinates

The `inference/runner.py` executes this loop and asynchronously transmits JSON payloads to the Express backend when an object exits the frame.

---

# 7 Database

The database is PostgreSQL, structured via the Prisma Schema (`backend/prisma/schema.prisma`).

## Models
- **User**: Stores system operators. Fields: `id`, `username`, `password` (hashed), `role` (Admin, Operator).
- **Upload**: Tracks video or image files processed. Fields: `id`, `filePath`, `status`.
- **Detection**: The core event log. Links an event to an Upload. Fields: `id`, `uploadId`, `success`, `processingTimeMs`.
- **DetectionObject**: The physical items found in a Detection. Fields: `id`, `detectionId`, `className`, `confidence`, `x1, y1, x2, y2`.
- **PredictionHistory**: JSON metadata tracking historical changes.
- **Report**: Logs of generated PDFs. Fields: `reportId`, `date`, `vehicleType`, `filePath`.
- **SystemSetting**: Key-value pairs for dynamic configuration.
- **AuditLog**: Security tracking. Records user actions.
- **VideoMetadata**: Statistics for a processed video (fps, frameCount).

## Relationships
- One-to-Many: `Upload` → `Detection`
- One-to-Many: `Detection` → `DetectionObject`
- One-to-Many: `User` → `AuditLog`
Cascade deletes are strictly enforced to prevent orphaned records.

---

# 8 API Documentation

### `POST /api/auth/login`
- **Purpose**: Authenticates a user.
- **Input**: `{ "email": "admin@enterprise.com", "password": "password123" }`
- **Output**: `{ "token": "jwt_string", "user": { "id": "...", "role": "admin" } }`
- **Auth Required**: No

### `GET /api/detections`
- **Purpose**: Retrieves a paginated list of detections for the history table.
- **Input**: Query params `?page=1&limit=50&type=Truck`
- **Output**: `{ "data": [ { "id": "...", "className": "Truck", "confidence": 0.95 } ], "total": 1432 }`
- **Auth Required**: Yes

### `POST /api/detections/webhook`
- **Purpose**: Used by the AI Engine to report a successful detection.
- **Input**: `{ "uploadId": "...", "objects": [ { "className": "Wagon", "confidence": 0.9, "bbox": [...] } ] }`
- **Output**: `{ "status": "success", "detectionId": "..." }`
- **Auth Required**: API Key

### `GET /api/dashboard/stats`
- **Purpose**: Feeds the dashboard KPI cards.
- **Output**: `{ "totalDetected": 1432, "loadedCount": 845, "emptyCount": 587, "avgAccuracy": 96.4 }`
- **Auth Required**: Yes

---

# 9 Authentication Flow

1. The User submits email and password on the Next.js `/login` page.
2. An Axios POST request is sent to the Express `/api/auth/login` endpoint.
3. The controller fetches the user from PostgreSQL using Prisma.
4. `bcrypt` compares the provided password against the stored hash.
5. Upon success, `jsonwebtoken` signs a payload containing the User ID and Role with a secret key (`JWT_SECRET`).
6. The Express server responds with the JWT token.
7. The Frontend stores the token (in localStorage or a secure HTTP-only cookie).
8. Subsequent requests from the frontend include the header: `Authorization: Bearer <token>`.
9. Express middleware verifies the token before allowing access to protected routes.

---

# 10 Detection Flow

1. **RTSP Stream** → IP Camera feeds video to the local network.
2. **AI Engine** → Python `runner.py` captures frames using OpenCV.
3. **YOLO Prediction** → Frame is evaluated by YOLO11, outputting bounding boxes and confidence scores.
4. **ByteTrack** → The object is tracked until it leaves the camera's field of view.
5. **Backend Webhook** → AI Engine sends the aggregated data to the Express backend (`POST /api/detections/webhook`).
6. **Database Write** → Express validates the data and writes it to PostgreSQL via Prisma.
7. **Frontend Update** → Next.js fetches the new data (or receives it via websocket) and updates the Live Monitoring and Dashboard UI immediately.

---

# 11 Reports Module

The Reports module automates compliance and managerial oversight.
- **PDF Generation**: Powered by `pdfkit` in the backend. It compiles database statistics, detection logs, and charts for a given date range.
- **Storage**: Generated PDFs are saved to the `backend/uploads` directory.
- **Database Tracking**: A record is created in the `Report` Prisma model containing the `filePath`.
- **Download Flow**: The user clicks "Download" on the frontend `/reports` page, hitting an Express endpoint that serves the static file from the `uploads` directory.

---

# 12 Analytics Module

The Analytics Module aggregates vast amounts of row-level data into visual insights.
- **Graphs and Charts**: Built using `recharts` in React.
- **Data Aggregation**: Handled on the server side using Prisma's aggregation features (`groupBy`, `count`, `avg`) to ensure performance, rather than sending millions of rows to the browser.
- **Statistics**: Hourly distribution (Loaded vs Empty), overall system accuracy over time, and vehicle throughput velocity (fps).

---

# 13 Detection History

Provides a granular view of every event.
- **Storage**: Millions of rows in the `Detection` and `DetectionObject` tables.
- **Retrieval**: Uses cursor-based or offset-based pagination via Prisma to ensure query times remain low regardless of table size.
- **Filtering**: The frontend allows filtering by `className` (Truck/Wagon), `state` (Loaded/Empty), date ranges, and confidence thresholds. These map directly to SQL `WHERE` clauses in Prisma.

---

# 14 Complete Technology Stack

- **Next.js 15 (React 19)**: Framework for the frontend. Provides SSR and optimal performance.
- **Tailwind CSS**: For rapid, consistent, and responsive UI styling.
- **Zustand**: Lightweight global state management.
- **Framer Motion**: Adds premium, micro-animation UX to the UI.
- **Node.js & Express.js**: High concurrency backend API server.
- **Prisma ORM**: Type-safe database interactions and schema management.
- **PostgreSQL**: Robust, relational database capable of handling complex joins and high write volumes.
- **Python 3.11**: Ecosystem for AI processing.
- **PyTorch**: Deep learning framework executing the YOLO models.
- **Ultralytics**: Simplifies YOLO11 implementation and tracking.
- **OpenCV**: Industry standard for video stream capture and image manipulation.
- **Docker & Docker Compose**: Containerization for reliable, cross-platform deployment.

---

# 15 Dependencies

**Frontend (`package.json`)**:
- `next`, `react`, `react-dom`: Core frameworks.
- `tailwindcss`, `clsx`, `tailwind-merge`: Styling engines.
- `lucide-react`: SVG icon library.
- `framer-motion`: Animation engine.
- `recharts`: Data visualization.
- `zustand`: State manager.
- `react-hook-form`, `zod`: Form management and validation.
- `@tanstack/react-query`: Asynchronous data fetching and caching.

**Backend (`package.json`)**:
- `express`: API framework.
- `@prisma/client`: Database connector.
- `jsonwebtoken`, `bcryptjs`: Security and auth.
- `multer`: File upload parsing.
- `pdfkit`: PDF generation.

**AI Engine (`requirements.txt`)**:
- `ultralytics`: YOLOv11 framework.
- `opencv-python`: Image processing.
- `numpy`: Matrix math.
- `torch`, `torchvision`: Deep learning backend.
- `pydantic`: Data validation.

---

# 16 UI Analysis

- **Design System**: A dark-mode optimized, high-contrast corporate aesthetic using `slate`, `emerald`, `blue`, and `amber` color tokens. It utilizes `shadcn/ui`-inspired atomic components.
- **Responsiveness**: Fully responsive via Tailwind breakpoints. The sidebar collapses to icons on smaller screens, and grid layouts stack vertically on mobile.
- **UX**: Emphasizes immediate access to data. Dashboard layouts prevent excessive clicking. Live feeds simulate real-time urgency.

---

# 17 Features

1. Real-time Object Detection (YOLO11)
2. Truck vs. Wagon Classification
3. Loaded vs. Empty State Determination
4. Continuous RTSP Stream Ingestion
5. ByteTrack Multi-Object Tracking
6. JWT Role-Based Authentication
7. High-Level KPI Dashboard
8. Live Event Stream Visualization
9. Historical Data Pagination & Filtering
10. System Health Monitoring
11. Automated PDF Report Generation
12. Audit Logging for Security
13. Dynamic System Configuration
14. Dark Mode / Light Mode UI
15. Animated UI Transitions
16. Chart-based Analytics (Throughput, Distribution)

---

# 18 Functional Requirements

- The system MUST authenticate users before granting access.
- The AI MUST process video streams at a minimum of 15 FPS.
- The system MUST classify vehicles as either Truck or Wagon.
- The system MUST classify vehicles as either Loaded or Empty.
- The backend MUST store every successfully tracked object in PostgreSQL.
- The frontend MUST display a live feed of incoming detections.
- The system MUST generate PDF reports of historical data.

---

# 19 Non Functional Requirements

- **Performance**: API responses should take < 200ms. AI inference must utilize GPU acceleration to prevent stream bottlenecking.
- **Scalability**: The architecture must allow horizontal scaling of the AI container across multiple GPUs.
- **Reliability**: The database must use foreign key constraints and cascade deletes to maintain data integrity.
- **Usability**: The UI must be intuitive for operators with minimal training.

---

# 20 Modules

1. **Authentication Module**: Manages logins, JWT generation, and RBAC.
2. **AI Inference Module**: The Python core executing YOLO and OpenCV.
3. **API Gateway Module**: The Express server routing data between frontend, AI, and DB.
4. **Data Persistence Module**: Prisma schemas and Postgres tables.
5. **Dashboard Module**: React components visualizing KPIs.
6. **Reporting Module**: Server-side PDF generation logic.

---

# 21 Project Workflow

```mermaid
graph TD
    A[Camera RTSP] -->|Video Stream| B(AI Engine - Python)
    B -->|Frames| C{YOLO11 Model}
    C -->|BBoxes| D[ByteTrack]
    D -->|Tracked Object| E[Express API Webhook]
    E -->|Validation| F[Prisma ORM]
    F -->|Insert| G[(PostgreSQL)]
    H[Frontend User] -->|HTTP GET| I[Express API]
    I -->|Query| G
    G -->|Data| I
    I -->|JSON| H
```

---

# 22 Architecture Diagram

```mermaid
graph LR
    subgraph Client Layer
    UI[Next.js React Frontend]
    end

    subgraph Application Layer
    API[Express.js Node Backend]
    Auth[JWT Service]
    PDF[Report Generator]
    end

    subgraph Machine Learning Layer
    CV[OpenCV Stream Capture]
    YOLO[PyTorch YOLO11]
    Track[ByteTrack]
    end

    subgraph Data Layer
    DB[(PostgreSQL Database)]
    Files[Local Storage /uploads]
    end

    UI <-->|REST API| API
    API --> Auth
    API --> PDF
    API <-->|Prisma Client| DB
    API --> Files
    
    CV --> YOLO --> Track -->|HTTP POST| API
```

---

# 23 AI Pipeline

```mermaid
sequenceDiagram
    participant Cam as IP Camera
    participant CV as OpenCV
    participant Torch as PyTorch / YOLO
    participant Post as NMS / ByteTrack
    participant API as Backend API

    Cam->>CV: Stream Frames (30fps)
    CV->>Torch: Preprocessed Tensor
    Torch->>Post: Raw Predictions
    Post->>Post: Non-Max Suppression
    Post->>Post: Assign Tracking IDs
    opt Object Exits Frame
        Post->>API: POST /api/detections/webhook
    end
```

---

# 24 Database Diagram

```mermaid
erDiagram
    User {
        String id PK
        String username
        String password
        String role
    }
    Upload {
        String id PK
        String filePath
        String status
    }
    Detection {
        String id PK
        String uploadId FK
        Boolean success
    }
    DetectionObject {
        String id PK
        String detectionId FK
        String className
        Float confidence
    }
    Report {
        String id PK
        String reportId
        String filePath
    }

    User ||--o{ AuditLog : generates
    Upload ||--o{ Detection : contains
    Detection ||--o{ DetectionObject : has
```

---

# 25 Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant API
    participant Database

    User->>Browser: Enters credentials
    Browser->>API: POST /api/auth/login
    API->>Database: Query User
    Database-->>API: Return hash
    API->>API: Compare password
    API-->>Browser: Return JWT
    Browser->>User: Redirect to Dashboard
    Browser->>API: GET /api/dashboard/stats (with JWT)
    API->>Database: Aggregate data
    Database-->>API: KPI Results
    API-->>Browser: JSON KPIs
    Browser->>User: Render Dashboard
```

---

# 26 Advantages

- **Cost Reduction**: Replaces manual security/counting personnel with an automated system.
- **Accuracy**: AI models provide high-precision counts, eliminating human error.
- **Real-time Insights**: Operations managers can view throughput bottlenecks instantly rather than waiting for end-of-shift reports.
- **Modular Scalability**: Due to Dockerization, the computationally heavy AI engine can be scaled independently of the web server.

---

# 27 Limitations

- **Hardware Dependency**: The AI engine requires dedicated NVIDIA GPUs (CUDA) to process video streams in real-time. Running on CPU will severely bottleneck FPS.
- **Environmental Factors**: Extreme weather (heavy fog, blizzards) or occluded camera lenses can degrade YOLO11 confidence scores.
- **Network Bandwidth**: Processing multiple high-definition RTSP streams over a local network requires substantial bandwidth.

---

# 28 Future Scope

- **License Plate Recognition (ANPR)**: Integrating an OCR model to identify specific truck registration numbers alongside type classification.
- **Volumetric Analysis**: Using stereo cameras or LiDAR to calculate the exact volume of load (e.g., tonnage of coal) rather than just a binary "Loaded/Empty".
- **Edge Deployment**: Compiling the YOLO model to TensorRT or ONNX to run directly on edge devices (like NVIDIA Jetson) attached to the cameras, reducing network bandwidth.

---

# 29 Real World Applications

- **Mining Operations**: Counting coal wagons leaving the facility and verifying if they are loaded.
- **Port Terminals**: Tracking shipping containers on trucks entering and exiting the port gates.
- **Logistics Hubs (Amazon, FedEx)**: Auditing the flow of delivery vehicles entering sorting facilities.
- **Smart Cities**: General traffic monitoring and heavy-vehicle toll enforcement.

---

# 30 References

- Next.js Documentation: https://nextjs.org/docs
- Prisma ORM: https://www.prisma.io/
- Ultralytics YOLO11: https://docs.ultralytics.com/
- Express.js: https://expressjs.com/
- Tailwind CSS: https://tailwindcss.com/
- Recharts: https://recharts.org/

---

# 31 Commands

### Development
**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

**Backend**:
```bash
cd backend
npm install
npm run dev
```

**AI Engine**:
```bash
cd ai-engine
pip install -r requirements.txt
python inference/runner.py
```

**Prisma Database**:
```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Production
**Docker**:
```bash
docker-compose up -d --build
```

---

# 32 Environment Variables

**Frontend (`.env.local`)**:
- `NEXT_PUBLIC_API_URL`: The URL of the backend Express server (e.g., `http://localhost:5000/api`).

**Backend (`.env`)**:
- `DATABASE_URL`: Connection string for PostgreSQL (e.g., `postgresql://admin:secret@localhost:5432/truck_wagon_ai`).
- `JWT_SECRET`: Cryptographic key used to sign authentication tokens.
- `PORT`: Port on which the Express server listens (default: 5000).
- `NODE_ENV`: Set to `development` or `production`.

---

# 33 Project Statistics

- **Folders**: ~30+ logical directories
- **Files**: ~100+ tracked configuration and source files
- **Lines of Code**: Estimated ~5,000+ custom lines (excluding generated node_modules/venv)
- **Technologies**: Next.js, React, Tailwind, Express, Prisma, Postgres, Python, PyTorch, YOLO.
- **Pages**: 9 distinct frontend routes.
- **API Routes**: 5 distinct REST domains.
- **Database Tables**: 9 distinct Prisma models.

---

# 34 Important Code Files

- **`backend/prisma/schema.prisma`**: The source of truth for the entire database architecture. Defines all relationships and constraints.
- **`backend/src/server.js`**: The entry point for the backend logic. Routes traffic and applies security middlewares.
- **`frontend/src/app/dashboard/page.tsx`**: The core operational UI. Integrates KPI mock data with Recharts visualizations.
- **`ai-engine/inference/runner.py`**: The computational heart of the system. Bridges the gap between the raw video stream and actionable AI metadata.
- **`docker-compose.yml`**: Essential for DevOps. Ties the disparate technology stacks together into a unified, deployable platform.

---

# 35 Conclusion

The Truck & Wagon AI Platform represents a cutting-edge fusion of full-stack web development and applied Artificial Intelligence. By successfully decoupling the highly intensive computer vision workloads (Python/PyTorch) from the business logic and user interface (Node.js/Next.js), the repository establishes an enterprise-ready architecture. This meticulous organization ensures that the platform is not only highly performant in real-time operational environments but also highly maintainable for future development teams.
