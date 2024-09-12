const express = require('express');
const { getProperties, getProperty } = require('../Controlers/propiedades');

const router = express.Router();

//trae propiedades pagina de a 20
router.get('/', getProperties);

//trae prop para detalle por ID
router.get('/:id', getProperty);



module.exports = router; 