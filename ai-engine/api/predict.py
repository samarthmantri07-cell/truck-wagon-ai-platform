import time
import os
import cv2
import numpy as np
from ultralytics import YOLO
import torch
from .config import settings, logger

model = None

def load_model():
    global model
    if model is None:
        logger.info(f"Loading model from {settings.MODEL_PATH}...")
        try:
            model = YOLO(settings.MODEL_PATH)
            device = 0 if torch.cuda.is_available() else "cpu"
            if torch.cuda.is_available():
                model.to('cuda')
                logger.info(f"Model loaded on GPU: {torch.cuda.get_device_name(0)}")
            else:
                logger.info("Model loaded on CPU.")
            # Warm up model and CUDA kernels
            dummy = np.zeros((640, 640, 3), dtype=np.uint8)
            model.predict(dummy, device=device, verbose=False)
            logger.info("Model warmup complete.")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise e

def is_model_loaded():
    return model is not None


def is_cuda_available():
    return torch.cuda.is_available()

def get_gpu_name():
    if is_cuda_available():
        return torch.cuda.get_device_name(0)
    return "None"

def run_inference(image: np.ndarray):
    """
    Run YOLO inference on a single image.
    """
    if model is None:
        raise RuntimeError("Model is not loaded.")
    
    device = 0 if torch.cuda.is_available() else "cpu"
    start_time = time.time()
    results = model.predict(image, device=device, verbose=False)
    end_time = time.time()
    
    processing_time_ms = int((end_time - start_time) * 1000)
    
    detections = []
    
    result = results[0]
    boxes = result.boxes
    names = model.names
    
    for box in boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
        conf = float(box.conf[0])
        cls_id = int(box.cls[0])
        cls_name = names[cls_id]
        
        detections.append({
            "class_name": cls_name,
            "confidence": round(conf, 2),
            "bbox": {
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2
            }
        })
        
        # Draw bounding box for saving
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        label = f"{cls_name} {conf:.2f}"
        cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
    # Save image
    timestamp = int(time.time() * 1000)
    save_path = os.path.join(settings.PREDICTIONS_DIR, f"prediction_{timestamp}.jpg")
    cv2.imwrite(save_path, image)
    logger.info(f"Saved prediction image to {save_path}")
    
    return detections, processing_time_ms
