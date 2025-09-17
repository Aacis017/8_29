// Movement + BasicblockToJson
python.pythonGenerator.forBlock['takeoff'] = (block, generator) => 'filo.takeoff()\n';
python.pythonGenerator.forBlock['land'] = (block, generator) => 'filo.land()\n';
python.pythonGenerator.forBlock['stop'] = (block, generator) => 'filo.stop()\n';
python.pythonGenerator.forBlock['emergency'] = (block, generator) => 'filo.emergency()\n';

python.pythonGenerator.forBlock['up'] = (block, generator) => `filo.move_up(${block.getFieldValue('DIST')})\n`;
python.pythonGenerator.forBlock['down'] = (block, generator) => `filo.move_down(${block.getFieldValue('DIST')})\n`;
python.pythonGenerator.forBlock['forward'] = (block, generator) => `filo.move_forward(${block.getFieldValue('DIST')})\n`;
python.pythonGenerator.forBlock['back'] = (block, generator) => `filo.move_back(${block.getFieldValue('DIST')})\n`;
python.pythonGenerator.forBlock['left'] = (block, generator) => `filo.move_left(${block.getFieldValue('DIST')})\n`;
python.pythonGenerator.forBlock['right'] = (block, generator) => `filo.move_right(${block.getFieldValue('DIST')})\n`;

python.pythonGenerator.forBlock['rotate_cw'] = (block, generator) => `filo.rotate_clockwise(${block.getFieldValue('ANGLE')})\n`;
python.pythonGenerator.forBlock['rotate_ccw'] = (block, generator) => `filo.rotate_counter_clockwise(${block.getFieldValue('ANGLE')})\n`;

python.pythonGenerator.forBlock['flip_front'] = (block, generator) => 'filo.flip("f")\n';
python.pythonGenerator.forBlock['flip_back'] = (block, generator) => 'filo.flip("b")\n';
python.pythonGenerator.forBlock['flip_left'] = (block, generator) => 'filo.flip("l")\n';
python.pythonGenerator.forBlock['flip_right'] = (block, generator) => 'filo.flip("r")\n';

// Camera
python.pythonGenerator.forBlock['photo'] = (block, generator) => 'filo.take_picture()\n';
python.pythonGenerator.forBlock['record_start'] = (block, generator) => 'filo.start_recording()\n';
python.pythonGenerator.forBlock['record_stop'] = (block, generator) => 'filo.stop_recording()\n';

// Speed + Path
python.pythonGenerator.forBlock['setspeed'] = (block, generator) => `filo.set_speed(${block.getFieldValue('SPD')})\n`;
python.pythonGenerator.forBlock['go'] = (block, generator) => 
  `filo.go(${block.getFieldValue('X')}, ${block.getFieldValue('Y')}, ${block.getFieldValue('Z')}, ${block.getFieldValue('SPD')})\n`;
python.pythonGenerator.forBlock['curve'] = (block, generator) => 
  `filo.curve(${block.getFieldValue('X1')}, ${block.getFieldValue('Y1')}, ${block.getFieldValue('Z1')}, ${block.getFieldValue('X2')}, ${block.getFieldValue('Y2')}, ${block.getFieldValue('Z2')}, ${block.getFieldValue('SPD')})\n`;

// Status
python.pythonGenerator.forBlock['battery_level'] = (block, generator) => ['filo.get_battery()', python.pythonGenerator.ORDER_ATOMIC];
python.pythonGenerator.forBlock['wifi_signal'] = (block, generator) => ['filo.get_wifi()', python.pythonGenerator.ORDER_ATOMIC];
python.pythonGenerator.forBlock['altitude'] = (block, generator) => ['filo.get_height()', python.pythonGenerator.ORDER_ATOMIC];

// Wait
python.pythonGenerator.forBlock['wait_seconds'] = (block, generator) => {
  var sec = block.getFieldValue('SEC');
  python.pythonGenerator.definitions_['import_time'] = 'import time';
  return `time.sleep(${sec})\n`;
};

// LED Color
python.pythonGenerator.forBlock['led_color'] = (block, generator) => 
  `filo.led_set_color("${block.getFieldValue('COLOR')}")\n`;

python.pythonGenerator.forBlock['led_rgb'] = (block, generator) => 
  `filo.led_set_rgb(${block.getFieldValue('R')}, ${block.getFieldValue('G')}, ${block.getFieldValue('B')})\n`;

python.pythonGenerator.forBlock['led_breathe'] = (block, generator) => 
  `filo.led_breathe(${block.getFieldValue('R')}, ${block.getFieldValue('G')}, ${block.getFieldValue('B')}, ${block.getFieldValue('SP')})\n`;

python.pythonGenerator.forBlock['led_flash'] = (block, generator) => 
  `filo.led_flash(${block.getFieldValue('R')}, ${block.getFieldValue('G')}, ${block.getFieldValue('B')}, ${block.getFieldValue('SP')})\n`;
