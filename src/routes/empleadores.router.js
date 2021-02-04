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

router.get('/data/dashboard', async (req, res) => {
    client.authorize(async (err,tokens) => {
        if(err){
            return res.json({
                err
            })
            
        }else{
            const data = await run(client,'G2:G')
            const data2 = await run(client,'S2:S')
            const data3 = await run(client, 'AK2:AK')
            console.log (getDataEstadistica('Pública',data),('Ingeniería en Sistemas Computacionales.',data2),('75% - 100%',data3))
            return res.json({
                estadistica1:[
                    ['Task', 'Hours per Day'],
                    ['Pública',getDataEstadistica('Pública',data)],
                    ['Privada',getDataEstadistica('Privada',data)],
                ],
                estadistica2:[
                ['Task', 'Hours per Day'],
                ['Ingeniería en Sistemas Computacionales.',getDataEstadistica('Ingeniería en Sistemas Computacionales.',data2)],
                ['Ingeniería en Informática.',getDataEstadistica('Ingeniería en Informática.',data2)],
                ['Ingeniería Ambiental.',getDataEstadistica('Ingeniería Ambiental.',data2)],
                ['Ingeniería Electrónica.',getDataEstadistica('Ingeniería Electrónica.',data2)],
                ['Licenciatura en Administración.',getDataEstadistica('Licenciatura en Administración.',data2)],
                ['Ingeniería Biomédica.',getDataEstadistica('Ingeniería Biomédica.',data2)],
                ['Arquitectura.',getDataEstadistica('Arquitectura.', data2)],
                ],
                estadistica3:[
                    ['x', 'Porcentaje del conocimiento de los egresados segun los empleadores'],
                    ['0% - 25%',getDataEstadistica('0% - 25%',data3)],
                    ['25% - 50%',getDataEstadistica('25% - 50%',data3)],
                    ['50% - 75%',getDataEstadistica('50% - 75%',data3)],
                    ['75% - 100%',getDataEstadistica('75% - 100%',data3)],

                ]
                
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