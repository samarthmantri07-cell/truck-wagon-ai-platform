from pathlib import Path
import traceback
import time
import yaml
import torch

from ultralytics import YOLO
from config.settings import SETTINGS
from config.paths import TRAINING_DIR, DATASETS_DIR
from utils.logger import logger

class YOLOTrainer:
    def __init__(self, data_yaml_path: str):
        self.data_yaml = Path(data_yaml_path)
        self.model_name = SETTINGS.training.model_name
        self.epochs = SETTINGS.training.epochs
        self.batch_size = SETTINGS.training.batch_size
        self.imgsz = SETTINGS.training.imgsz
        self.device = SETTINGS.training.device
        self.workers = SETTINGS.training.workers
        self.amp = getattr(SETTINGS.training, 'amp', True)
        self.project_dir = TRAINING_DIR / "runs"
        self.dataset_dir = self.data_yaml.parent

    def validate_dataset(self):
        """Validates that the dataset structure exists and updates data.yaml with absolute paths."""
        self.data_yaml = self.data_yaml.resolve()
        self.dataset_dir = self.data_yaml.parent.resolve()

        if not self.data_yaml.exists():
            raise FileNotFoundError(f"Missing data.yaml at {self.data_yaml}")
        
        # Rewrite data.yaml to use absolute path
        with open(self.data_yaml, 'r') as f:
            data = yaml.safe_load(f)
            
        data['path'] = str(self.dataset_dir)
        
        # Ensure correct relative paths
        if 'train' not in data or data['train'] == 'train/images':
            data['train'] = 'train/images'
        if 'val' not in data or data['val'] == 'valid/images':
            data['val'] = 'valid/images'
        if 'test' not in data or data['test'] == 'test/images':
            data['test'] = 'test/images'

        with open(self.data_yaml, 'w') as f:
            yaml.safe_dump(data, f, sort_keys=False)

        logger.info("="*50)
        logger.info("Resolved Dataset Paths:")
        logger.info(f"Dataset Root: {self.dataset_dir}")
        
        for folder_key, folder_name in [("train", "Train"), ("val", "Validation"), ("test", "Test")]:
            rel_path = data.get(folder_key)
            full_path = self.dataset_dir / rel_path
            
            logger.info(f"{folder_name} Images: {full_path}")
            
            if not full_path.exists():
                logger.error(f"Missing directory: {full_path}")
                raise FileNotFoundError(f"Missing directory: {full_path}")
                
        logger.info("="*50)

    def run(self):
        try:
            self.validate_dataset()
        except Exception as e:
            logger.error(f"Dataset Validation Failed: {e}")
            return None

        if torch.cuda.is_available():
            gpu_name = torch.cuda.get_device_name(0)
            gpu_mem = torch.cuda.get_device_properties(0).total_memory / (1024**3)
            cuda_ver = torch.version.cuda
        else:
            gpu_name = "CPU"
            gpu_mem = "N/A"
            cuda_ver = "N/A"

        logger.info("="*50)
        logger.info("Starting YOLOv11 Production Training")
        logger.info("="*50)
        logger.info(f"GPU Name                 : {gpu_name}")
        logger.info(f"GPU Memory               : {gpu_mem:.2f} GB" if isinstance(gpu_mem, float) else f"GPU Memory               : {gpu_mem}")
        logger.info(f"CUDA Version             : {cuda_ver}")
        logger.info(f"Dataset path             : {self.data_yaml}")
        logger.info(f"Model                    : {self.model_name}")
        logger.info(f"Epochs                   : {self.epochs}")
        logger.info(f"Batch size               : {self.batch_size}")
        logger.info(f"Workers                  : {self.workers}")
        logger.info(f"Image size               : {self.imgsz}")
        logger.info(f"Device                   : {self.device}")
        logger.info(f"AMP Enabled              : {self.amp}")
        logger.info(f"Optimizer                : {getattr(SETTINGS.training, 'optimizer', 'auto')}")
        logger.info(f"Learning Rate Scheduler  : Cosine (cos_lr={getattr(SETTINGS.training, 'cos_lr', False)})")
        logger.info(f"Output dir               : {self.project_dir / 'truck_wagon_train'}")
        logger.info("="*50)
        
        start_time = time.time()
        
        try:
            model = YOLO(self.model_name)
            
            results = model.train(
                data=str(self.data_yaml),
                epochs=self.epochs,
                batch=self.batch_size,
                imgsz=self.imgsz,
                device=self.device,
                patience=SETTINGS.training.patience,
                workers=self.workers,
                amp=self.amp,
                optimizer=getattr(SETTINGS.training, 'optimizer', 'auto'),
                cos_lr=getattr(SETTINGS.training, 'cos_lr', False),
                pretrained=getattr(SETTINGS.training, 'pretrained', True),
                cache=getattr(SETTINGS.training, 'cache', False),
                close_mosaic=getattr(SETTINGS.training, 'close_mosaic', 10),
                deterministic=getattr(SETTINGS.training, 'deterministic', True),
                project=str(self.project_dir),
                name="truck_wagon_train",
                exist_ok=True,
                plots=True,
                verbose=True,
                save=True,
                save_period=10
            )
            
            duration = time.time() - start_time
            hours, rem = divmod(duration, 3600)
            minutes, seconds = divmod(rem, 60)
            
            # Use results.save_dir if available, else default
            save_dir = getattr(results, 'save_dir', self.project_dir / 'truck_wagon_train')
            
            logger.info("="*50)
            logger.info("Training Completed Successfully")
            logger.info("="*50)
            logger.info(f"Duration        : {int(hours)}h {int(minutes)}m {int(seconds)}s")
            logger.info(f"Results Dir     : {save_dir}")
            logger.info(f"Best Model Path : {Path(save_dir) / 'weights' / 'best.pt'}")
            logger.info("="*50)
            
            return results
            
        except Exception as e:
            logger.error(f"Training failed: {e}")
            logger.error(traceback.format_exc())
            return None

if __name__ == "__main__":
    dataset_yaml = DATASETS_DIR / "truck-wagon-v1" / "data.yaml"
    trainer = YOLOTrainer(data_yaml_path=str(dataset_yaml))
    trainer.run()
