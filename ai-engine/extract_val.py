import torch
from ultralytics import YOLO

model_path = r"c:\Users\samar\OneDrive\Desktop\Final_Project\truck-wagon-ai-platform\ai-engine\training\runs\truck_wagon_train\weights\best.pt"
data_path = r"c:\Users\samar\OneDrive\Desktop\Final_Project\truck-wagon-ai-platform\ai-engine\datasets\truck-wagon-v1\data.yaml"

model = YOLO(model_path)
print("\n--- VALIDATION SET METRICS ---")
try:
    metrics = model.val(data=data_path, split='val', workers=0)
    print("Per-class Metrics:")
    print(f"{'Class':<15} | {'Precision':<10} | {'Recall':<10} | {'mAP@0.5':<10} | {'mAP@0.5:0.95':<10}")
    for i, class_index in enumerate(metrics.box.ap_class_index):
        class_name = model.names[class_index]
        p = metrics.box.p[i]
        r = metrics.box.r[i]
        map50 = metrics.box.map50[i]
        map95 = metrics.box.map[i]
        print(f"{class_name:<15} | {p:<10.4f} | {r:<10.4f} | {map50:<10.4f} | {map95:<10.4f}")
except Exception as e:
    print(f"Validation failed: {e}")
