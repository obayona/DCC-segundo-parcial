var map;
var markers = [];
var waypoints=[];//puntos intermedios


var panelRuta = new PanelRuta();

var inicializar = function(){
	panelRuta.init();

  btnNuevo.addEventListener('click', function(evt) {
    console.log("***borrando")
    panelRuta.clean();
    initMap();
  });

  btnEmpezar.addEventListener('click', function(evt){
    
    var route = panelRuta.calculateRoute();
    console.log("ruta",route);

    enviarRuta(route);
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


function addMarker(latitude, longitude){

  waypoints.push({
    "lat":latitude,
    "lng":longitude
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
  
    waypoints = [];
	
   }, showErr);
}

window.addEventListener('load',inicializar,false);