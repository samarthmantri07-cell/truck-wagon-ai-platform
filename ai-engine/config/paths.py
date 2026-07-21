import os
from pathlib import Path

# Root directory of the AI Engine
AI_ENGINE_ROOT = Path(__file__).parent.parent.absolute()

# Core Directories
DATASETS_DIR = AI_ENGINE_ROOT / "datasets"
MODELS_DIR = AI_ENGINE_ROOT / "models"
WEIGHTS_DIR = AI_ENGINE_ROOT / "weights"
LOGS_DIR = AI_ENGINE_ROOT / "logs"
TRAINING_DIR = AI_ENGINE_ROOT / "training"
INFERENCE_DIR = AI_ENGINE_ROOT / "inference"

# Ensure core directories exist
for directory in [DATASETS_DIR, MODELS_DIR, WEIGHTS_DIR, LOGS_DIR, TRAINING_DIR, INFERENCE_DIR]:
    directory.mkdir(parents=True, exist_ok=True)
