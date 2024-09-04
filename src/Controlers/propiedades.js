const axios = require('axios');
const { normalizaProps } = require('../Helpers/normalizaProps');

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
        let newArray;

        if(limit !== 0 && offset !== 0){
            resp = await axios.get(`${url}&limit=${limit}&offset=${offset}&key=${apiKey}`);
        }else{
            resp = await axios.get(`${url}&key=${apiKey}`);
        }        
        //normalizo data q me llega
        newArray = normalizaProps(resp.data.objects);

        // Filtros
        //por operación
        if(operacion) { 
            newArray = newArray.filter(p => 
                p.operacion.some(item => item.operacion === operacion)
            );
        }
        //por tipo de propiedad
        if(tipo) {
            newArray = newArray.filter(p => p.tipo.nombre === tipo);
        }
        //por precios min y max
        if(precioMin && precioMax) {
            newArray = newArray.filter(p => 
                p.operacion.some(item => 
                    item.precios.some(precio => 
                        precio.precio >= Number(precioMin) && precio.precio <= Number(precioMax)
                    )
                )
            );
        }
        res.json(newArray);
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    getProperties
}