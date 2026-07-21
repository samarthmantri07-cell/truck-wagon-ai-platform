import os
import glob
from ultralytics import YOLO

# Load a pretrained YOLO11 model (e.g., YOLO11x for best accuracy or YOLO11n for speed)
model = YOLO('yolo11n.pt') 

def annotate_images(image_dir, output_dir, target_class_id=1, conf_threshold=0.3):
    """
    Auto-annotates images using a pretrained YOLO model.
    COCO dataset class for 'truck' is 7.
    We map it to the user's target class ID (default: 1 for loaded_truck).
    """
    os.makedirs(output_dir, exist_ok=True)
    
    image_paths = glob.glob(os.path.join(image_dir, "*.jpg")) + glob.glob(os.path.join(image_dir, "*.jpeg")) + glob.glob(os.path.join(image_dir, "*.png"))
    
    for img_path in image_paths:
        print(f"Processing {img_path}...")
        results = model.predict(img_path, conf=conf_threshold, verbose=False)
        
        filename = os.path.basename(img_path)
        name, _ = os.path.splitext(filename)
        label_file = os.path.join(output_dir, f"{name}.txt")
        
        with open(label_file, "w") as f:
            for result in results:
                # Iterate through detected boxes
                for box in result.boxes:
                    # COCO class 7 is truck
                    if int(box.cls[0]) == 7:
                        # Get normalized xywh coordinates
                        x_center, y_center, width, height = box.xywhn[0].tolist()
                        
                        # Write to YOLO format file using target_class_id
                        f.write(f"{target_class_id} {x_center:.6f} {y_center:.6f} {width:.6f} {height:.6f}\n")

if __name__ == "__main__":
    IMAGE_DIR = "collected_loaded_trucks/images"
    LABEL_DIR = "collected_loaded_trucks/labels"
    print("Starting auto-annotation...")
    annotate_images(IMAGE_DIR, LABEL_DIR, target_class_id=1)
    print(f"Auto-annotation complete. Labels saved to {LABEL_DIR}")
