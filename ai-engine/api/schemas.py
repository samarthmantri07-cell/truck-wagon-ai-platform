from pydantic import BaseModel, Field
from typing import List

class BBox(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int

class Detection(BaseModel):
    class_name: str = Field(alias="class")
    confidence: float
    bbox: BBox

    model_config = {
        "populate_by_name": True
    }

class PredictResponse(BaseModel):
    success: bool
    processing_time_ms: int
    detections: List[Detection]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    gpu: str
    cuda: bool
