import os
import shutil
import glob
from sklearn.model_selection import train_test_split
import argparse

def merge_datasets(existing_dataset_dir, new_dataset_dir, output_dir, split_ratios=(0.7, 0.2, 0.1)):
    """
    Merges existing YOLO dataset with new verified images and recalculates train/val/test splits.
    
    Assumes structure:
    dataset/
      images/
      labels/
    """
    os.makedirs(output_dir, exist_ok=True)
    for split in ['train', 'val', 'test']:
        os.makedirs(os.path.join(output_dir, 'images', split), exist_ok=True)
        os.makedirs(os.path.join(output_dir, 'labels', split), exist_ok=True)
        
    all_images = []
    all_labels = []
    
    def collect_files(data_dir, is_yolo_split_structure=False):
        if is_yolo_split_structure:
            for split in ['train', 'val', 'test']:
                img_dir = os.path.join(data_dir, 'images', split)
                lbl_dir = os.path.join(data_dir, 'labels', split)
                if os.path.exists(img_dir):
                    imgs = glob.glob(os.path.join(img_dir, '*.*'))
                    for img in imgs:
                        basename = os.path.splitext(os.path.basename(img))[0]
                        lbl_file = os.path.join(lbl_dir, f"{basename}.txt")
                        if os.path.exists(lbl_file):
                            all_images.append(img)
                            all_labels.append(lbl_file)
        else:
            img_dir = os.path.join(data_dir, 'images')
            lbl_dir = os.path.join(data_dir, 'labels')
            if os.path.exists(img_dir):
                imgs = glob.glob(os.path.join(img_dir, '*.*'))
                for img in imgs:
                    basename = os.path.splitext(os.path.basename(img))[0]
                    lbl_file = os.path.join(lbl_dir, f"{basename}.txt")
                    if os.path.exists(lbl_file):
                        all_images.append(img)
                        all_labels.append(lbl_file)
                        
    print(f"Scanning existing dataset: {existing_dataset_dir}")
    # Assume existing dataset has splits
    collect_files(existing_dataset_dir, is_yolo_split_structure=True)
    # Fallback if it's flat
    if len(all_images) == 0:
        collect_files(existing_dataset_dir, is_yolo_split_structure=False)
        
    initial_count = len(all_images)
    print(f"Found {initial_count} existing images.")
    
    print(f"Scanning new dataset: {new_dataset_dir}")
    collect_files(new_dataset_dir, is_yolo_split_structure=False)
    
    total_count = len(all_images)
    print(f"Found {total_count - initial_count} new images.")
    print(f"Total dataset size: {total_count}")
    
    if total_count == 0:
        print("No images found to process.")
        return
        
    # Recalculate Splits
    train_ratio, val_ratio, test_ratio = split_ratios
    
    train_imgs, temp_imgs, train_lbls, temp_lbls = train_test_split(
        all_images, all_labels, test_size=(1 - train_ratio), random_state=42
    )
    
    val_prop = val_ratio / (val_ratio + test_ratio)
    val_imgs, test_imgs, val_lbls, test_lbls = train_test_split(
        temp_imgs, temp_lbls, test_size=(1 - val_prop), random_state=42
    )
    
    def copy_files(img_list, lbl_list, split_name):
        for img_src, lbl_src in zip(img_list, lbl_list):
            basename = os.path.basename(img_src)
            img_dst = os.path.join(output_dir, 'images', split_name, basename)
            lbl_dst = os.path.join(output_dir, 'labels', split_name, os.path.basename(lbl_src))
            
            # Prevent overwriting by appending hash or index if needed, but for simplicity assuming unique names
            if os.path.exists(img_dst):
                name, ext = os.path.splitext(basename)
                img_dst = os.path.join(output_dir, 'images', split_name, f"{name}_merged{ext}")
                lbl_dst = os.path.join(output_dir, 'labels', split_name, f"{name}_merged.txt")
                
            shutil.copy2(img_src, img_dst)
            shutil.copy2(lbl_src, lbl_dst)
            
    print("Copying train set...")
    copy_files(train_imgs, train_lbls, 'train')
    print("Copying val set...")
    copy_files(val_imgs, val_lbls, 'val')
    print("Copying test set...")
    copy_files(test_imgs, test_lbls, 'test')
    
    print(f"Merge Complete! Final Dataset saved at: {output_dir}")
    print(f"Train: {len(train_imgs)} | Val: {len(val_imgs)} | Test: {len(test_imgs)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Merge and Split YOLO Datasets")
    parser.add_argument("--existing", type=str, required=True, help="Path to existing YOLO dataset")
    parser.add_argument("--new", type=str, default="collected_loaded_trucks", help="Path to new dataset (images/ labels/ inside)")
    parser.add_argument("--output", type=str, default="merged_dataset_final", help="Output path for merged dataset")
    args = parser.parse_args()
    
    merge_datasets(args.existing, args.new, args.output)
