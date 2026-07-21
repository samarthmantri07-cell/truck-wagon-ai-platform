# Dataset Augmentation Tools

These tools are built to help you collect, auto-annotate, manually verify, and merge new "loaded_truck" images into your existing dataset.

## Setup
Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Workflow

### 1. Collect Images
Run the script to download 600 new images of loaded trucks from search engines.
```bash
python collect_images.py
```
*This will create a folder `collected_loaded_trucks/images`.*

### 2. Auto Annotate
Run the YOLO11 inference to auto-detect trucks and map them to class ID `1` (loaded_truck).
```bash
python auto_annotate.py
```
*This will create YOLO format `.txt` files in `collected_loaded_trucks/labels`.*

### 3. Verify Annotations (Manual Step)
Run the Streamlit application to rapidly review each image. 
```bash
streamlit run verify_annotations.py
```
- A web browser will open.
- Review each image. If the box tightly encloses the loaded truck, click **Next**.
- If the box is wrong or it's not a valid loaded truck, click **Delete (Bad Image/Box)**.

### 4. Merge Dataset
Once verified, merge this folder with your existing dataset. Replace `<path_to_existing_dataset>` with the actual path.
```bash
python merge_dataset.py --existing <path_to_existing_dataset> --new collected_loaded_trucks --output merged_dataset_final
```
*This will create a new folder `merged_dataset_final` with recalculated train/val/test splits, ready for YOLO training!*
