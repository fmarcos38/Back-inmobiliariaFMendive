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
        let resp ;
        if(limit && offset){
            resp = await axios.get(`${url}&limit=${limit}&offset=${offset}&key=${apiKey}`);
        }else{
            resp = await axios.get(`${url}&key=${apiKey}`);
        }
        

        if(!resp.data.objects){
            return res.send("No se encontraron propiedades")
        }

        res.json(resp.data);

    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    getProperties
}