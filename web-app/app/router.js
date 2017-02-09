var controller = require('./controller/controller');

var express=require('express');
var router=express.Router();


router.get('/', controller.getIndex);
router.get('/p', controller.getPrueba);
router.post('/enviarRuta', controller.enviarRuta);
router.post('/enviarMensaje', controller.enviarMensaje);

exports.setPort = function(port){
	controller.setPort(port);
}

exports.getRouter = function(){
	return router;
}