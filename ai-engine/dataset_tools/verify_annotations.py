import streamlit as st
import os
import glob
from PIL import Image, ImageDraw

st.set_page_config(layout="wide")

IMAGE_DIR = "collected_loaded_trucks/images"
LABEL_DIR = "collected_loaded_trucks/labels"

@st.cache_data
def get_image_list():
    if not os.path.exists(IMAGE_DIR):
        return []
    exts = ["*.jpg", "*.jpeg", "*.png"]
    files = []
    for ext in exts:
        files.extend(glob.glob(os.path.join(IMAGE_DIR, ext)))
    return sorted(files)

def draw_boxes(image, label_path):
    img = image.copy()
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    if os.path.exists(label_path):
        with open(label_path, 'r') as f:
            for line in f.readlines():
                parts = line.strip().split()
                if len(parts) == 5:
                    cls_id, x_c, y_c, w, h = map(float, parts)
                    # Convert YOLO format to pixel coordinates
                    x_center, y_center = x_c * width, y_c * height
                    box_w, box_h = w * width, h * height
                    
                    x1 = x_center - (box_w / 2)
                    y1 = y_center - (box_h / 2)
                    x2 = x_center + (box_w / 2)
                    y2 = y_center + (box_h / 2)
                    
                    draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
    return img

images = get_image_list()

if not images:
    st.warning(f"No images found in {IMAGE_DIR}. Run collection first.")
    st.stop()

if 'current_idx' not in st.session_state:
    st.session_state.current_idx = 0

total_images = len(images)

st.title("Annotation Verification Tool")
st.write(f"Image {st.session_state.current_idx + 1} of {total_images}")

# Progress bar
st.progress((st.session_state.current_idx + 1) / total_images)

current_img_path = images[st.session_state.current_idx]
filename = os.path.basename(current_img_path)
name, _ = os.path.splitext(filename)
label_path = os.path.join(LABEL_DIR, f"{name}.txt")

col1, col2 = st.columns([3, 1])

with col1:
    img = Image.open(current_img_path)
    img_with_boxes = draw_boxes(img, label_path)
    st.image(img_with_boxes, use_container_width=True)

with col2:
    st.write(f"**File:** {filename}")
    
    if st.button("Next (Looks Good)", use_container_width=True):
        if st.session_state.current_idx < total_images - 1:
            st.session_state.current_idx += 1
            st.rerun()
            
    if st.button("Delete (Bad Image/Box)", type="primary", use_container_width=True):
        # Delete image and label
        if os.path.exists(current_img_path):
            os.remove(current_img_path)
        if os.path.exists(label_path):
            os.remove(label_path)
            
        st.toast(f"Deleted {filename}")
        
        # Move to next
        if st.session_state.current_idx < total_images - 1:
            st.session_state.current_idx += 1
            st.rerun()

    if st.button("Previous", use_container_width=True):
        if st.session_state.current_idx > 0:
            st.session_state.current_idx -= 1
            st.rerun()
            
st.markdown("---")
st.write("""
### Instructions:
1. Review the bounding box on the image.
2. If the box tightly encloses a **loaded truck**, click **Next**.
3. If the image is bad, not a truck, or the box is incorrect (e.g. only wheels, cargo only), click **Delete**.
""")
