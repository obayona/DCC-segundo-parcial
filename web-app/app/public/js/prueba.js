var PanelRuta = function(){

  var points = [];
  var LENGTH_WIDTH = 20;
  var LENGTH_HEIGHT = 20;

  var getPoints = function(){
    return points;  
  }

  var inicializar = function(){
    points = []
    canvasRuta.addEventListener('click',function(event){
        var posX = event.offsetX; //posicion en X donde se dio click
        var posY = event.offsetY; //posicion en Y donde se dio click

        points.push({"x":posX,"y":posY});
        drawTriangle(posX, posY);
        if(points.length>1)
          drawPath();
    });
    drawScale();

  }

  var drawPath = function(){
    var ctx = canvasRuta.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = '#f00';
    var ini = points[points.length -1]
    var fin = points[points.length -2]
    ctx.moveTo(ini.x,ini.y);
    ctx.lineTo(fin.x, fin.y);
    ctx.stroke();
    ctx.closePath();
  }

  var drawTriangle = function(x, y){
    var ctx = canvasRuta.getContext('2d');
    if(points.length==1)
      ctx.fillStyle = '#0f0';
    else
      ctx.fillStyle = '#00f';    
    
      

    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x - 5, y - 10);
    ctx.lineTo(x + 5, y - 10);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

  }

  var drawScale = function(){
    var height = canvasRuta.height;
    var width = canvasRuta.width;
    var stepHeight = height/(LENGTH_HEIGHT + 2);
    var stepWidth = width/(LENGTH_WIDTH + 2); 
    console.log(stepWidth, stepHeight);
    var ctx = canvasRuta.getContext('2d');
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
