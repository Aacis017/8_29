from flask import Flask, Response, render_template, request, jsonify
import cv2
import serial
import json
import time
import os

app = Flask(__name__)

# 🔌 Arduino serial setup (Windows vs Raspberry Pi)
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


def get_camera():
    """
    Try several ways to open the camera on Raspberry Pi/Linux.
    Returns an opened cv2.VideoCapture or None.
    """
    if os.name == "nt":  # Windows
        cam = cv2.VideoCapture(0)
        return cam

    # On Raspberry Pi / Linux try several strategies
    attempts = [
        ("cv2.CAP_V4L2 index 0", lambda: cv2.VideoCapture(0, cv2.CAP_V4L2)),
        ("/dev/video0 path + CAP_V4L2", lambda: cv2.VideoCapture("/dev/video0", cv2.CAP_V4L2)),
        ("cv2 default backend index 0", lambda: cv2.VideoCapture(0)),
        ("GStreamer libcamerasrc (if OpenCV built with GStreamer)",
         lambda: cv2.VideoCapture(
             "libcamerasrc ! video/x-raw, width=640, height=480, framerate=30/1 ! videoconvert ! appsink",
             cv2.CAP_GSTREAMER))
    ]

    for desc, creator in attempts:
        try:
            print(f"Trying camera open method: {desc}")
            cam = creator()
            # small delay to allow backend to initialize
            time.sleep(0.5)
            if cam is not None and cam.isOpened():
                print(f"✅ Camera opened using: {desc}")
                return cam
            # ensure we release invalid handles
            try:
                cam.release()
            except Exception:
                pass
        except Exception as e:
            print(f"Attempt '{desc}' failed: {e}")

    print("❌ All camera open attempts failed. Camera not detected via OpenCV V4L2/GStreamer.")
    return None


def generate_frames():
    """
    Robust frame generator:
    - Repeatedly tries to open the camera via get_camera()
    - Warms up the camera (grab a few frames)
    - Uses grab()/retrieve() to avoid some backend read issues
    - If multiple consecutive failures occur, release and re-open
    """
    while True:
        camera = get_camera()
        if not camera:
            print("❌ Camera not detected — retrying in 2s")
            time.sleep(2)
            continue

        # Try to set common properties (may be ignored depending on backend)
        try:
            camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            camera.set(cv2.CAP_PROP_FPS, 30)
            print("Camera props:", {
                "opened": camera.isOpened(),
                "width": camera.get(cv2.CAP_PROP_FRAME_WIDTH),
                "height": camera.get(cv2.CAP_PROP_FRAME_HEIGHT),
                "fps": camera.get(cv2.CAP_PROP_FPS)
            })
        except Exception as e:
            print("Warning setting camera props:", e)

        # Warm up
        for i in range(5):
            try:
                camera.grab()
            except Exception:
                pass
            time.sleep(0.05)

        consecutive_failures = 0
        try:
            while True:
                # Use grab/retrieve to be more compatible with some V4L2 backends
                ok_grab = camera.grab()
                if not ok_grab:
                    consecutive_failures += 1
                    print("❌ grab() failed (count):", consecutive_failures)
                else:
                    ok, frame = camera.retrieve()
                    if not ok or frame is None:
                        consecutive_failures += 1
                        print("❌ retrieve() failed (count):", consecutive_failures)
                    else:
                        consecutive_failures = 0
                        ret, buffer = cv2.imencode('.jpg', frame)
                        if not ret:
                            print("❌ cv2.imencode failed, skipping frame")
                            continue
                        frame_bytes = buffer.tobytes()
                        yield (b'--frame\r\n'
                               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

                # If failures keep happening, reopen camera
                if consecutive_failures >= 5:
                    print("❌ Too many consecutive failures, releasing and reopening camera")
                    try:
                        camera.release()
                    except Exception:
                        pass
                    break

                # small pause to avoid tight loop on failure
                time.sleep(0.02)
        except Exception as e:
            print("Exception in generate_frames loop:", e)
        finally:
            try:
                camera.release()
            except Exception:
                pass
        # wait a bit before trying to re-open
        time.sleep(1)
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


# 🚀 Joystick control endpoint
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


# 🚀 Blockly program upload
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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
