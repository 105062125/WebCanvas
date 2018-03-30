class Equilateral extends Shape {
  constructor(startPoint, thick, color){
    super(startPoint, thick, color);
  }

  draw(ctx) {
    if (this.startPoint == null || this.lastPoint == null ){
      return;
    }
    var xF = (2*this.lastPoint.x + this.startPoint.x)/3;
		var yF = (2*this.lastPoint.y + this.startPoint.y)/3;
    var x1 = (this.startPoint.x - xF)*Math.cos(2 * Math.PI / 3)
              - (this.startPoint.y - yF)*Math.sin(2 * Math.PI / 3)
              + xF;
		var x2 = (this.startPoint.x - xF)*Math.cos(-2 * Math.PI / 3)
              - (this.startPoint.y - yF)*Math.sin(-2 * Math.PI / 3)
              + xF;
		var y1 = (this.startPoint.x - xF)*Math.sin(2 * Math.PI / 3)
              + (this.startPoint.y - yF)*Math.cos(2 * Math.PI / 3)
              + yF;
		var y2 = (this.startPoint.x - xF)*Math.sin(-2 * Math.PI / 3)
              + (this.startPoint.y-yF)*Math.cos(-2 * Math.PI / 3)
              + yF;
		ctx.beginPath();
		ctx.moveTo(this.startPoint.x, this.startPoint.y);
		ctx.lineTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineTo(this.startPoint.x, this.startPoint.y);
		
    ctx.fillStyle = this.color;
    ctx.lineWidth = this.thick;
    ctx.closePath();
    ctx.fill();
  }
}
