const express = require('express');
const router = express.Router();
const {abrirFormulario,leerCsv} = require('../descargaCSV')
const getDataEstadistica = (filtro,data) => data.reduce((acm,el) => isExist(filtro,el[0]) ? acm += 1 :acm,0);

const { google } = require('googleapis');
const keys = require('../keys.json')
const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);



async function run(cl,r){
    const gsapi = google.sheets({
        version:'v4',
        auth:cl
    });

    const opt = {
        spreadsheetId:'19lpcSK-Q4hiBy-CeS9_gj6KREo_w3ycKv1-R_0xXbYQ',
        range:r
    };

    let data = await gsapi.spreadsheets.values.get(opt)

    return data.data.values
}
function isExist(word,el) {
    if(el === word){
        return true
    }
    return false
}

router.get('/data', async (req, res) => {
    client.authorize(async (err,tokens) => {
        if(err){
            return res.json({
                err
            })
            
        }else{
            const data = await run(client,'A1:AM')
            return res.json({
                preguntas:data
            })
        }
    
    })

  
});
router.get('/descargar/data', async (req, res) => {
    try {
        const data = await abrirFormulario("empleadores")
        res.json({
            preguntas:data[0]
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
  
});
module.exports = router;