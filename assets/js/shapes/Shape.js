class Shape{

  constructor(startPoint, thick, color){
    this.startPoint = startPoint;
    this.lastPoint = startPoint;
    this.thick = thick;
    this.color = color;
  }
  
  setLastpoint(lastpoint){
    this.lastPoint = lastpoint;
  }

  draw(ctx) {

  }
}