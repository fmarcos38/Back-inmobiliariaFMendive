const express = require('express');
const { getProperties } = require('../Controlers/propiedades');

const router = express.Router();

router.get('/', getProperties);


module.exports = router; 