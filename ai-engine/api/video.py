import time
import os
import cv2
import numpy as np
from ultralytics import YOLO
import torch
from .config import settings, logger
from .predict import model, is_model_loaded

def process_video(file_path: str):
    """
    Process a video file frame by frame using YOLO.
    """
    if not is_model_loaded():
        raise RuntimeError("Model is not loaded.")
        
    logger.info(f"Processing video: {file_path}")
    
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        raise ValueError("Could not open video file.")
        
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if fps == 0 or fps != fps:
        fps = 30.0
        
    timestamp = int(time.time() * 1000)
    output_filename = f"video_prediction_{timestamp}.mp4"
    output_path = os.path.join(settings.PREDICTIONS_DIR, output_filename)
    
    # Use mp4v codec for widely supported MP4 output
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    total_processing_time = 0
    all_confidences = []
    class_counts = {}
    
    frame_count = 0
    
    start_total = time.time()
    device = 0 if torch.cuda.is_available() else "cpu"
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        frame_start = time.time()
        results = model.predict(frame, device=device, verbose=False)
        frame_end = time.time()
        
        total_processing_time += (frame_end - frame_start)
        
        result = results[0]
        boxes = result.boxes
        names = model.names
        
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            cls_name = names[cls_id]
            
            all_confidences.append(conf)
            class_counts[cls_name] = class_counts.get(cls_name, 0) + 1
            
            # Annotate frame
            color = (0, 255, 0) if 'loaded' in cls_name else (0, 165, 255)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            label = f"{cls_name} {conf:.2f}"
            cv2.putText(frame, label, (x1, max(y1 - 10, 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            
        out.write(frame)
        frame_count += 1
        
        if frame_count % 30 == 0:
            logger.info(f"Processed {frame_count}/{total_frames} frames...")
            
    cap.release()
    out.release()
    
    end_total = time.time()
    logger.info(f"Finished processing video in {end_total - start_total:.2f}s")
    
    avg_conf = sum(all_confidences) / len(all_confidences) if all_confidences else 0.0
    total_ms = int(total_processing_time * 1000)
    
    # Normalize class counts (divide by frames to get an estimated unique object count)
    # This is a naive heuristic since we don't do tracking, we just estimate the average objects per frame
    estimated_objects = {}
    if frame_count > 0:
        for cls, count in class_counts.items():
            estimated_objects[cls] = round(count / frame_count)
            
    return {
        "output_path": f"/predictions/{output_filename}",
        "processing_time_ms": total_ms,
        "frame_count": frame_count,
        "fps": round(fps, 2),
        "average_confidence": round(avg_conf, 3),
        "detection_summary": estimated_objects
    }
