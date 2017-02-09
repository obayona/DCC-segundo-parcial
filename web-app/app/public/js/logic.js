var map;
var waypoints=[];//puntos intermedios

var socket = null;

var panelRuta = new PanelRuta();

var inicializar = function(){
	panelRuta.init();

  socket = io.connect();
  socket.on('currentPosition', function (data) {
    pos = data.split(";");
    latitude = parseFloat(pos[1]);
    longitude = parseFloat(pos[0]);
    console.log("recibo esto",latitude, longitude);
    addMarker(latitude, longitude);
    
  });

  btnNuevo.addEventListener('click', function(evt) {
    panelRuta.clean();
    initMap();
  });

  btnEmpezar.addEventListener('click', function(evt){
    
    var route = panelRuta.calculateRoute();
    console.log("ruta",route);

    enviarRuta(route);
	});

  btnDetener.addEventListener('click', function(evt){
    enviarMensaje("DETENER");
  }); 


}


function enviarMensaje(mensaje){
  var request = new XMLHttpRequest();
  request.open("POST","/enviarMensaje",true);
  request.setRequestHeader("Content-Type", "application/json");
  request.addEventListener('load',function(event){
    if(event.target.status!=200){
      console.log("Error");
    }    
  },false);
  request.send(JSON.stringify({"mensaje":mensaje}));
}

function enviarRuta(puntos){
  var request = new XMLHttpRequest();
  request.open("POST","/enviarRuta",true);
  request.setRequestHeader("Content-Type", "application/json");
  request.addEventListener('load',function(event){
    if(event.target.status!=200){
      console.log("Error");
    }    
  },false);
  request.send(JSON.stringify({"puntos":puntos}));

}

function showErr(error){
	switch(error.code){
		case error.PERMISSION_DENIED:
			demo.innerHTML="El requerimiento ha sido negado por el usuario";
			break;
		case error.POSITION_UNAVAILABLE:
			demo.innerHTML="Informacion de localizacion no disponible";
			break;
		case error.TIMEOUT:
			demo.innerHTML="Tiempo de espera expirado";
			break;
		case error.UNKNOWN_ERROR:
			demo.innerHTML="Error desonocido";
			break;
		defaulf:
			demo.innerHTML="Correcto";
	}
}


function addMarker(latitude, longitude){

  waypoints.push({
    "lat":latitude,
    "lng":longitude
  });


  if(waypoints.length<2){
    return;
  }

  var Path = new google.maps.Polyline({
    path: waypoints,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  Path.setMap(map);

}




function initMap() {

  navigator.geolocation.getCurrentPosition(function (position){
	
  	var mapProp = {
  	 center:new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
  	 zoom:20,
  	 scrollwheel: true,
  	 mapTypeId:google.maps.MapTypeId.ROADMAP
  	};
  	map=new google.maps.Map(document.getElementById("map_container"),mapProp);

    directionsService = new google.maps.DirectionsService();
    var rendererOptions = {
      draggable: true,
      suppressMarkers:false,
      preserveViewport:true,
      markerOptions:{
        draggable: true
      }
    };
  
    waypoints = [];
	
   }, showErr);
}

window.addEventListener('load',inicializar,false);