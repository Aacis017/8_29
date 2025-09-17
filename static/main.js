//Initialize Blockly
var workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox'),
  grid: {spacing: 20, length: 1, colour: '#ccc', snap: true},
  zoom: {controls: true, wheel: true}
});

// Initialize CodeMirror
var editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
    mode: "python",
    theme: "darcula",   // or "default", many themes available
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    autofocus: true
});


document.getElementById('generateBtn').addEventListener('click', function() {
  // Generate Python code from the entire workspace
  const code = python.pythonGenerator.workspaceToCode(workspace);

  console.log(code);
  editor.setValue(code);
});

// Load blocks back into workspace
document.getElementById('loadBlocks').addEventListener('click', function() {
  const code = editor.getValue().trim();  // get Python code from editor
  workspace.clear();

  if (code === "filo.takeoff()") {
    const block = workspace.newBlock('takeoff');
    block.initSvg();
    block.render();
  }
  if (code === "filo.land()") {
    const block = workspace.newBlock('land');
    block.initSvg();
    block.render();
  }
});

// Centerize button
document.getElementById("centerBtn").addEventListener("click", () => {
  workspace.scrollCenter();
});

// Start button
document.getElementById("startBtn").addEventListener("click", () => {
    // 1. Convert workspace → JSON
    const program = python.pythonGenerator.workspaceToCode(workspace);
    console.log("Program JSON:", program);

    // 2. Send JSON to Flask server
    fetch("http://127.0.0.1:8000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(program)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Drone response:", data);
      alert("Program sent to drone!");
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Failed to send program to server");
    });
  });





/** BLOCK DEFINITIONS (same as before with validation) **/
function numberField(name, min, max) {
  return {
    "type": "input_value",
    "name": name,
    "check": "Number"
  };
}







