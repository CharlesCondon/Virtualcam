import pyvirtualcam
import numpy as np
import sys
import cv2
from queue import Queue
from threading import Thread

width, height = 1280, 720
fps = 30
frame_queue = Queue(maxsize=2)  # Limit queue size

def process_frame(data):
    try:
        # Reshape the input data
        frame = np.frombuffer(data, dtype=np.uint8).reshape((height, width, 4))
        
        # Convert color space
        frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGBA2BGR)
        
        # Calculate zoom parameters
        zoom = 1.2  # 20% zoom
        center_x = frame_bgr.shape[1] / 2
        center_y = frame_bgr.shape[0] / 2
        
        # Calculate new dimensions
        new_width = int(frame_bgr.shape[1] / zoom)
        new_height = int(frame_bgr.shape[0] / zoom)
        
        # Calculate crop coordinates
        x1 = int(center_x - new_width/2)
        x2 = int(center_x + new_width/2)
        y1 = int(center_y - new_height/2)
        y2 = int(center_y + new_height/2)
        
        # Crop the center portion (effectively zooming)
        frame_bgr = frame_bgr[y1:y2, x1:x2]
        
        # Resize back to original dimensions
        frame_bgr = cv2.resize(frame_bgr, (width, height), interpolation=cv2.INTER_LINEAR)
        
        return cv2.flip(frame_bgr, 1)
    except Exception as e:
        print(f"Error processing frame: {e}", file=sys.stderr)
        return None

def read_stdin():
    while True:
        try:
            data = sys.stdin.buffer.read(width * height * 4)
            if not data:
                break
            if not frame_queue.full():  # Only process if queue isn't full
                frame = process_frame(data)
                frame_queue.put(frame)
        except Exception as e:
            print(f"Error reading frame: {e}", file=sys.stderr)
            break

# Start stdin reader thread
stdin_thread = Thread(target=read_stdin, daemon=True)
stdin_thread.start()

with pyvirtualcam.Camera(width, height, fps=fps) as cam:
    print(f"Virtual camera running: {cam.device}")
    
    while True:
        try:
            # Non-blocking get with timeout
            frame = frame_queue.get(timeout=1/fps)
            cam.send(frame)
            cam.sleep_until_next_frame()
        except:
            # If no new frame, continue with last frame
            continue
