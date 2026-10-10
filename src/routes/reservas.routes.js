const router = require('express').Router();
const controller = require('../controllers/reservas.controllers');
router.get('/', controller.listar);
router.get('/:id', controller.detalle);
router.post('/', controller.crear);
router.put('/:codigo/validar', controller.validar);
module.exports = router;
