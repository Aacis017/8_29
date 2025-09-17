document.addEventListener('DOMContentLoaded', () => {
    const joystickLeft = nipplejs.create({
        zone: document.getElementById('joystick-left'),
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'white'
    });

    const joystickRight = nipplejs.create({
        zone: document.getElementById('joystick-right'),
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'white'
    });

    // Helper: send JSON command to Flask
    function sendCommand(command) {
        fetch('/joystick', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(command)
        }).catch(err => console.error('Send failed:', err));
    }

    // LEFT joystick → throttle (Y axis) + yaw (X axis)
    joystickLeft.on('move', (evt, data) => {
        if (data && data.vector) {
            const throttle = data.vector.y.toFixed(2); // Up = +, Down = -
            const yaw = data.vector.x.toFixed(2);      // Left = -, Right = +
            console.log('Left Joystick:', { throttle, yaw });
            sendCommand({ throttle, yaw });
        }
    });

    // RIGHT joystick → pitch (Y axis) + roll (X axis)
    joystickRight.on('move', (evt, data) => {
        if (data && data.vector) {
            const pitch = data.vector.y.toFixed(2);  // Up = +, Down = -
            const roll = data.vector.x.toFixed(2);   // Left = -, Right = +
            console.log('Right Joystick:', { pitch, roll });
            sendCommand({ pitch, roll });
        }
    });

    // Buttons
    document.getElementById('takeoff-button').addEventListener('click', () => {
        console.log('Takeoff button pressed');
        sendCommand({ action: 'takeoff' });
    });

    document.getElementById('land-button').addEventListener('click', () => {
        console.log('Land button pressed');
        sendCommand({ action: 'land' });
    });

    document.getElementById('return-home-button').addEventListener('click', () => {
        console.log('Return to Home button pressed');
        sendCommand({ action: 'return_home' });
    });

    // Dummy telemetry updates
    setInterval(() => {
        const battery = Math.floor(Math.random() * 100);
        const altitude = (Math.random() * 10).toFixed(1);
        const speed = (Math.random() * 20).toFixed(1);

        document.getElementById('battery-level').textContent = `${battery}%`;
        document.getElementById('altitude').textContent = `${altitude}m`;
        document.getElementById('speed').textContent = `${speed}km/h`;
    }, 2000);
});
