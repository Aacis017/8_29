from flask import Flask, Response, render_template, request, jsonify
import os
import json
import time
import threading

# Platform-specific imports
if os.name != "nt":  # Raspberry Pi
    try:
        from picamera2 import Picamera2
        import cv2
    except ImportError:
        print("❌ picamera2 or cv2 not installed on Raspberry Pi.")
        Picamera2 = None
        cv2 = None
else:  # Windows
    import cv2

import serial
import numpy as np

app = Flask(__name__)

# -------------------------
# Arduino serial setup
# -------------------------
try:
    if os.name == "nt":
        arduino = serial.Serial("COM1", 9600, timeout=1)
    else:
        arduino = serial.Serial("/dev/ttyACM0", 9600, timeout=1)
    time.sleep(2)
    arduino.reset_input_buffer()
    print("✅ Arduino connected")
except Exception as e:
    print("❌ Arduino connection failed:", e)
    arduino = None

# -------------------------
# Camera setup
# -------------------------
camera_ready = False

if os.name != "nt" and Picamera2:  # Raspberry Pi
    try:
        picam2 = Picamera2()
        picam2.configure(picam2.create_video_configuration(
            main={"size": (640, 480)},
            controls={"FrameRate": 15}
        ))
        picam2.start()
        camera_ready = True
        print("✅ Pi Camera initialized")
    except Exception as e:
        print("❌ Pi Camera init failed:", e)
        picam2 = None
        camera_ready = False
else:  # Windows
    try:
        camera = cv2.VideoCapture(0)
        camera_ready = True
        print("✅ Webcam initialized")
    except Exception as e:
        print("❌ Webcam init failed:", e)
        camera = None
        camera_ready = False

# -------------------------
# Video frame generator
# -------------------------
def generate_frames():
    if not camera_ready:
        # fallback: show "Camera not available"
        while True:
            frame = np.zeros((480, 640, 3), dtype=np.uint8)
            try:
                cv2.putText(frame, "Camera not available", (50, 240),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            except:
                pass
            _, buffer = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
    else:
        while True:
            if os.name != "nt" and picam2:  # Pi Camera
                frame = picam2.capture_array()
                frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            else:  # Windows webcam
                ret, frame = camera.read()
                if not ret:
                    continue

            _, buffer = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

# -------------------------
# Flask routes
# -------------------------
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/filo')
def filo():
    return render_template('filo.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Joystick control
@app.route('/joystick', methods=['POST'])
def joystick():
    try:
        data = request.get_json()
        print("🎮 Joystick data:", data)
        if arduino:
            command = json.dumps(data) + "\n"
            arduino.write(command.encode("utf-8"))
        return jsonify({"status": "ok", "sent": data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Blockly program upload
@app.route('/run', methods=['POST'])
def run_program():
    try:
        program = request.json
        print("📦 Blockly program:", program)
        if arduino:
            command = json.dumps(program) + "\n"
            arduino.write(command.encode("utf-8"))
        return jsonify({"status": "ok", "sent": program})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# -------------------------
# Run Flask app
# -------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
