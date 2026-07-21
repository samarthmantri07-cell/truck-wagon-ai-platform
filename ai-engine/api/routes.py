from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from .schemas import PredictResponse, HealthResponse, Detection, BBox
from .predict import run_inference, is_cuda_available, get_gpu_name, is_model_loaded
from .utils import process_upload_file
from .config import logger
from .video import process_video
import os
import shutil
import base64
import cv2
import numpy as np

router = APIRouter()

@router.post("/predict", response_model=PredictResponse)
async def predict_endpoint(file: UploadFile = File(...)):
    logger.info(f"Received prediction request for file: {file.filename}")
    try:
        image = await process_upload_file(file)
        
        detections, processing_time_ms = run_inference(image)
        logger.info(f"Prediction successful in {processing_time_ms}ms with {len(detections)} detections")
        
        formatted_detections = []
        for d in detections:
            formatted_detections.append(Detection(
                class_name=d["class_name"],
                confidence=d["confidence"],
                bbox=BBox(**d["bbox"])
            ))
            
        return PredictResponse(
            success=True,
            processing_time_ms=processing_time_ms,
            detections=formatted_detections
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Inference failure: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during inference")

@router.post("/video/predict")
async def video_predict_endpoint(file: UploadFile = File(...)):
    logger.info(f"Received video prediction request for file: {file.filename}")
    try:
        # Save temp file
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        result = process_video(temp_path)
        
        # Remove temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        logger.error(f"Video processing failure: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during video inference")

@router.post("/stream/predict")
async def stream_predict_endpoint(image_b64: str = Body(..., embed=True)):
    try:
        # Decode base64 to image
        if ',' in image_b64:
            image_b64 = image_b64.split(',')[1]
        img_data = base64.b64decode(image_b64)
        nparr = np.frombuffer(img_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise ValueError("Could not decode image")

        detections, processing_time_ms = run_inference(image)
        
        formatted_detections = []
        for d in detections:
            formatted_detections.append(Detection(
                class_name=d["class_name"],
                confidence=d["confidence"],
                bbox=BBox(**d["bbox"])
            ))
            
        return PredictResponse(
            success=True,
            processing_time_ms=processing_time_ms,
            detections=formatted_detections
        )
    except Exception as e:
        logger.error(f"Stream inference failure: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during stream inference")

@router.get("/health", response_model=HealthResponse)
async def health_endpoint():
    logger.info("Health check endpoint called")
    return HealthResponse(
        status="healthy",
        model_loaded=is_model_loaded(),
        gpu=get_gpu_name(),
        cuda=is_cuda_available()
    )
