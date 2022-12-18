var gl;
var colors = new Float32Array([]);
var color_arr = new Float32Array([]);
//changeColor();
var vcol;
var x_transform = 0.0;
var y_transform = 0.0;
var scale_factor = 1.0;
var isExpand = true;

var vertices = new Float32Array([
  -0.75, 0.5, -0.1, 0.5, -0.1, 0.35, -0.75, 0.5, -0.75, 0.35, -0.1, 0.35, -0.5,
  0.35, -0.35, 0.35, -0.5, -0.3, -0.5, -0.3, -0.35, -0.3, -0.35, 0.35, 0.0, 0.5,
  0.15, 0.5, 0.2, 0.15, 0.15, 0.5, 0.35, 0.15, 0.2, 0.15, 0.2, 0.15, 0.35, 0.15,
  0.4, 0.5, 0.35, 0.15, 0.55, 0.5, 0.4, 0.5, 0.2, 0.15, 0.2, -0.3, 0.35, -0.3,
  0.2, 0.15, 0.35, 0.15, 0.35, -0.3,
]);
var theta;
var thetaLoc;
const frequency = 20;
var speed = 0.0;
var old_speed = speed;
var Isrotate = false;
//var IsCounterClockWise = true;
window.onload = function init() {
  const canvas = document.querySelector("#glcanvas");
  gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    return;
  }
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");

  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  //console.log(Object.values(vPosition));
  thetaLoc = gl.getUniformLocation(program, "theta");
  theta = 0.0;
  gl.uniform1f(thetaLoc, theta);

  var bufferC = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferC);
  fill(color_arr);
  //console.log(color_arr);
  gl.bufferData(gl.ARRAY_BUFFER, color_arr, gl.STATIC_DRAW);

  vcol = gl.getUniformLocation(program, "vcol");

  gl.uniform3fv(vcol, colors);
  changeColor();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  render();
};

document.addEventListener(
  "keydown",
  (event) => {
    var name = event.key;
    if (name === "A" || name === "a") {
      if (vertices[0] <= -1.0) {
        alert("Yatay en düşük sınıra ulaşıldı");
      } else {
        x_transform = -parseFloat(document.getElementById("x_move").value);

        move_x();
      }

      //console.log(vertices);
    } else if (name === "D" || name === "d") {
      if (vertices[44] >= 1.0) {
        alert("Yatay en yüksek sınıra ulaşıldı");
      } else {
        x_transform = parseFloat(document.getElementById("x_move").value);

        move_x();
      }

      //console.log(vertices);
    } else if (name === "W" || name === "w") {
      if (vertices[1] >= 1.0) {
        alert("Dikey en yüksek sınıra ulaşıldı");
      } else {
        y_transform = parseFloat(document.getElementById("y_move").value);

        move_y();
      }

      //console.log(vertices);
    } else if (name === "S" || name === "s") {
      if (vertices[59] <= -1.0) {
        alert("Dikey en düşük sınıra ulaşıldı");
      } else {
        y_transform = -parseFloat(document.getElementById("y_move").value);

        move_y();
      }
    } else if (name === "e" || name === "E") {
      if (vertices[0] <= -1.0 || vertices[44] >= 1.0) {
        alert(
          "Size is bigger than canvas try to move along x y axis or shrink"
        );
      } else {
        isExpand = true;
        MakeItBigger_Smaller();
      }
    } else if (name === "x" || name === "X") {
      if (vertices[0] - vertices[2] > -0.01) {
        alert(
          "Size is too small for human eye to see.Try to move along x y axis or expand"
        );
      } else {
        isExpand = false;

        MakeItBigger_Smaller();
      }
    } else if (name === "R" || name === "r") {
      if (!Isrotate) {
        speed = 0.01;
      }
      Isrotate = true;

      init();
    } else if (name === "P" || name === "p") {
      Isrotate = false;
      old_speed = speed;
      speed = 0;
    }
  }

  //console.log(vertices);
);

/*document.addEventListener("keydown", (event) => {
  var name = event.key;
  if (name === "e") {
    if (vertices[0] <= -1.0 || vertices[44] >= 1.0) {
      alert("Size is bigger than canvas try to move along x y axis or shrink");
    } else {
      isExpand = true;
      MakeItBigger_Smaller();
    }
  } else if (name === "x") {
    if (vertices[0] - vertices[2] > -0.01) {
      alert(
        "Size is too small for human eye to see.Try to move along x y axis or expand"
      );
    } else {
      isExpand = false;

      MakeItBigger_Smaller();
    }
  }
});*/

/*document.addEventListener("keydown", (event) => {
  var name = event.key;
  if (name === "R" || name === "r") {
    Isrotate = true;

    init();
  } else if (name === "P" || name === "p") {
    Isrotate = false;
    old_speed = speed;
    speed = 0;
  }

  //console.log(Isrotate);
});*/
function render() {
  //gl.clear(gl.COLOR_BUFFER_BIT);
  //gl.drawArrays(gl.TRIANGLES, 0, 30);
  theta += speed;
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(thetaLoc, theta);
  gl.drawArrays(gl.TRIANGLES, 0, 30);

  //console.log(theta);

  //render();
}
function hexTorgb(hex) {
  return [
    ("0x" + hex[1] + hex[2]) | 0.0,
    ("0x" + hex[3] + hex[4]) | 0.0,
    ("0x" + hex[5] + hex[6]) | 0.0,
  ];
}

function fill(color_arr) {
  for (var i = 0; i < 90; i++) {
    if (i % 3 == 0) {
      color_arr[i] = colors[0] / 1.0;
    } else if (i % 3 == 1) {
      color_arr[i] = colors[1] / 1.0;
    } else {
      color_arr[i] = colors[2] / 1.0;
    }
  }
}

function init() {
  const canvas = document.querySelector("#glcanvas");
  gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    return;
  }
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");

  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  thetaLoc = gl.getUniformLocation(program, "theta");
  //stheta = 0.0;
  speed = old_speed;
  gl.uniform1f(thetaLoc, theta);
  //console.log(Object.values(vPosition));
  var bufferC = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferC);
  fill(color_arr);
  //console.log(color_arr);
  gl.bufferData(gl.ARRAY_BUFFER, color_arr, gl.STATIC_DRAW);

  vcol = gl.getUniformLocation(program, "vcol");
  //changeColor();
  gl.uniform3fv(vcol, colors);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  if (Isrotate) {
    setInterval(render, frequency);
  } else {
    theta = 0.0;
    render();
  }
}
function changeColor() {
  var values = hexTorgb(document.getElementById("letter-color").value);
  values[0] /= 255.0;
  values[1] /= 255.0;
  values[2] /= 255.0;
  //console.log(values);
  colors = values;
  init();
}

function move_x() {
  for (var i = 0; i < vertices.length; i = i + 2) {
    vertices[i] += x_transform;
  }
  init();
}

function move_y() {
  for (var i = 1; i < vertices.length; i = i + 2) {
    vertices[i] += y_transform;
  }
  init();
}

function MakeItBigger_Smaller() {
  scale_factor = parseFloat(document.getElementById("scale").value);
  for (var i = 0; i < vertices.length; i++) {
    if (isExpand) {
      vertices[i] *= scale_factor;
    } else if (isExpand === false) {
      vertices[i] = vertices[i] / scale_factor;
    }
  }

  init();
}

function ChangeDir() {
  //  if (IsCounterClockWise) IsCounterClockWise = false;
  // else IsCounterClockWise = true;
  speed = -speed;
  old_speed = speed;
  document.getElementById("speed").value = speed;
  //console.log(IsCounterClockWise);
}

function changeSpeed(id) {
  if (id === "Speed_up") {
    speed += 0.01;
    old_speed = speed;
    document.getElementById("speed").value = speed;
  }
  if (id === "Speed_down") {
    speed -= 0.01;
    old_speed = speed;
    document.getElementById("speed").value = speed;
  }
}
