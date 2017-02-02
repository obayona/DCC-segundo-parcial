var map;
var markers = [];
var start = null;
var end = null;
var waypoints=[];//puntos intermedios
var directionsService;
var directionsDisplay;
var firstMarker;

var inicializar = function(){
	btnNuevo.addEventListener('click', function(evt) {
    initMap();
  });

  btnEmpezar.addEventListener('click', function(evt){
		var ruta=directionsDisplay.getDirections().routes[0];
    var leg=ruta.legs[0];

    var puntos = [];

    var end_route=leg.end_location;
    var start_route=leg.start_location;
    var waypoints_route=leg.via_waypoints;
    puntos.push({'lat':start_route.lat(),'lng':start_route.lng()});
    for(var i=0;i<waypoints_route.length;i++){
      var middle_route=waypoints_route[i];
      puntos.push({'lat':middle_route.lat(),'lng':middle_route.lng()});
    }
    puntos.push({'lat':end_route.lat(),'lng':end_route.lng()});
    enviarRuta(puntos);

	});
	btnDetener.addEventListener('click', function(evt){
		console.log("Detener");
	});
	btnReanudar.addEventListener('click', function(evt){
		console.log("Reanudar");
	});
	btnRegresar.addEventListener('click', function(evt){
		console.log("Regresar");
	});



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
  if(start==null){
    start=event.latLng;
    firstMarker=new google.maps.Marker({
      position: start,
      map:map
    });
    return;
  }else if(end==null){
    firstMarker.setMap(null);
    firstMarker=null;
    end=event.latLng;
  }else{
    waypoints.push({
      location:end,
      stopover:false
    });
    end=event.latLng;
  }

  var request={
    origin:start,
    destination:end,
    waypoints:waypoints,
    optimizeWaypoints:true,
    travelMode:google.maps.TravelMode.WALKING
  }
  directionsService.route(request,function(response,status){
    if(status==google.maps.DirectionsStatus.OK){
      directionsDisplay.setDirections(response);
    }else{
      console.log(status);
    }
  });
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
  directionsDisplay=new google.maps.DirectionsRenderer(rendererOptions);
  directionsDisplay.setMap(map);

    map.addListener('click', addMarker);
    start = null;
    end = null;
    waypoints = [];

    
  	
	
   }, showErr);
}

window.addEventListener('load',inicializar,false);