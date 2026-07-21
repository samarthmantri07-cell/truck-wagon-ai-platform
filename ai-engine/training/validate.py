from ultralytics import YOLO
from config.settings import SETTINGS
from config.paths import TRAINING_DIR
from models.manager import ModelManager
from utils.logger import logger
import traceback

class YOLOValidator:
    def __init__(self, data_yaml_path: str):
        self.data_yaml = data_yaml_path
        self.model_manager = ModelManager()
        self.model_path = self.model_manager.get_active_model_path()
        self.imgsz = SETTINGS.training.imgsz
        self.device = SETTINGS.training.device
        self.project_dir = TRAINING_DIR / "runs_val"

    def run(self):
        logger.info(f"Starting YOLOv11 Validation using model: {self.model_path}")
        
        try:
            model = YOLO(str(self.model_path))
            
            metrics = model.val(
                data=self.data_yaml,
                imgsz=self.imgsz,
                device=self.device,
                project=str(self.project_dir),
                name="truck_wagon_val",
                exist_ok=True
            )
            
            logger.info("Validation completed.")
            logger.info(f"mAP50: {metrics.box.map50:.4f}")
            logger.info(f"mAP50-95: {metrics.box.map:.4f}")
            
            return metrics
            
        except Exception as e:
            logger.error(f"Validation failed: {e}")
            logger.error(traceback.format_exc())
            return None

if __name__ == "__main__":
    validator = YOLOValidator(data_yaml_path="datasets/sample/data.yaml")
    # validator.run()
