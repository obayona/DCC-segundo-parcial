var PanelRuta = function(){

  var points = [];
  var LENGTH_WIDTH = 5;
  var LENGTH_HEIGHT = 5;
  var stepHeight;
  var stepWidth;


  this.calculateRoute = function(){
    var route  = [];
    var lastGyroAngle = 0;
    for (var i = 1; i< points.length; i++){
      var x0 = points[i-1].x;
      var y0 = points[i-1].y;
      var x1 = points[i].x;
      var y1 = points[i].y;
      var dx = (x1-x0)/stepWidth;
      var dy = (y0-y1)/stepHeight;

      var distance = Math.sqrt(dx*dx + dy*dy);
      var angle = 0;
      if(dx!=0){
        angle = Math.atan(dy/dx);
        angle = angle*180/Math.PI;  
      }
      
      var gyroAngle = remapAngle(angle, dx, dy);
      var correctedGyroAngle = correctGyroAngle(gyroAngle, lastGyroAngle)
      route.push({"d":distance, "a": correctedGyroAngle});
      lastGyroAngle = gyroAngle;
    }
    return route;
  }

  this.clean=function(){
    points = [];
    var ctx = canvasRuta.getContext('2d');
    ctx.clearRect(0, 0, canvasRuta.width, canvasRuta.height);
    drawScale();
  }

  var remapAngle = function(angle, dx, dy){

    if(dx >0 && dy > 0 ){ //1er cuadrante
      return 90 - angle;
    }
    if(dx < 0 && dy > 0 ){ //segundo cuandrante
      return -90 - angle;
    }
    if(dx <0 && dy < 0 ){ //tercer cuadrante
      return  -90 - angle;
    }
    if(dx >0 && dy < 0 ){//cuarto cuadrante
      return 90 - angle
    }

  }

  var correctGyroAngle = function(currentAngle, lastAngle){
      if(lastAngle==0){
        return currentAngle;
      }

      var giro =  -1*lastAngle + currentAngle;
      var complemento = 0;
      if(giro < 0)
        complemento = 360 - Math.abs(giro);
      if(giro>=0)
        complemento = giro - 360;

      return minAbsolute(giro, complemento);
      


  }

  var minAbsolute= function(a,b){
    a_ = Math.abs(a);
    b_ = Math.abs(b);

    if(a_<b_){
      return a;
    }
    else{
      return b
    }

  }

  this.init = function(){
    points = [];
    var ctx = canvasRuta.getContext('2d');
    ctx.clearRect(0, 0, canvasRuta.width, canvasRuta.height);
    drawScale();

    canvasRuta.addEventListener('click',function(event){
        var posX = event.offsetX; //posicion en X donde se dio click
        var posY = event.offsetY; //posicion en Y donde se dio click

        points.push({"x":posX,"y":posY});
        drawTriangle(posX, posY);
        if(points.length>1)
          drawPath();
    });
    

  }

  var drawPath = function(){
    var ctx = canvasRuta.getContext('2d');
    
    var ini = points[points.length -1]
    var fin = points[points.length -2]
    ctx.beginPath();
    ctx.strokeStyle = '#f00';
    ctx.moveTo(ini.x,ini.y);
    ctx.lineTo(fin.x, fin.y);
    ctx.stroke();
    ctx.closePath();
  }

  var drawTriangle = function(x, y){
    var ctx = canvasRuta.getContext('2d');
    ctx.beginPath();
    console.log("*****", points.length)
    if(points.length==1)
      ctx.fillStyle = '#0f0';
    else
      ctx.fillStyle = '#00f';    
      
    ctx.moveTo(x,y);
    ctx.lineTo(x - 5, y - 10);
    ctx.lineTo(x + 5, y - 10);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();


  }

  var drawScale = function(){
    var height = canvasRuta.height;
    var width = canvasRuta.width;
    stepHeight = height/(LENGTH_HEIGHT + 2);
    stepWidth = width/(LENGTH_WIDTH + 2); 
    var ctx = canvasRuta.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    for(var i =0; i< LENGTH_HEIGHT; i++){
      var column = stepHeight*(i+1);
      ctx.moveTo(0,column);
      ctx.lineTo(10,column);
      ctx.stroke();
      ctx.font="20px Georgia";
      ctx.fillText((LENGTH_HEIGHT - i),10,column);
    }
    ctx.closePath();

    ctx.beginPath();
    for(var i =0; i< LENGTH_WIDTH; i++){
      var row = stepWidth*(i+1);
      ctx.moveTo(row, height);
      ctx.lineTo(row, height - 10);
      ctx.stroke();
      ctx.save();
      ctx.rotate(-1*Math.PI /2);
      ctx.font="20px Georgia";
      ctx.fillText(i + 1, 10 - height, row);
      ctx.restore();
    }
    ctx.closePath();

  }

}
