import os
import logging
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MODEL_PATH: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../training/runs/truck_wagon_train/weights/best.pt"))
    PREDICTIONS_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "predictions"))
    LOG_LEVEL: str = "INFO"

settings = Settings()

os.makedirs(settings.PREDICTIONS_DIR, exist_ok=True)

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("ai_engine")
