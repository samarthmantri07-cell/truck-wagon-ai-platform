import requests
import json

BASE_URL = "http://localhost:5000/api"

print("1. Health Check")
res = requests.get(f"{BASE_URL}/health")
print(res.status_code, res.json())

print("\n2. Register User (should fail if already exists, else pass)")
try:
    res = requests.post(f"{BASE_URL}/auth/register", json={"username": "testuser", "password": "password123"})
    print(res.status_code, res.json())
except Exception as e:
    print(e)

print("\n3. Login User")
res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "admin123"})
print(res.status_code, res.json())
token = res.json().get('token')

headers = {"Authorization": f"Bearer {token}"}

print("\n4. Dashboard Stats")
res = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
print(res.status_code, res.json())

print("\n5. Dashboard Analytics")
res = requests.get(f"{BASE_URL}/dashboard/analytics/throughput", headers=headers)
print(res.status_code, res.json())

print("\n6. Detections list")
res = requests.get(f"{BASE_URL}/detections", headers=headers)
print(res.status_code, res.json())

print("\n7. Upload & Detect")
import cv2
import numpy as np
img = np.zeros((640, 640, 3), dtype=np.uint8)
cv2.imwrite("test_upload.jpg", img)
with open("test_upload.jpg", "rb") as f:
    res = requests.post(f"{BASE_URL}/detections/upload", headers=headers, files={"file": f})
print(res.status_code, res.json())

print("\n8. Detections list after upload")
res = requests.get(f"{BASE_URL}/detections", headers=headers)
print(res.status_code, res.json())
