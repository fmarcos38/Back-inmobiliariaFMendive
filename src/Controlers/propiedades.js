const axios = require('axios');
const { normalizaProps, normalizoPropiedad } = require('../Helpers/normalizaProps');

/* 

"meta": {
    "limit": 20,
    "next": null,
    "offset": 0,
    "previous": null,
    "total_count": 5
},

*/

const apiKey = process.env.API_KEY;
const url = process.env.URL;

//trae propiedades
const getProperties = async(req, res) => { 
    const {limit, offset, operacion, tipo, precioMin, precioMax} = req.query; 
console.log("data:", req.query);
    try {
        let resp;
        let total;
        let propiedades;

        if(Number(limit) !== 0 || Number(offset) !== 0){
            resp = await axios.get(`${url}&limit=${limit}&offset=${offset}&key=${apiKey}`);
        }else{
            resp = await axios.get(`${url}&key=${apiKey}`);
        }        
        //normalizo data q me llega
        total = resp.data.meta.total_count;        
        propiedades = normalizaProps(resp.data.objects); 

        // Filtros
        //por operación
        if(operacion) { 
            propiedades = propiedades.filter(p => 
                p.operacion.some(item => item.operacion === operacion)
            );
        }
        //por tipo de propiedad
        if(tipo) {
            propiedades = propiedades.filter(p => p.tipo.nombre === tipo);
        }
        //por precios min y max
        if(precioMin && precioMax) {
            propiedades = propiedades.filter(p => 
                p.operacion.some(item => 
                    item.precios.some(precio => 
                        precio.precio >= Number(precioMin) && precio.precio <= Number(precioMax)
                    )
                )
            );
        }

        res.json({
            total,
            propiedades
        });
    } catch (error) {
        console.log(error);
    }
};

//detalle propiedad por ID
const getProperty = async(req, res) => {
    const {id} = req.params;
    try {
        let resp;
        resp = await axios.get(`https://www.tokkobroker.com/api/v1/property/${id}?lang=es_ar&format=json&key=${apiKey}`);
        //normalizo data
        resp = normalizoPropiedad(resp.data)

        return res.json(resp);
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    getProperties,
    getProperty,
}