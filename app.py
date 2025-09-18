from flask import Flask, Response, render_template, request, jsonify
import cv2
import serial
import json
import time
import os

app = Flask(__name__)

# ---------------- Arduino Setup ----------------
try:
    if os.name == "nt":  # Windows
        arduino = serial.Serial("COM1", 9600, timeout=1)
    else:  # Raspberry Pi/Linux
        arduino = serial.Serial("/dev/ttyACM0", 9600, timeout=1)
    time.sleep(2)
    arduino.reset_input_buffer()
    print("✅ Arduino connected")
except Exception as e:
    print("❌ Arduino connection failed:", e)
    arduino = None

# ---------------- Camera Setup ----------------
def get_camera():
    """
    Open the libcamera TCP MJPEG stream
    """
     # must match libcamera-vid
    cam = cv2.VideoCapture(cv2.CAP_FFMPEG)
    if cam.isOpened():
        print("✅ Camera stream opened successfully")
        return cam
    else:
        print("❌ Failed to open camera stream")
        return None

def generate_frames():
    """
    Yield MJPEG frames to Flask
    """
    while True:
        camera = get_camera()
        if not camera:
            print("❌ Camera not available — retrying in 2s")
            time.sleep(2)
            continue

        consecutive_failures = 0
        try:
            while True:
                ret, frame = camera.read()
                if not ret or frame is None:
                    consecutive_failures += 1
                    print("❌ Frame read failed (count):", consecutive_failures)
                else:
                    consecutive_failures = 0
                    ret, buffer = cv2.imencode('.jpg', frame)
                    if not ret:
                        print("❌ cv2.imencode failed, skipping frame")
                        continue
                    frame_bytes = buffer.tobytes()
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

                if consecutive_failures >= 5:
                    print("❌ Too many failures, reopening camera")
                    try:
                        camera.release()
                    except:
                        pass
                    break
                time.sleep(0.02)
        except Exception as e:
            print("Exception in generate_frames loop:", e)
        finally:
            try:
                camera.release()
            except:
                pass
        time.sleep(1)

# ---------------- Flask Routes ----------------
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/filo')
def filo():
    return render_template('filo.html')

# ---------------- Joystick endpoint ----------------
@app.route('/joystick', methods=['POST'])
def joystick():
    try:
        data = request.get_json()
        print("Received joystick data:", data)
        if arduino:
            command = json.dumps(data) + "\n"
            arduino.write(command.encode("utf-8"))
        return jsonify({"status": "ok", "sent": data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ---------------- Blockly program endpoint ----------------
@app.route('/run', methods=['POST'])
def run_program():
    try:
        program = request.json
        print("Received Blockly program:", program)
        if arduino:
            command = json.dumps(program) + "\n"
            arduino.write(command.encode("utf-8"))
        return jsonify({"status": "ok", "sent": program})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ---------------- Run Flask ----------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
