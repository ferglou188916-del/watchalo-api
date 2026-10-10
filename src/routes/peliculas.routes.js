const router = require('express').Router();
const controller = require('../controllers/peliculas.controllers');
router.get('/', controller.listar);
router.get('/:id', controller.detalle);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);
module.exports = router;
