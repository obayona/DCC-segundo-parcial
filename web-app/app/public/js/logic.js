var map;
var markers = [];
var waypoints=[];//puntos intermedios

var estado = {
  INICIAL:0,
  EMPEZADO:1,
  DETENIDO:2,
  REGRESANDO:3
};

//#FE2E2E

var inicializar = function(){
	btnNuevo.addEventListener('click', function(evt) {
    initMap();
  });

  btnEmpezar.addEventListener('click', function(evt){
    enviarRuta(waypoints);
	});
	btnDetener.addEventListener('click', function(evt){
    enviarMensaje("DETENER");
	});
	btnReanudar.addEventListener('click', function(evt){
    enviarMensaje("REANUDAR");
	});
	btnRegresar.addEventListener('click', function(evt){
		enviarMensaje("REGRESAR");
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
    console.log("Enviado");
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
    console.log("Enviado");
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


function addMarker(event){

  waypoints.push({
    "lat":event.latLng.lat(),
    "lng":event.latLng.lng()
  });
  var marker = new google.maps.Marker({
      position: event.latLng,
      map:map
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
  
    map.addListener('click', addMarker);
    waypoints = [];
	
   }, showErr);
}

window.addEventListener('load',inicializar,false);