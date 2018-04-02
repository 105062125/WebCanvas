var canvas, canvasGrid, canvasTmp, ctx, ctxGrid, ctxTmp;
var curX = 0, curY = 0, preX = -1, preY = -1;
var curColorBox, curColor = '#000000', curWidth = 2;
var cPushArray = new Array();
var cStep = -1;
var hasInput = false;
var flagShape = false, flagTool = false;
var font = '59px sans-serif';
var font_name = 'Arial';

if (currentShape == 'polygon'){
  currentShapeObj.finish()
  currentShapeObj.draw(ctx);
}

var currentTool = 'pencil';
var currentShape = '';
var currentShapeObj = null;

function chooseTool(name){
  currentTool = name;
  currentShape = '';
  canvasTmp.style.display = 'none';
  var link = document.getElementById(name).src;
  $('canvas').css('cursor', 'url(' + link + '), auto');
}

function chooseShape(name){
  ctxTmp.clearRect(0, 0, w, h);
  ctxTmp.beginPath();

  if (currentShape == 'curve' && currentShapeObj != null){
    currentShapeObj.draw(ctx);
  }

  currentTool = '';
  currentShape = name;
  canvasTmp.style.display = 'block';
  var link = document.getElementById(name).src;
  $('canvas').css('cursor', 'url(' + link + '), auto');
}

function chooseColor(id){
  $('#color-quick-1').removeClass('active');
  $('#color-quick-2').removeClass('active');
  $('#' + id).addClass('active');

  curColorBox = document.getElementById(id);
  curColor = curColorBox.style.background;
}

function pickColor(id){
  curColor = id;
  curColorBox.style.background = id;
}

function changeThickness(value){
  curWidth = Math.round(parseInt(value)/10);
  if (curWidth == 0)
    curWidth = 1;
  document.getElementById('rangeDemo').style.height = curWidth + 'px';
  document.getElementById('rangeValue').innerHTML = curWidth + 'px';
}

function drawGrid(){
  ctxGrid.beginPath();
  ctxGrid.strokeStyle = 'rgba(220,220,220,1)';

  for (var x = 0; x < w; x += 10){
    ctxGrid.moveTo(x, 0);
    ctxGrid.lineTo(x, h);
  }
  for (var y = 0; y < h; y += 10){
    ctxGrid.moveTo(0, y);
    ctxGrid.lineTo(w, y);
  }
  ctxGrid.stroke();
  ctxGrid.closePath();
}

function init() {
  canvas = document.getElementById('canvas');
  canvasGrid = document.getElementById('canvasGrid');
  canvasTmp = document.getElementById('canvasTmp');

  canvas.width = 650;  //畫圖的地方的長寬
  canvas.height = 570;
  canvasGrid.width = canvas.width;
  canvasGrid.height = canvas.height;
  canvasTmp.width = canvas.width;
  canvasTmp.height = canvas.height;

  ctx = canvas.getContext('2d');
  ctxGrid = canvasGrid.getContext('2d');
  ctxTmp = canvasTmp.getContext('2d');

  w = canvas.width;
  h = canvas.height;
  canvas.addEventListener('mousedown', function (e){ handleToolDown(e) }, false);
  canvas.addEventListener('mouseup', function (e){ handleToolUp(e) }, false);
  canvas.addEventListener('mousemove', function (e){ handleToolMove(e) }, true);

  canvasTmp.addEventListener('mousedown', function (e){ handleShapeDown(e) }, false);
  canvasTmp.addEventListener('mouseup', function (e){ handleShapeUp(e) }, false);
  canvasTmp.addEventListener('mousemove', function (e){ handleShapeMove(e) }, false);

  document.getElementById("fileUpload").addEventListener("change",readImage,false);
  //Tmp layers
  canvasTmp.style.display = 'none';
  //Painting
  ctx.fillStyle = "white"; //整個canvas塗上白色背景避免PNG的透明底色效果
  ctx.fillRect(0, 0, w, h);
  ctxGrid.fillStyle = "white";
  ctx.fillRect(0,0,w,h);
  ctxTmp.fillStyle = "white";
  ctxTmp.fillRect(0,0,w,h);
  ctx.beginPath();
  cPush();
  //Cursor
  $('canvas').css( 'cursor', 'url(assets/img/tools/pencil.png), auto' );
  //Color box
  curColorBox = document.getElementById('color-quick-1');
}



function clearPad(){
  var canvas=document.querySelector('#canvas');
  var ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="white";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  var canvasTmp=document.querySelector('#canvasTmp');
  var ctxTmp=canvas.getContext("2d");
  ctxTmp.clearRect(0,0,canvasTmp.width,canvasTmp.height);
  ctxTmp.fillStyle="white";
  ctxTmp.fillRect(0,0,canvasTmp.width,canvasTmp.height);

  var canvasGrid=document.querySelector('#canvas');
  var ctxGrid=canvas.getContext("2d");
  ctxGrid.clearRect(0,0,canvasGrid.width,canvasGrid.height);
  ctxGrid.fillStyle="white";
  ctxGrid.fillRect(0,0,canvasGrid.width,canvasGrid.height);
  }

function circlef()
        {
            ctx.lineCap = "round";
        }

function squaref()
 {
            ctx.lineCap = "square";
}



function cPush() {
    cStep++;
    if (cStep < cPushArray.length) { cPushArray.length = cStep; }
    cPushArray.push(document.getElementById('canvas').toDataURL());
}
function cUndo() {
  if (cStep > 0) {
      cStep--;
      var canvasPic = new Image();
      canvasPic.src = cPushArray[cStep];
      canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
  }
}
function cRedo() {
  if (cStep < cPushArray.length-1) {
      cStep++;
      var canvasPic = new Image();
      canvasPic.src = cPushArray[cStep];
      canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
  }
}

function readImage(){
  canvas = document.getElementById('canvas');
  canvasGrid = document.getElementById('canvasGrid');
  canvasTmp = document.getElementById('canvasTmp');

  canvas.width = 650;  //畫圖的地方的長寬
  canvas.height = 570;
  canvasGrid.width = canvas.width;
  canvasGrid.height = canvas.height;
  canvasTmp.width = canvas.width;
  canvasTmp.height = canvas.height;

  ctx = canvas.getContext('2d');
  ctxGrid = canvasGrid.getContext('2d');
  ctxTmp = canvasTmp.getContext('2d');

  w = canvas.width;
  h = canvas.height;
  if(this.files&&this.files[0]){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    var FR = new FileReader();
    FR.onload = function(event) {
      var img = new Image();
      img.addEventListener("load", function() {
        ctx.drawImage(img, 0, 0,canvas.width, canvas.height);
        cPush();
      });
      img.src = event.target.result;
    };       
    FR.readAsDataURL( this.files[0] );
  }
}
