import sys
import torch
import ultralytics
import time
from ultralytics import YOLO

print(f"Python Version: {sys.version}")
print(f"PyTorch Version: {torch.__version__}")
print(f"Ultralytics Version: {ultralytics.__version__}")
print(f"CUDA Available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")

model_path = r"c:\Users\samar\OneDrive\Desktop\Final_Project\truck-wagon-ai-platform\ai-engine\training\runs\truck_wagon_train\weights\best.pt"
data_path = r"c:\Users\samar\OneDrive\Desktop\Final_Project\truck-wagon-ai-platform\ai-engine\datasets\truck-wagon-v1\data.yaml"

print("\n--- MODEL INFO ---")
model = YOLO(model_path)
model.info()

print("\n--- TEST SET VALIDATION ---")
try:
    metrics = model.val(data=data_path, split='test', workers=0)
    print("Test Set Metrics:")
    print(f"mAP50: {metrics.box.map50}")
    print(f"mAP50-95: {metrics.box.map}")
    print(f"Precision: {metrics.box.p}")
    print(f"Recall: {metrics.box.r}")
    print("Per class AP50:")
    for i, class_index in enumerate(metrics.box.ap_class_index):
        class_name = model.names[class_index]
        print(f"  {class_name}: P={metrics.box.p[i]:.4f}, R={metrics.box.r[i]:.4f}, AP50={metrics.box.map50[i]:.4f}, AP50-95={metrics.box.map[i]:.4f}")
except Exception as e:
    print(f"Validation failed: {e}")

print("\n--- INFERENCE BENCHMARK ---")
try:
    import glob
    test_images = glob.glob(r"c:\Users\samar\OneDrive\Desktop\Final_Project\truck-wagon-ai-platform\ai-engine\datasets\truck-wagon-v1\test\images\*.jpg")
    print(f"Found {len(test_images)} test images for benchmark.")
    if test_images:
        model.predict(test_images[0], verbose=False) # warmup
        
        t0 = time.time()
        results = model.predict(test_images, verbose=False)
        t1 = time.time()
        
        total_time = t1 - t0
        print(f"Total time for {len(test_images)} images: {total_time:.4f}s")
        print(f"FPS: {len(test_images)/total_time:.2f}")
        
        avg_preprocess = sum(r.speed['preprocess'] for r in results) / len(results)
        avg_inference = sum(r.speed['inference'] for r in results) / len(results)
        avg_postprocess = sum(r.speed['postprocess'] for r in results) / len(results)
        
        print(f"Avg Preprocess: {avg_preprocess:.2f} ms")
        print(f"Avg Inference: {avg_inference:.2f} ms")
        print(f"Avg Postprocess: {avg_postprocess:.2f} ms")
except Exception as e:
    print(f"Benchmark failed: {e}")

