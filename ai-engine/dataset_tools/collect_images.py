import os
import hashlib
from duckduckgo_search import DDGS
import requests
from PIL import Image
from io import BytesIO
import time

def hash_image(image_bytes):
    try:
        img = Image.open(BytesIO(image_bytes))
        # Resize to small size and convert to grayscale for basic hashing
        img = img.resize((8, 8), Image.Resampling.LANCZOS).convert('L')
        pixels = list(img.getdata())
        avg = sum(pixels) / len(pixels)
        bits = "".join(['1' if pixel > avg else '0' for pixel in pixels])
        return hex(int(bits, 2))[2:].zfill(16)
    except Exception as e:
        return None

def download_images(queries, max_results=600, output_dir="new_images"):
    os.makedirs(output_dir, exist_ok=True)
    downloaded_hashes = set()
    count = 0
    
    with DDGS() as ddgs:
        for query in queries:
            print(f"Searching for: {query}")
            try:
                results = list(ddgs.images(query, max_results=200))
                for res in results:
                    if count >= max_results:
                        break
                    
                    image_url = res.get("image")
                    if not image_url:
                        continue
                    
                    try:
                        resp = requests.get(image_url, timeout=5)
                        if resp.status_code == 200:
                            img_hash = hash_image(resp.content)
                            if img_hash and img_hash not in downloaded_hashes:
                                downloaded_hashes.add(img_hash)
                                ext = image_url.split('.')[-1].lower()
                                if ext not in ['jpg', 'jpeg', 'png']:
                                    ext = 'jpg'
                                filename = os.path.join(output_dir, f"loaded_truck_{count:04d}.{ext}")
                                with open(filename, 'wb') as f:
                                    f.write(resp.content)
                                print(f"Downloaded {filename}")
                                count += 1
                    except Exception as e:
                        pass
                        
            except Exception as e:
                print(f"Error searching {query}: {e}")
                
            if count >= max_results:
                break
                
    print(f"Total unique images downloaded: {count}")

if __name__ == "__main__":
    queries = [
        "loaded dump truck top view",
        "semi truck carrying cargo side view",
        "flatbed truck loaded with goods front view",
        "truck with heavy load rear view",
        "freight truck on highway day",
        "loaded commercial truck night",
        "logging truck loaded",
        "truck carrying pipes",
        "dump truck full of dirt"
    ]
    download_images(queries, max_results=600, output_dir="collected_loaded_trucks/images")
