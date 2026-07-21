import json
from pathlib import Path
from config.paths import MODELS_DIR, WEIGHTS_DIR
from utils.logger import logger

class ModelManager:
    def __init__(self):
        self.version_file = MODELS_DIR / "version.json"
        self._ensure_version_file()

    def _ensure_version_file(self):
        if not self.version_file.exists():
            default_data = {
                "active_model": "yolo11n.pt",
                "history": []
            }
            with open(self.version_file, "w") as f:
                json.dump(default_data, f, indent=4)

    def get_active_model_path(self) -> Path:
        """
        Returns the absolute path to the currently active model (e.g., best.pt).
        """
        with open(self.version_file, "r") as f:
            data = json.load(f)
        
        active = data.get("active_model", "yolo11n.pt")
        path = WEIGHTS_DIR / active
        
        if not path.exists():
            logger.warning(f"Active model '{active}' not found in weights/. Defaulting to base model.")
            # For testing, we can return the string which ultralytics will auto-download
            return Path(active) 

        return path

    def set_active_model(self, model_filename: str):
        """
        Updates the active model.
        """
        with open(self.version_file, "r") as f:
            data = json.load(f)
            
        data["active_model"] = model_filename
        if model_filename not in data.get("history", []):
            data["history"].append(model_filename)
            
        with open(self.version_file, "w") as f:
            json.dump(data, f, indent=4)
            
        logger.info(f"Active model set to: {model_filename}")
