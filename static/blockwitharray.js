

Blockly.defineBlocksWithJsonArray([
  { "type": "takeoff", "message0": "takeoff", "previousStatement": null, "nextStatement": null, "colour": 160 },
  { "type": "land", "message0": "Land", "previousStatement": null, "nextStatement": null, "colour": 160 },
  { "type": "stop", "message0": "Stop (hover)", "previousStatement": null, "nextStatement": null, "colour": 160 },
  { "type": "emergency", "message0": "Emergency Stop Motors", "previousStatement": null, "nextStatement": null, "colour": 0 },
  { "type": "up", "message0": "Up %1 cm", "args0": [{"type":"field_number","name":"DIST","value":50,"min":20,"max":500}], "previousStatement": null, "nextStatement": null, "colour": 230 },
  { "type": "down", "message0": "Down %1 cm", "args0": [{"type":"field_number","name":"DIST","value":50,"min":20,"max":500}], "previousStatement": null, "nextStatement": null, "colour": 230 },
  { "type": "forward", "message0": "Forward %1 cm", "args0": [{"type":"field_number","name":"DIST","value":100,"min":20,"max":500}], "previousStatement": null, "nextStatement": null, "colour": 230 },
  { "type": "back", "message0": "Back %1 cm", "args0": [{"type":"field_number","name":"DIST","value":100,"min":20,"max":500}], "previousStatement": null, "nextStatement": null, "colour": 230 },
  { "type": "left", "message0": "Left %1 cm", "args0": [{"type":"field_number","name":"DIST","value":100,"min":20,"max":500}], "previousStatement": null, "nextStatement": null, "colour": 230 },
  { "type": "right", "message0": "Right %1 cm", "args0": [{"type":"field_number","name":"DIST","value":100,"min":20,"max":500}], "previousStatement": null, "nextStatement": null, "colour": 230 },
  { "type": "rotate_cw", "message0": "Rotate CW %1°", "args0": [{"type":"field_number","name":"ANGLE","value":90,"min":1,"max":360}], "previousStatement": null, "nextStatement": null, "colour": 60 },
  { "type": "rotate_ccw", "message0": "Rotate CCW %1°", "args0": [{"type":"field_number","name":"ANGLE","value":90,"min":1,"max":360}], "previousStatement": null, "nextStatement": null, "colour": 60 },
  { "type": "flip_front", "message0": "Flip Front", "previousStatement": null, "nextStatement": null, "colour": 20 },
  { "type": "flip_back", "message0": "Flip Back", "previousStatement": null, "nextStatement": null, "colour": 20 },
  { "type": "flip_left", "message0": "Flip Left", "previousStatement": null, "nextStatement": null, "colour": 20 },
  { "type": "flip_right", "message0": "Flip Right", "previousStatement": null, "nextStatement": null, "colour": 20 },
  { "type": "photo", "message0": "Take Photo", "previousStatement": null, "nextStatement": null, "colour": 300 },
  { "type": "record_start", "message0": "Start Recording", "previousStatement": null, "nextStatement": null, "colour": 300 },
  { "type": "record_stop", "message0": "Stop Recording", "previousStatement": null, "nextStatement": null, "colour": 300 },
  { "type": "setspeed", "message0": "Set Speed %1 cm/s", "args0": [{"type":"field_number","name":"SPD","value":50,"min":10,"max":100}], "previousStatement": null, "nextStatement": null, "colour": 290 },
  { "type": "go", "message0": "Go to X:%1 Y:%2 Z:%3 Speed:%4", "args0": [
      {"type":"field_number","name":"X","value":0,"min":-500,"max":500},
      {"type":"field_number","name":"Y","value":0,"min":-500,"max":500},
      {"type":"field_number","name":"Z","value":0,"min":-500,"max":500},
      {"type":"field_number","name":"SPD","value":50,"min":10,"max":100}
    ], "previousStatement": null, "nextStatement": null, "colour": 290 },
  { "type": "curve", "message0": "Curve P1:(%1,%2,%3) → P2:(%4,%5,%6) Speed:%7", "args0": [
      {"type":"field_number","name":"X1","value":0,"min":-500,"max":500},
      {"type":"field_number","name":"Y1","value":0,"min":-500,"max":500},
      {"type":"field_number","name":"Z1","value":0,"min":-500,"max":500},
      {"type":"field_number","name":"X2","value":0,"min":-500,"max":500},
      {"type":"field_number","name":"Y2","value":0,"min":-500,"max":500},
      {"type":"field_number","name":"Z2", "value":0,"min":-500,"max":500},
      {"type":"field_number","name":"SPD","value":50,"min":10,"max":100}
    ], "previousStatement": null, "nextStatement": null, "colour": 290 },

    // WAIT
{ "type": "wait_seconds", "message0": "Wait %1 seconds",
  "args0": [{"type":"field_number","name":"SEC","value":1,"min":0.1,"max":60,"precision":0.1}],
  "previousStatement": null, "nextStatement": null, "colour": 30 },

// LED Color Preset
{ "type": "led_color", "message0": "LED Color %1",
  "args0": [{"type":"field_dropdown","name":"COLOR","options":[
    ["Red","red"],["Green","green"],["Blue","blue"],["Yellow","yellow"],["White","white"],["Cyan","cyan"],["Magenta","magenta"]
  ]}],
  "previousStatement": null, "nextStatement": null, "colour": 330 },

// LED RGB
{ "type": "led_rgb", "message0": "LED RGB R %1 G %2 B %3",
  "args0": [
    {"type":"field_number","name":"R","value":255,"min":0,"max":255},
    {"type":"field_number","name":"G","value":255,"min":0,"max":255},
    {"type":"field_number","name":"B","value":255,"min":0,"max":255}
  ],
  "previousStatement": null, "nextStatement": null, "colour": 330 },

// LED Breathe
{ "type": "led_breathe", "message0": "LED Breathe R %1 G %2 B %3 Speed %4",
  "args0": [
    {"type":"field_number","name":"R","value":255,"min":0,"max":255},
    {"type":"field_number","name":"G","value":255,"min":0,"max":255},
    {"type":"field_number","name":"B","value":255,"min":0,"max":255},
    {"type":"field_number","name":"SP","value":2,"min":1,"max":10}
  ],
  "previousStatement": null, "nextStatement": null, "colour": 330 },

// LED Flash
{ "type": "led_flash", "message0": "LED Flash R %1 G %2 B %3 Speed %4",
  "args0": [
    {"type":"field_number","name":"R","value":255,"min":0,"max":255},
    {"type":"field_number","name":"G","value":255,"min":0,"max":255},
    {"type":"field_number","name":"B","value":255,"min":0,"max":255},
    {"type":"field_number","name":"SP","value":5,"min":1,"max":10}
  ],
  "previousStatement": null, "nextStatement": null, "colour": 330 },

// Battery Level
{ "type": "battery_level", "message0": "Battery Level", "output":"Number", "colour": 290 },

// WiFi Signal
{ "type": "wifi_signal", "message0": "Wi-Fi Signal", "output":"Number", "colour": 290 },

// Altitude
{ "type": "altitude", "message0": "Altitude (cm)", "output":"Number", "colour": 290 }

]);


