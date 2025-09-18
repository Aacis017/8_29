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


# 🎥 Cross-platform camera setup
def get_camera():
    if os.name == "nt":  # Windows
        return cv2.VideoCapture(0)  # default DirectShow backend
    else:  # Raspberry Pi/Linux
        return cv2.VideoCapture(0, cv2.CAP_V4L2)  # V4L2 backend


def generate_frames():
    camera = get_camera()
    if not camera.isOpened():
        print("❌ Camera not detected")
        return

    while True:
        success, frame = camera.read()
        if not success:
            print("❌ Failed to grab frame")
            continue
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


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
