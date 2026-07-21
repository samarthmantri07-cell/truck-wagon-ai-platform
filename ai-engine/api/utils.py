import numpy as np
import cv2
from fastapi import UploadFile, HTTPException
from typing import Tuple
from .config import logger

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "bmp", "webp", "mp4", "avi", "mov", "mkv"}

def validate_file_extension(filename: str) -> bool:
    if not filename or "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS

async def process_upload_file(file: UploadFile) -> np.ndarray:
    if not file.filename:
        logger.error("No file name provided.")
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not validate_file_extension(file.filename):
        logger.error(f"Unsupported file extension: {file.filename}")
        raise HTTPException(status_code=400, detail="Unsupported file extension")
    
    contents = await file.read()
    if not contents:
        logger.error("Empty file provided.")
        raise HTTPException(status_code=400, detail="Empty file")
    
    # Convert to numpy array
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        logger.error("Failed to decode image.")
        raise HTTPException(status_code=400, detail="Invalid image file")
    
    return image
