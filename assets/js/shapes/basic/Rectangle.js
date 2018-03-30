class Rectangle extends Shape{

  constructor(startPoint, thick, color){
    super(startPoint, thick, color);
  }


  draw(ctx){
    // ctx.clearRect(0,0,w,h);
    if (this.startPoint == null || this.lastPoint == null ){
      return;
    }
    var width = Math.abs(this.startPoint.x - this.lastPoint.x);
    var height = Math.abs(this.startPoint.y - this.lastPoint.y);
    var xcore = this.startPoint.x < this.lastPoint.x ? this.startPoint.x : this.lastPoint.x
    var ycore = this.startPoint.y < this.lastPoint.y ? this.startPoint.y : this.lastPoint.y
    ctx.rect(xcore, ycore, width, height);
    ctx.fillStyle = this.color;
    ctx.lineWidth = this.thick;
    ctx.fill();
  }
}
