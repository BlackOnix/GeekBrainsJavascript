var doc = document;


var size = doc.getElementById('sizeSelect');
var newColor = doc.getElementById('color');
var canvas = doc.getElementById('canv');
var ctx = canvas.getContext('2d');
var xCoord = doc.getElementById('xCoord');
var yCoord = doc.getElementById('yCoord');
var activeTool = '';
//
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColor = new Array();
var clickSize = new Array();
var clickTool = new Array();
var paint;


var system = {
	width: canvas.getAttribute('width'),
	height: canvas.getAttribute('height'),
	currentColor: newColor.value,
	currentTool: '',
	brushSize : size.value
};

var getCoordinates = function (e) {
    if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
    
	let x = e.offsetX;
	let y = e.offsetY;
    
    xCoord.innerText = x;
	yCoord.innerText = y;

};

var renderSystem = function (obj, elem, action) {
	obj[elem] = action;
	console.log('done!');
	console.log(obj);
};

var switchTool = function (button) {
    resetButtonsStyle();
    button.style.fontWeight = 700;
	if (button.id == 'brush') {
        system.currentTool = 'brush';
	} else if (button.id == 'eraser') {
        system.currentTool = 'eraser';
        system.currentColor = '#ffffff';
	} else if (button.id == 'clear') {
        ctx.clearRect(0,0,system.width,system.height);
        clickX = new Array();
        clickY = new Array();
        clickDrag = new Array();
        clickColor = new Array();
        clickSize = new Array();
        clickTool = new Array();
        resetButtonsStyle();
        doc.getElementById('brush').style.fontWeight = 700;
	}
};

var switchSize = function (list) {
	return list.value;
};

var switchColor = function (colorInput) {
	let a = newColor.value;
	return a;
};

var mouseActions = function (evt) {
	if (evt.target.classList.contains('toolButton') == true) {
		console.log(system);
		renderSystem(system, 'currentTool', switchTool(evt.target));
	} else if (evt.target.id == 'sizeSelect') {
		renderSystem(system, 'brushSize', switchSize(evt.target));
	}
};

var startDraw = function (e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
		
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
};

var endDraw = function (evt) {
	paint = false;
};

var leaveDraw = function(e){
    paint = false;
}

var addClick = function(x, y, dragging)
{
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(system.currentColor);
    clickSize.push(system.brushSize);
}

var redraw = function(){
    
    ctx.lineJoin = "round";
			
    for(var i=0; i < clickX.length; i++) {		
        ctx.beginPath();
        if(clickDrag[i] && i){
            ctx.moveTo(clickX[i-1], clickY[i-1]);
        }else{
            ctx.moveTo(clickX[i]-1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.strokeStyle = clickColor[i];
        console.log(clickColor[i]);
        ctx.lineWidth = clickSize[i];
        ctx.stroke();
    }
}

var changeColor = function(e){
    renderSystem(system, 'currentColor', switchColor(e.target));
}

var resetButtonsStyle = function(){
    var selects = document.getElementsByClassName("toolButton");
    for(var i =0, il = selects.length;i<il;i++){
        selects[i].style.fontWeight = 300;
    }
}


canvas.addEventListener('mousemove', getCoordinates);
doc.addEventListener('click', mouseActions);
newColor.addEventListener('change', changeColor)
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseleave', leaveDraw);
