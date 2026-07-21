from ultralytics.engine.results import Results
from typing import List, Dict

def parse_yolo_results(results: Results) -> List[Dict]:
    """
    Parses Ultralytics YOLO Results object into a standard dictionary format.
    """
    parsed = []
    
    # Usually results is a list of Result objects (one per image/frame)
    # If a single Result is passed, wrap it in a list for iteration
    if not isinstance(results, list):
        results = [results]
        
    for r in results:
        boxes = r.boxes
        if boxes:
            for box in boxes:
                cls_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                bbox = box.xyxy[0].tolist() # [x1, y1, x2, y2]
                
                cls_name = r.names[cls_id] if r.names else str(cls_id)
                
                parsed.append({
                    "class": cls_name,
                    "class_id": cls_id,
                    "confidence": conf,
                    "bbox": bbox
                })
                
    return parsed
