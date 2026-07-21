from pydantic import BaseModel, Field
import torch

class TrainingSettings(BaseModel):
    model_name: str = "yolo11s.pt"  
    epochs: int = Field(default=300, ge=1)
    batch_size: int = Field(default=8, ge=1)
    imgsz: int = 960
    device: str = "0" if torch.cuda.is_available() else "cpu"
    patience: int = 80
    workers: int = 8
    amp: bool = True
    optimizer: str = "AdamW"
    cos_lr: bool = True
    pretrained: bool = True
    cache: bool = False
    close_mosaic: int = 20
    deterministic: bool = True

class InferenceSettings(BaseModel):
    conf_threshold: float = Field(default=0.25, ge=0.0, le=1.0)
    iou_threshold: float = Field(default=0.45, ge=0.0, le=1.0)
    device: str = "0" if torch.cuda.is_available() else "cpu"
    half_precision: bool = True if torch.cuda.is_available() else False
    imgsz: int = 640

class GlobalSettings(BaseModel):
    training: TrainingSettings = TrainingSettings()
    inference: InferenceSettings = InferenceSettings()

# Global instance
SETTINGS = GlobalSettings()
