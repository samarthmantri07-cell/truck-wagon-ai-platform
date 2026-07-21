import cv2
import numpy as np
from typing import List, Tuple, Dict

def draw_boxes(image: np.ndarray, detections: List[Dict]) -> np.ndarray:
    """
    Draws bounding boxes and labels on an image.
    detections format: [{"class": "Truck", "confidence": 0.95, "bbox": [x1, y1, x2, y2]}]
    """
    img_copy = image.copy()
    for det in detections:
        cls_name = det.get("class", "Unknown")
        conf = det.get("confidence", 0.0)
        bbox = det.get("bbox", [0, 0, 0, 0])
        
        x1, y1, x2, y2 = map(int, bbox)
        
        # Color based on class (simple hash)
        color = (0, 255, 0) if cls_name == "Truck" else (255, 0, 0)
        
        cv2.rectangle(img_copy, (x1, y1), (x2, y2), color, 2)
        
        label = f"{cls_name} {conf:.2f}"
        (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
        cv2.rectangle(img_copy, (x1, y1 - 20), (x1 + w, y1), color, -1)
        cv2.putText(img_copy, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
    return img_copy
