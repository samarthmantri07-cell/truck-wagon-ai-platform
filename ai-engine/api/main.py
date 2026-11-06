from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .routes import router
from .predict import load_model
from .config import logger, settings
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up API server...")
    try:
        load_model()
    except Exception as e:
        logger.error(f"Startup failed due to model load error: {e}")
    yield
    logger.info("Shutting down API server...")

app = FastAPI(title="Truck & Wagon Detection API", lifespan=lifespan)

# CORS — allow backend and frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5000", "http://127.0.0.1:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the predictions directory to serve videos/images
os.makedirs(settings.PREDICTIONS_DIR, exist_ok=True)
app.mount("/predictions", StaticFiles(directory=settings.PREDICTIONS_DIR), name="predictions")

app.include_router(router)
