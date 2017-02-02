var controller = require('./controller/controller');

var express=require('express');
var router=express.Router();


router.get('/', controller.getIndex);
router.post('/enviarRuta', controller.enviarRuta);
router.post('/enviarMensaje', controller.enviarMensaje);

module.exports = router;