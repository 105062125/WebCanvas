//***********
//***TOOLS***
//***********
function handleToolDown(e){
  curX = e.clientX - canvas.offsetLeft - 17 ;
  curY = e.clientY - canvas.offsetTop  + 37;//height of icon

  flagTool = true;
  preX = curX;
  preY = curY;

  var imgData = ctx.getImageData(curX, curY, 1, 1).data;
  if (currentTool == 'colorpicker'){
    curColor = RGBtoHex(imgData);
    curColorBox.style.background = curColor;
  }
  if (currentTool == 'fillcolor'){
    var originColor = imgData;
    var replaceColor = HextoRGB(curColor);
    floodFill(curX, curY, originColor, replaceColor);
  }
  if (currentTool == 'eraser'){
    ctx.globalCompositeOperation = 'destination-out';
  }
  if(currentTool=='text'){
    canvas.onclick=function(e){
      if(hasInput)return;
      addInput(e.clientX,e.clientY);
    }
  }

}

function handleToolUp(e){
  cPush();
  flagTool = false;
  preX = -1;
  preY = -1;
  if (currentTool == 'eraser'){
    ctx.globalCompositeOperation = 'source-over';
  }
}

function handleToolMove(e){
  curX = e.clientX - canvas.offsetLeft -17 ;
  curY = e.clientY - canvas.offsetTop + 37 ;//height of icon

  if (currentTool == 'pencil' && flagTool || currentTool == 'eraser' && flagTool){
    ctx.beginPath();
    ctx.lineWidth = curWidth;
    ctx.strokeStyle = curColor;
    ctx.moveTo(preX, preY);
    ctx.lineTo(curX, curY);
    ctx.stroke();

    preX = curX;
    preY = curY;
  }
}

function RGBtoHex(rgb){
  if (rgb[0] == '0' && rgb[1] == '0' && rgb[2] == '0' && rgb[3] == 0)
    return '#FFFFFF';
  return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

function HextoRGB(hex) {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b].join();
}

function isSameColor(src, des){
  return src[0] == des[0] && src[1] == des[1] && src[2] == des[2] && src[3] == des[3];
}

function floodFillVertical(x, y, color, value, stack){
  var leftFlag = true, rightFlag = true;
  while (y + value > 0 && y + value < w && isSameColor(ctx.getImageData(x, y + value, 1, 1).data, color)){
    y += value;
    //Compare left
    if (x - 2 > 0 && isSameColor(ctx.getImageData(x - 2, y, 1, 1).data, color)){
      if (leftFlag){
        leftFlag = false;
        stack.push([x - 2, y]);
      }
    }
    else
      leftFlag = true;
    //Compare right
    if (x + 1 < w && isSameColor(ctx.getImageData(x + 1, y, 1, 1).data, color)){
      if (rightFlag){
        rightFlag = false;
        stack.push([x + 1, y]);
      }
    }
    else
      rightFlag = true;
  }
  return y;
}

function floodFill(pointX, pointY, origin, replace){
  var stack = [[pointX, pointY]];

  while (stack.length){
    var tmp = stack.pop();
    var x = tmp[0];
    var y = tmp[1];

    //Up
    var top = floodFillVertical(x, y, origin, -1, stack);
    //Down
    var bottom = floodFillVertical(x, y, origin, 1, stack);

    //Color
    ctx.beginPath();
    ctx.strokeStyle = curColor;
    ctx.lineWidth = 2;
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
  }
}
function addInput(x, y) {
  
  var input = document.createElement('input');
  
  input.type = 'text';
  input.style.position = 'fixed';
  input.placeholder = '輸入文字';
  input.style.left = (x - 4) + 'px';
  input.style.top = (y - 4) + 'px';
  font = curWidth * 8 + 'px ' + font_name;
  input.style.font = font;
  input.onkeydown = handleEnter;
  
  document.body.appendChild(input);

  input.focus();
  
  hasInput = true;
}

function handleEnter(e) {
  var keyCode = e.keyCode;
  if (keyCode === 13) {
      drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
      document.body.removeChild(this);
      hasInput = false;
  }
}

function drawText(txt, x, y) {
  ctx.fillStyle = curColor;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.font = font;
  ctx.fillText(txt, x - 400, y -120);
  cPush();
  
}
function change_font(f) {
  if (f == 0) {
    font_name = 'Arial';
  } else if (f == 1) {
    font_name = 'Verdana';
  } else if (f == 2) {
    font_name = 'Courier New';
  } else if (f == 3) {
    font_name = 'serif';
  } else if (f == 4) {
    font_name = 'sans-serif';
  }
  else if (f == 5) {
    font_name = '微軟正黑體';
  }
  else if (f == 6) {
    font_name = '新細明體';
  }
  else if (f == 7) {
    font_name = '標楷體';
  }
}
//***********
//***SHAPE***
//***********
function handleShapeDown(e){
  curX = e.clientX - canvas.offsetLeft;
  curY = e.clientY - canvas.offsetTop;

  flagShape = true;

  canvasTmp.style.display = 'block';
  createShape(new Point(curX, curY));
}

function handleShapeUp(e){

  flagShape = false;
  cPush();
  if (currentShape == 'polygon'){
    currentShapeObj.addNewLine(ctxTmp);
    return;
  }
  else if (currentShape == 'curve' && currentShapeObj.currentMode() < 1){
    console.log(currentShapeObj.currentMode());
    return;
  }


  currentShapeObj.draw(ctx);
  currentShapeObj = null;
}

function handleShapeMove(e){
  curX = e.clientX - canvas.offsetLeft;
  curY = e.clientY - canvas.offsetTop + 18;//height of icon

  if (flagShape){
    ctxTmp.clearRect(0, 0, w, h);
    ctxTmp.beginPath();
    if (currentShape == 'curve')
    {
      currentShapeObj.setMidPoint(new Point(curX,curY));
    }else
      currentShapeObj.setLastpoint(new Point(curX, curY));
    currentShapeObj.draw(ctxTmp);

  }
}

function createShape(point){
  switch (currentShape) {
    case 'ellipse':{
      currentShapeObj = new Ellipse(point, curWidth, curColor);
      break;
    }
    case 'rectangle':{
      currentShapeObj = new Rectangle(point, curWidth, curColor);
      break;
    }
    case 'equilateral':{
      currentShapeObj = new Equilateral(point, curWidth, curColor);
      break;
    }
    default:
  }
}
