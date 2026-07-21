# Default class mapping for Truck & Wagon detection
DEFAULT_CLASSES = {
    0: "Truck",
    1: "Wagon",
    2: "Locomotive"
}

# Training modes
class TrainingModes:
    TRAIN = "train"
    VALIDATE = "validate"
    TEST = "test"

# File extensions
IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".bmp"]
VIDEO_EXTENSIONS = [".mp4", ".avi", ".mkv", ".mov"]
