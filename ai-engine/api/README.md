# Next Generation AI Truck & Wagon Detection Platform API

This is the production-ready AI inference service using FastAPI and YOLO11.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   uvicorn api.main:app --reload
   ```

## Endpoints

- `GET /health` : Returns system health and GPU status.
- `POST /predict` : Accepts `multipart/form-data` with an image, returns JSON with detections and processing time.
