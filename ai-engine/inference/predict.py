import cv2
import numpy as np
from typing import Union
from ultralytics import YOLO
from config.settings import SETTINGS
from models.manager import ModelManager
from utils.yolo_helper import parse_yolo_results
from utils.logger import logger
import traceback

class YOLOEngine:
    def __init__(self):
        self.model_manager = ModelManager()
        self.model_path = self.model_manager.get_active_model_path()
        self.conf = SETTINGS.inference.conf_threshold
        self.iou = SETTINGS.inference.iou_threshold
        self.imgsz = SETTINGS.inference.imgsz
        
        logger.info(f"Loading YOLO model from: {self.model_path}")
        try:
            self.model = YOLO(str(self.model_path))
            # Pre-warm the model
            self.model(np.zeros((self.imgsz, self.imgsz, 3), dtype=np.uint8), verbose=False)
            logger.info("YOLO model loaded and warmed up successfully.")
        except Exception as e:
            logger.error(f"Failed to load YOLO model: {e}")
            logger.error(traceback.format_exc())
            self.model = None

    def predict_image(self, image: Union[str, np.ndarray]) -> dict:
        """
        Runs inference on a single image.
        """
        if self.model is None:
            return {"error": "Model not loaded"}

        try:
            results = self.model.predict(
                source=image,
                conf=self.conf,
                iou=self.iou,
                imgsz=self.imgsz,
                verbose=False
            )
            parsed = parse_yolo_results(results)
            return {"status": "success", "detections": parsed}
        except Exception as e:
            logger.error(f"Inference error: {e}")
            return {"status": "error", "message": str(e)}

    def predict_video_stream(self, source: Union[str, int]):
        """
        Generator that yields parsed detections for each frame of a video or webcam stream.
        """
        if self.model is None:
            logger.error("Model not loaded. Cannot process stream.")
            return

        try:
            results = self.model.predict(
                source=source,
                stream=True,
                conf=self.conf,
                iou=self.iou,
                imgsz=self.imgsz,
                verbose=False
            )
            for r in results:
                yield parse_yolo_results(r)
        except Exception as e:
            logger.error(f"Stream error: {e}")
            yield []
