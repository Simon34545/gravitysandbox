let sim = new NBodySimulation();
let scaleOffset = 0.01;

let timeStepSlider;
let gravConsSlider;

let menuOpen = false;
let focusedOnBody = false;

let theFocusedBody;
let relativeToBody;

let width = 1125;
let height = 625;

let offset = {
  x : 0,
  y : 0
};
let canvas

let rightPane = document.getElementById('right-pane');
let propertys = document.getElementById('properties');

let bodyLabel = document.getElementById('body-label');
let propLabel = document.getElementById('prop-label');

function createBody(pos, col, str, sho, rad, sur, ini, bod, tra, max, trc, fad, loc) {
  let newBody = new CelestialBody();
  newBody.position = pos; // p5 Vector
  newBody.color = col; // array [int r, int g, int b]
  newBody.stroke = str; // bool
  newBody.showName = sho; // bool
  newBody.radius = rad; // float
  newBody.surfaceGravity = sur; // flot
  newBody.initialVelocity = ini; // p5 Vector
  newBody.bodyName = bod; // string
  newBody.trail = tra; // bool
  newBody.trails = []; // array [...list of previous positions]
  newBody.maxTrails = max; // int
  newBody.trailColor = trc; // array [int r, int g, int b]
  newBody.fadeTrails = fad; // bool
  newBody.locked = loc; // bool
  newBody.Awake();
  sim.bodies.push(newBody);
  
  return newBody
}

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

function getSaveData() {
  let result = '[';
  for (let i = 0; i < sim.bodies.length; i++) {
	const body = sim.bodies[i];
	let bodyData = {
      position : {x: body.position.x, y: body.position.y},
      color : body.color,
      stroke : body.stroke,
      showName : body.showName,
	  trail : body.trail,
	  maxTrails : body.maxTrails,
	  trailColor : body.trailColor,
	  fadeTrails : body.fadeTrails,
	  locked : body.locked,
	  id : body.id,
	  prevPosition : {x: body.prevPosition.x, y: body.prevPosition.y},
      radius : body.radius,
      surfaceGravity : body.surfaceGravity,
      initialVelocity : {x: body.initialVelocity.x, y: body.initialVelocity.y},
      bodyName : body.bodyName,
      velocity : {x: body.velocity.x, y: body.velocity.y},
      mass : body.mass
	};
	
	let stringData = '{';
	
	for (const p in bodyData) {
	  stringData += '"' + p + '":' + JSON.stringify(bodyData[p]) + ',';
	}
	
  result += stringData + (i  < sim.bodies.length - 1 ? '"blank":0},' : '"blank":0}');
  }
  return result + `,{"gravitationalConstant":${Universe.gravitationalConstant},"physicsTimeStep":${Universe.physicsTimeStep},"offset":{"x":${offset.x},"y":${offset.y}},"scaleOffset":${scaleOffset}}]`;
}

function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function openMenu(id) {
  menuOpen = true;
  propertys.style.display = 'block';
  
  for (let i = 0; i < sim.bodies.length; i++) {
	const body = sim.bodies[i];
	if (body.id == theFocusedBody) {
	  propLabel.innerHTML = 'Properties of: "<a title="Reload Properties" href="javascript:openMenu(' + id + ');">' + body.bodyName + '</a>" <br> (Click empty space to close.) <br>';
	  $('#px').val(body.position.x);
	  $('#py').val(body.position.y);
	  $('#vx').val(body.velocity.x);
	  $('#vy').val(body.velocity.y);
	  $('#ix').val(body.initialVelocity.x);
	  $('#iy').val(body.initialVelocity.y);
	  $('#rd').val(body.radius);
	  $('#sg').val(body.surfaceGravity);
	  $('#ps')[0].checked = body.locked;
	  $('#nm').val(body.bodyName);
	  $('#co').val(rgbToHex(body.color[0], body.color[1], body.color[2]));
	  $('#tr')[0].checked = body.trail;
	  $('#tc').val(rgbToHex(body.trailColor[0], body.trailColor[1], body.trailColor[2]));
	  $('#tl').val(body.maxTrails);
	  $('#ft')[0].checked = body.fadeTrails;
	  $('#do')[0].checked = body.stroke;
	  $('#sn')[0].checked = body.showName;
	  $('#id')[0].innerHTML = "Id: " + body.id;
	  $('#pp')[0].innerHTML = "Previous Position: <br> (" + body.prevPosition.x + ", " + body.prevPosition.y + ")";
	  $('#ma')[0].innerHTML = "Mass" + body.mass;
	  
	  return;
	}
  }
}

function create() {
  let body = createBody(createVector(parseFloat($('#px').val()), parseFloat($('#py').val())), hexToRgb($('#co').val()), $('#do')[0].checked, $('#sn')[0].checked, parseFloat($('#rd').val()), parseFloat($('#sg').val()), createVector(parseFloat($('#ix').val()), parseFloat($('#iy').val())), $('#nm').val(), $('#tr')[0].checked, parseFloat($('#tl').val()), hexToRgb($('#tc').val()), $('#ft')[0].checked, $('#ps')[0].checked);
  theFocusedBody = body.id;
  openMenu(body.id);
}

function apply() {
  for (let i = 0; i < sim.bodies.length; i++) {
	const body = sim.bodies[i];
	if (body.id == theFocusedBody) {
	  body.position = createVector(parseFloat($('#px').val()), parseFloat($('#py').val()));
	  body.velocity = createVector(parseFloat($('#vx').val()), parseFloat($('#vy').val()));
	  body.initialVelocity = createVector(parseFloat($('#ix').val()), parseFloat($('#iy').val()));
	  body.radius = parseFloat($('#rd').val());
	  body.surfaceGravity = parseFloat($('#sg').val());
	  body.locked = $('#ps')[0].checked;
	  body.bodyName = $('#nm').val();
	  body.color = hexToRgb($('#co').val());
	  body.trail = $('#tr')[0].checked;
	  body.trailColor = hexToRgb($('#tc').val());
	  body.maxTrails = parseFloat($('#tl').val());
	  body.fadeTrails = $('#ft')[0].checked;
	  body.stroke = $('#do')[0].checked;
	  body.showName = $('#sn')[0].checked;
	  
	  body.OnValidate();
	  openMenu(body.id);
	  return;
	}
  }
}

function destroy() {
  menuOpen = false;
  propertys.style.display = 'none';
  
  for (let i = 0; i < sim.bodies.length; i++) {
	const body = sim.bodies[i];
	if (body.id == theFocusedBody) {
	  theFocusedBody = 0;
	  sim.bodies.splice(i, 1);
	  return;
	}
  }
}

function closeMenu() {
  menuOpen = false;
  propertys.style.display = 'none';
}

function changeFocus(id) {
  if (id == 0) {
	focusedOnBody = false;
	theFocusedBody = 0;
	
	bodyLabel.innerHTML = 'Centered on: nothing <br> <span id="body-label2">(Click an object to focus)</span>';
  } else {
	focusedOnBody = true;
	theFocusedBody = id;
	
	let name = '';
	for (let i = 0; i < sim.bodies.length; i++) {
	  if (sim.bodies[i].id == id) {
		name = sim.bodies[i].bodyName;
	  }
    }
	bodyLabel.innerHTML = `Centered on: ${name} <br> <span id="body-label2">(Click again for properties)</span>`;
  }
}

function newGame() {
  gravConsSlider.value(0.0001);
  timeStepSlider.value(0.01  );
  sim.bodies = [];
  offset = {
    x : 0,
    y : 0
  };
  scaleOffset = 0.01;
  openMenu(0);
}

function saveGame() {
  alert("Copy the save data and keep it somewhere safe!");
  window.open('about:blank', '_blank', height = 250, width = 250).document.write("<title>Save Data</title>"+getSaveData());
}

function loadGame() {
  let saveData = prompt("Paste your save below.");
  
  if (saveData == null || saveData == undefined || saveData == '' || saveData.isEmpty()) {
	alert('Save cannot be blank!!!');
  } else {
	sim.bodies = [];
	const parsedSaveData = JSON.parse(saveData);
	for (let i = 0; i < parsedSaveData.length - 1; i++) {
	  const savedBody = parsedSaveData[i];
	  
	  let newBody = new CelestialBody();
	  newBody.position = createVector(savedBody.position.x, savedBody.position.y); // p5 Vector
	  newBody.color = savedBody.color; // array [int r, int g, int b]
	  newBody.stroke = savedBody.stroke; // bool
	  newBody.showName = savedBody.showName; // bool
	  newBody.radius = savedBody.radius; // float
	  newBody.surfaceGravity = savedBody.surfaceGravity; // flot
	  newBody.initialVelocity = createVector(savedBody.initialVelocity.x, savedBody.initialVelocity.y); // p5 Vector
	  newBody.bodyName = savedBody.bodyName; // string
	  newBody.trail = savedBody.trail; // bool
	  newBody.trails = []; // array [...list of previous positions]
	  newBody.maxTrails = savedBody.maxTrails; // int
	  newBody.trailColor = savedBody.trailColor; // array [int r, int g, int b]
	  newBody.fadeTrails = savedBody.fadeTrails; // bool
	  newBody.locked = savedBody.locked; // bool
	  
	  newBody.id = savedBody.id;
	  newBody.mass = savedBody.mass;
	  newBody.prevPosition = createVector(savedBody.prevPosition.x, savedBody.prevPosition.y);
	  newBody.velocity = createVector(savedBody.velocity.x, savedBody.velocity.y);
	  
	  sim.bodies.push(newBody);
	}
	if (parsedSaveData[parsedSaveData.length - 1].gravitationalConstant < 0.0001) {
	  gravConsSlider.elt.min = parsedSaveData[parsedSaveData.length - 1].gravitationalConstant;
	} else if (parsedSaveData[parsedSaveData.length - 1].gravitationalConstant > 0.1) {
	  gravConsSlider.elt.max = parsedSaveData[parsedSaveData.length - 1].gravitationalConstant;
	} else {
	  gravConsSlider.elt.min = 0.0001;
	  gravConsSlider.elt.max = 0.1;
	}
	if (parsedSaveData[parsedSaveData.length - 1].physicsTimeStep < 0.01) {
	  timeStepSlider.elt.min = parsedSaveData[parsedSaveData.length - 1].physicsTimeStep;
	} else if (parsedSaveData[parsedSaveData.length - 1].physicsTimeStep > 10) {
	  timeStepSlider.elt.max = parsedSaveData[parsedSaveData.length - 1].physicsTimeStep;
	} else {
	  timeStepSlider.elt.min = 0.01;
	  timeStepSlider.elt.max = 10;
	}
	gravConsSlider.value(parsedSaveData[parsedSaveData.length - 1].gravitationalConstant);
	timeStepSlider.value(parsedSaveData[parsedSaveData.length - 1].physicsTimeStep);
	offset = parsedSaveData[parsedSaveData.length - 1].offset;
	scaleOffset = parsedSaveData[parsedSaveData.length - 1].scaleOffset;
  }
}

function timeStepSliderPrompt() {
  let timeStep = prompt("Universe.physicsTimeStep", timeStepSlider.value());
  
  if (timeStep == null || timeStep == undefined || timeStep == '' || timeStep.isEmpty() || parseFloat(timeStep) == 'NaN' || !parseFloat(timeStep)) {
	alert('Invalid.');
  } else {
	timeStep = parseFloat(timeStep);
	
	if (timeStep < 0.01) {
	  timeStepSlider.elt.min = timeStep;
	} else if (timeStep > 10) {
	  timeStepSlider.elt.max = timeStep;
	} else {
	  timeStepSlider.elt.min = 0.01;
	  timeStepSlider.elt.max = 10;
	}
	
	timeStepSlider.value(timeStep);
  }
}

function gravConsSliderPrompt() {
  let gravCons = prompt("Universe.gravitationalConstant", gravConsSlider.value());
  
  if (gravCons == null || gravCons == undefined || gravCons == '' || gravCons.isEmpty() || parseFloat(gravCons) == 'NaN' || !parseFloat(gravCons)) {
	alert('Invalid.');
  } else {
	gravCons = parseFloat(gravCons);
	
	if (gravCons < 0.01) {
	  gravConsSlider.elt.min = gravCons;
	} else if (timeStep > 10) {
	  gravConsSlider.elt.max = gravCons;
	} else {
	  gravConsSlider.elt.min = 0.01;
	  gravConsSlider.elt.max = 10;
	}
	
	gravConsSlider.value(timeStep);
  }
}

function setup() {
  canvas = createCanvas(windowWidth - 150, windowHeight - 100)
  
  canvas.mouseWheel(function(event) {
    if (event.deltaY > 0) {
      scaleOffset *= 0.9;
    } else {
      scaleOffset *= 1.1;
    }
  });
  
  canvas.mouseClicked(function() {
    let clickedOnBody = false;
	let clickedBodyId = 00000;
	
	for (let i = 0; i < sim.bodies.length; i++) {
	  let body = sim.bodies[i];
	  
	  let bodyPosition = createVector(body.position.x * scaleOffset + offset.x, body.position.y * scaleOffset + offset.y);
	  let mousPosition = createVector(mouseX, mouseY);
	  
	  if (p5.Vector.sub(bodyPosition, mousPosition).mag() <= (body.radius * 3 * scaleOffset < 10 ? 10 : body.radius * scaleOffset)) {
		  clickedOnBody = true;
		  clickedBodyId = body.id;
	  }
    }
	
	console.log(clickedOnBody, clickedBodyId);
	
	if (clickedOnBody) {
	  if (menuOpen) {
		if (clickedBodyId != theFocusedBody) {
          closeMenu();
		}
	  } else {
		if (focusedOnBody) {
		  if (clickedBodyId == theFocusedBody) {
			openMenu(clickedBodyId);
		  } else {
			changeFocus(clickedBodyId);
		  }
		} else {
		  changeFocus(clickedBodyId);
		}
	  }
	} else {
	  if (menuOpen) {
	    closeMenu();
	  } else {
		changeFocus(0);
	  }
	}
  });
  
  createSpan('<a href="javascript:timeStepSliderPrompt();">Speed:</a><br>');
  timeStepSlider = createSlider(0, 10, 0.01, 0.01);
  timeStepSlider.size(windowWidth - 4);
  createSpan('<a href="javascript:gravConsSliderPrompt();">Gravity:</a><br>');
  gravConsSlider = createSlider(0, 0.1, 0.0001, 0.0001);
  gravConsSlider.size(windowWidth - 4);
  offset.x = Math.round(windowWidth  / 2);
  offset.y = Math.round(windowHeight / 2);
  frameRate(60);
  textSize(16);
  
  $('#new').click(newGame);
  $('#save').click(saveGame);
  $('#load').click(loadGame);
  
  $('#create').click(create);
  $('#apply').click(apply);
  $('#destroy').click(destroy);
  
  createBody(createVector(0, 0), Colours.Sun, true, true, 1500, 50, createVector(0, 0), "Sun", false, 300, Colours.Sun, true, false);
  createBody(createVector(-11033, 0), Colours.Blue, true, true, 300, 10, createVector(0, -115.36), "Blue Twin", true, 300, Colours.Blue, true, false);
  createBody(createVector(-13038, 0), Colours.Red, true, true, 300, 10, createVector(0, -80.6), "Red Twin", true, 300, Colours.Red, true, false);
  createBody(createVector(-24494, 0), Colours.Green, true, true, 200, 8, createVector(0, -70.23), "Green Planet", true, 300, Colours.Green, true, false);
  createBody(createVector(-23549, 0), Colours.White, true, true, 50, 3, createVector(0, -51.4), "Green Moon", false, 300, Colours.White, true, false);
  createBody(createVector(-49811, 0), Colours.Purple, true, true, 500, 14, createVector(0, -50.3), "Purple Giant", true, 300, Colours.Purple, true, false);
  createBody(createVector(-48169, 0), Colours.Grey, true, true, 40, 2, createVector(0, -3.6), "Purple Moon A", false, 300, Colours.Grey, true, false);
  createBody(createVector(-46420, 0), Colours.White, true, true, 90, 4.5, createVector(0, -17.8), "Purple Moon B", false, 300, Colours.White, true, false);
  theFocusedBody = 0;
}

function mouseDragged() {
  if (mouseY <= windowHeight - 100) {
	offset.x += mouseX - pmouseX;
	offset.y += mouseY - pmouseY;
  }
}

function windowResized() {
  resizeCanvas(windowWidth - 150, windowHeight - 100);
  timeStepSlider.size(windowWidth - 4);
  gravConsSlider.size(windowWidth - 4);
}

function draw() {
  background(0);
  if (Universe.physicsTimeStep > 0) {
    sim.FixedUpdate();
  }
  
  textAlign(CENTER);
  const bodies = sim.bodies;
  
  for (let i = 0; i < bodies.length; i++) {
	if (bodies[i].id == theFocusedBody) {
	  offset.x = -bodies[i].position.x * scaleOffset + (windowWidth  - 150) / 2;
	  offset.y = -bodies[i].position.y * scaleOffset + (windowHeight - 100) / 2;
	}
  }
  
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i];
	if (body.trail === true) {
	  for (let i = 0; i < body.trails.length; i++) {
		  const trail1 = body.trails[i];
		  const trail2 = i + 1 < body.trails.length ? body.trails[i + 1] : body.position;
		  
		  const scrPos1X = trail1.x * scaleOffset + offset.x;
		  const scrPos1Y = trail1.y * scaleOffset + offset.y;
		  
		  const scrPos2X = trail2.x * scaleOffset + offset.x;
		  const scrPos2Y = trail2.y * scaleOffset + offset.y;
		  
		  if (body.fadeTrails) {
			if (body.trailColor === null) {
			  stroke(body.color[0], body.color[1], body.color[2], i / body.maxTrails * 255);
			} else {
			  stroke(body.trailColor[0], body.trailColor[1], body.trailColor[2], i / body.maxTrails * 255);
			}
		  } else {
			if (body.trailColor === null) {
			  stroke(body.color[0], body.color[1], body.color[2]);
			} else {
			  stroke(body.trailColor[0], body.trailColor[1], body.trailColor[2]);
			}
		  }
		  
		  line(scrPos1X, scrPos1Y, scrPos2X, scrPos2Y);
		  
	  }
	}
	
    if (body.stroke) {
      stroke(255 - body.color.r, 255 - body.color.g, 255 - body.color.b);
    } else {
      noStroke();
    }
    
    fill(body.color[0], body.color[1], body.color[2]);
    
    circle(body.position.x * scaleOffset + offset.x, body.position.y * scaleOffset + offset.y, body.radius * 2 * scaleOffset);
    
    if (body.showName) {
      fill(255);
      stroke(128);
      text(body.bodyName, body.position.x * scaleOffset + offset.x, body.position.y * scaleOffset + offset.y + body.radius  * scaleOffset + 12);
    }
  }
  Universe.physicsTimeStep = timeStepSlider.value();
  Universe.gravitationalConstant = gravConsSlider.value();
  textAlign(LEFT);
  fill(255);
  stroke(128);
  let percent = Math.round((scaleOffset * 100) * 10) / 10;
  let offsetx = Math.round(offset.x * 10) / 10;
  let offsety = Math.round(offset.y * 10) / 10;
  let numbfps = Math.round(1000 / deltaTime);
  
  text(`Offset: (${Math.round(offsetx) == offsetx ? offsetx + '.0' : offsetx}, ${Math.round(offsety) == offsety ? offsety + '.0' : offsety}), Zoom ${Math.round(percent) == percent ? percent + '.0' : percent}% FPS: ${numbfps}`, 0, 16);
  text(`Speed: ${Universe.physicsTimeStep}`, 0, 32);
  text(`Gravity: ${Universe.gravitationalConstant}`, 0, 48);
}