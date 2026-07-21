import sys
import os
from pathlib import Path

# Add the root of the ai-engine to the sys path so imports work correctly
AI_ENGINE_ROOT = Path(__file__).parent.parent.absolute()
sys.path.append(str(AI_ENGINE_ROOT))

from config.settings import SETTINGS
from config.paths import WEIGHTS_DIR
from utils.logger import logger
from models.manager import ModelManager
from inference.predict import YOLOEngine

def main():
    logger.info("Testing AI Engine Environment...")
    
    # Check Settings
    logger.info(f"Loaded Config: {SETTINGS.training.model_name}, img size {SETTINGS.training.imgsz}")
    
    # Check Model Manager
    manager = ModelManager()
    active_model = manager.get_active_model_path()
    logger.info(f"Active Model Path: {active_model}")
    
    # Init Engine
    logger.info("Initializing YOLO Engine...")
    engine = YOLOEngine()
    
    if engine.model is not None:
        logger.info("AI Engine initialized successfully! Everything works.")
    else:
        logger.error("AI Engine failed to load the model.")

if __name__ == "__main__":
    main()
