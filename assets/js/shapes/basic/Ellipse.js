class Ellipse extends Shape{
  constructor(startpoint, thick, color){
    super(startpoint, thick, color);
  }
  draw(ctx){
    ctx.beginPath();
    var centerx = (1/2)*(this.lastPoint.x + this.startPoint.x);
    var centery = (1/2)*(this.lastPoint.y + this.startPoint.y);
    var radiusy = Math.abs((1/2)*(this.lastPoint.y - this.startPoint.y));
    var radiusx = Math.abs((1/2)*(this.lastPoint.x - this.startPoint.x));
    ctx.ellipse(centerx, centery, radiusx, radiusy, 0, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.lineWidth = this.thick;
    ctx.fill();
    ctx.closePath();
  }
}
