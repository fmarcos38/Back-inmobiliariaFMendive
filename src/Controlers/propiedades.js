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

    try {
        let resp;
        let total; //total = resp.data.meta.total_count;
        let propiedades;

        resp = await axios.get(`${url}&key=${apiKey}`);        
        //normalizo data q me llega
        
        propiedades = normalizaProps(resp.data.objects);//puedo tener 20 props como max

        // Filtros
        //por operación
        if(operacion) { 
            propiedades = propiedades.filter(p => 
                p.operacion.some(item => item.operacion === operacion)
            );
        }
        //por tipo de propiedad
        if(tipo !== 'todas') {
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
        
        total = propiedades.length;
        
        let propsPaginadas = [];
        let start = Number(offset); // Índice de inicio basado en el offset
        let end = start + Number(limit); // Define el rango correcto hasta limit

        // Asegúrate de que no se exceda el tamaño de las propiedades
        for (let i = start; i < end && i < propiedades.length; i++) {
            propsPaginadas.push(propiedades[i]);
        }

        res.json({
            total,
            propiedades: propsPaginadas,
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