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
            const data4 = await run(client,'I2:I')
            const data = await run(client,'G2:G')
            const data2 = await run(client,'S2:S')
            const data3 = await run(client, 'AK2:AK')
            const data5 = await run(client,'AL2:AL')
            const data6 =await run(client,'E2:E')
            const data7 = await run(client,'F2:F')
            const data8 = await run(client,'B2:B')
            const data9= await run(client,'C2:C')
            const data10= await run(client,'H2:H')
            
            
            console.log (getDataEstadistica('Pública',data),('Ingeniería en Sistemas Computacionales.',data2),('75% - 100%',data3),('Agro-Industrial',data4),('Alto',data5),('Pedro Andrade',data6),('5513148151',data7,'maom940907@gmail.com',data8),('TESI Vinculación',data9),('Mediana (de 101 a 500)',data10))
            return res.json({
                estadistica6:data6.flat(),
                estadistica7:data7.flat(),
                estadistica8:data8.flat(),   
                estadistica9:data9.flat(),     
                           
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
                ],
                estadistica4:[
                    ['Task', 'Hours per Day'],
                    ['Agro-Industrial',getDataEstadistica('Agro-Industrial',data4)],
                    ['Silvicultura',getDataEstadistica('Silvicultura',data4)],
                    ['Pesca y Acuacultura',getDataEstadistica('Pesca y Acuacultura',data4)],
                    ['Minería',getDataEstadistica('Minería',data4)],
                    ['Alimentos, Bebidas y Tabaco',getDataEstadistica('Alimentos, Bebidas y Tabaco',data4)],
                    ['Textiles, Vestido y Cuero',getDataEstadistica('Textiles, Vestido y Cuero',data4)],
                    ['Madera y sus productos',getDataEstadistica('Madera y sus productos',data4)],
                    ['Papel, Imprenta y Editoriales',getDataEstadistica('Papel, Imprenta y Editoriales',data4)],
                    ['Química',getDataEstadistica('Química',data4)],
                    ['Caucho y Plástico',getDataEstadistica('Caucho y Plástico',data4)],
                    ['Minerales no metálicos',getDataEstadistica('Minerales no metálicos',data4)],
                    ['Industrias metálicas básicas',getDataEstadistica('Industrias metálicas básicas',data4)],
                    ['Productos metálicos, maquinaria y equipo',getDataEstadistica('Productos metálicos, maquinaria y equipo',data4)],
                    ['Construcción',getDataEstadistica('Construcción',data4)],
                    ['Electricidad, gas y agua',getDataEstadistica('Electricidad, gas y agua',data4)],
                    ['Transporte, almacenaje y comunicaciones',getDataEstadistica('Transporte, almacenaje y comunicaciones',data4)],
                    ['Servicios financieros, seguros, actividades inmobiliarias y de alquiler',getDataEstadistica('Servicios financieros, seguros, actividades inmobiliarias y de alquiler',data4)],
                    ['Educación',getDataEstadistica('Educación',data4)],
                    ['Servicios profesionales',getDataEstadistica('Servicios profesionales',data4)],
                    ['Servicios de tecnólogias de la información',getDataEstadistica('Servicios de tecnólogias de la información',data4)],
                    ['Otra',getDataEstadistica('Otra',data4)],
                ],
                estadistica5:[
                    ['Task', 'Nivel de valores de los egresados'],
                    ['Alto',getDataEstadistica('Alto',data5)],
                    ['Regular',getDataEstadistica('Regular',data5)],
                    ['Bajo',getDataEstadistica('Bajo',data5)],
                    ['Muy bajo',getDataEstadistica('Muy bajo',data5)],
                    ],
                   
                    estadistica10:[
                        ['Task', 'Tamaño de la empresa'],
                    ['Mediana (de 101 a 500)',getDataEstadistica('Mediana (de 101 a 500)',data10)],
                    ['Microempresa (de 1 a 30)',getDataEstadistica('Microempresa (de 1 a 30)',data10)],
                    ['Pequeña (de 31 a 100)',getDataEstadistica('Pequeña (de 31 a 100)',data10)],
                    ['Grande (Más de 500)',getDataEstadistica('Grande (Más de 500)',data10)],
                    ],
                       
                            
                   
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
router.get('/respuestaemp/:p', async (req, res) => {

    client.authorize(async (err,tokens) => {
        if(err){
            return res.json({
                err
            })
            
        }else{
            console.log(getRange(req.params).trim())
            const data = await run(client,getRange(req.params).trim())
            return res.json({
                data:data
            })
        }
    
    })

  
});
router.get('/datos-egresados/:id', async (req, res) => {
    const correos = await run(client,'B2:B')
    const nombre = await run(client,'E2:E')
    const tel = await run(client,'F2:F')
    const carrera = await run(client,'S2:S')
    client.authorize(async (err,tokens) => {
        if(err){
            return res.json({
                err
            })
            
        }else{
            return res.json({
                correos:correos[req.params.id],
                nombre:nombre[req.params.id],
                tel:tel[req.params.id],
                matricula:matricula[req.params.id],
                carrera:carrera[req.params.id],

            })
        }
    
    })

  
});
module.exports = router;