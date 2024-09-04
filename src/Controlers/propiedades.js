const axios = require('axios');

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
    try {
        const {limit, offset} = req.query; 
        let resp;

        if(limit && offset){
            resp = await axios.get(`${url}&limit=${limit}&offset=${offset}&key=${apiKey}`);
        }else{
            resp = await axios.get(`${url}&key=${apiKey}`);
        }
        
        //normalizo data q me llega
        const newArray = resp.data.objects.map(p => {
            const newProp = {
                id: p.id,
                codigoReferencia: p.reference_code,
                direccion: p.real_address,
                descripcion: p.description,
                disposicion: p.disposition,
                expensas: p.expenses,
                geoLat: p.geo_lat,
                geoLong: p.geo_long,
                cantPisos: p.floors_amount,
                rentaTemporaria: p.has_temporary_rent,
                destacadaEnWeb: p.is_starred_on_web,
                ubicacion: {
                    id: p.location.id,
                    ubicacion: p.location.full_location,
                    barrio: p.location.name,
                }, 
                operacion: p.operations.map(item => {
                    const newOperacion = {
                        id: item.id,
                        operacion: item.operation_type,
                        precios: item.prices.map(item => {
                            const newPrecio = {
                                moneda: item.currency,
                                precio: item.price,
                            }
                            return newPrecio;
                        }),
                    };
                    return newOperacion;
                }),
                imagenes: p.photos.map(p => {
                    const newImg = {
                        esPortada: p.is_front_cover,
                        orden: p.order,
                        original: p.original,
                        pequeña: p.thumb
                    }
                    return newImg
                }),
                productor: {
                    tel: p.producer.cellphone,
                    email: p.producer.email,
                    nombre: p.producer.name,
                    foto: p.producer.picture,
                },
                tituloPublicacion: p.publication_title,
                supTechada: p.roofed_surface,
                ambientes: p.room_amount,
                supSemiCub: p.semiroofed_surface,
                dormitorios: p.suite_amount,
                unidadMedida: p.surface_measurement,
                bañoSuit: p.toilet_amount,
                supTotal: p.total_surface,
                tipo: {
                    codigo: p.type.code,
                    id: p.type.id,
                    nombre: p.type.name,
                },
                supDescubierta: p.unroofed_surface,
                servicios: p.tags.map(s => {
                    const newServ = {
                        id: s.id,
                        nombre: s.name,
                        tipo: s.type
                    }
                    return newServ;
                }),
            }
            return newProp;
        });

        if(!resp.data.objects){
            return res.send("No se encontraron propiedades")
        }

        res.json(newArray);

    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    getProperties
}