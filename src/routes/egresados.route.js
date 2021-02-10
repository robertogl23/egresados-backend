const express = require('express');
const router = express.Router();
const fs = require("fs"); // filesystem
const csv = require("csv-parse"); // Encargado de parsear
const { google } = require('googleapis');
const keys = require('../keys.json')
const {
    abrirFormulario,
    leerCsv
} = require('../descargaCSV');
const getRange = require('../helpers/setRange');


const getDataEstadistica = (filtro,data) => data.reduce((acm,el) => isExist(filtro,el[0]) ? acm += 1 :acm,0);
const getGeneEgresados = (data) => data.reduce((acm,el) =>getGeneracion(el),0);

const getGeneracion = (str) => {
    console.log(`${str[0]}${str[1]}${str[2]}${str[3]}`)
    return `${str[0]}${str[1]}${str[2]}${str[3]}`

}

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
        spreadsheetId:'104tWFzZAT3kIR8E9iYeg6mbKtC_uQbVlUB0Pe-pH4OA',
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


router.get('/preguntas', async (req, res) => {

    client.authorize(async (err,tokens) => {
        if(err){
            return res.json({
                err
            })
            
        }else{
            const data = await run(client,'A1:DX')
            return res.json({
                preguntas:data[0]
            })
        }
    
    })
    

  
});
router.get('/data', async (req, res) => {

    client.authorize(async (err,tokens) => {
        if(err){
            return res.json({
                err
            })
            
        }else{
            const data = await run(client,'A1:GT')
            const data2 = await run(client,'A5:GT')
            
            return res.json({
                preguntas:data[0],
                respuestas:data2
            })
        }
    
    })
  
});
router.get('/perfil', async (req, res) => {

    client.authorize(async (err,tokens) => {
        if(err){
            return res.json({
                err
            })
            
        }else{
            const data = await run(client,'B5:B')
            const data2 = await run(client,'C5:C')
            const data3 = await run(client,'D5:D')
            const data4 = await run(client,'E5:E')
            const data5 = await run(client,'F5:F')
            const data6 = await run(client,'G5:G')
            const data7 = await run(client,'H5:H')
            
            return res.json({
                correos:data.flat(),
                nombres:data2,
                matriculas:data3,
                fechasNacimientos:data4,
                curp:data5,
                sexo:data6,
                estadoCivil:data7,
            })
        }
    
    })
    

  
});
router.get('/data/dashboard', async (req, res) => {

    client.authorize(async (err,tokens) => {
        if(err){
            return res.json({
                err
            })
            
        }else{
            const data2 = await run(client,'L2:L')
            const data3 = await run(client,'P2:P')
            const data4 = await run(client,'Q2:Q')
            console.log(data4)
            const fechasOrdenadas = Array.from(new Set(data4.flat())).sort()
            const titulacionDate = () => {
                let data = [ ["x", "Titulados"]]
                fechasOrdenadas.map(e => data.push([e,getDataEstadistica(e,data4)]))
                return data
            } 


            console.log(titulacionDate())
            return res.json({
                carreras:[
                    ["Name", "Carreras Egresados"],
                    ["Ing. Sistemas",getDataEstadistica("Ing. Sistemas",data2)],
                    ["Ing. Informática",getDataEstadistica("Ing. Informática",data2)],
                    ["Ing. Ambiental",getDataEstadistica("Ing. Ambiental",data2)],
                    ["Ing. Biomédica",getDataEstadistica("Ing. Biomédica",data2)],
                    ["Ing. Electrónica",getDataEstadistica("Ing. Electrónica",data2)],
                    ["Lic. Administración",getDataEstadistica("Lic. Administración",data2)],
                    ["Arquitectura",getDataEstadistica("Arquitectura",data2)],
                ],
                titulados:[
                    ['Task', 'Hours per Day'],
                    ["Si",getDataEstadistica("Si",data3)],
                    ["No",getDataEstadistica("No",data3)],
                ],
                dateTitulacion:[titulacionDate()]

                
            })
        }
    
    })
    

  
});
router.get('/respuesta/:p', async (req, res) => {

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
router.get('/data/calidad-docentes', async (req, res) => {

    return leerCsv("egresados",(data) => {
        let respuestas = []
        let buena = 0
        let mala = 0
        let regular = 0
        let muy_buena = 0
       
      
        data.map((e,i) => {
            if (i != 0){
                respuestas.push(e[22])
            }
        })
        respuestas.map((e,i) => {
            switch (e) {
                case "Buena":
                    buena = buena +1 ;
                    break;
                case "Mala":
                    mala = mala +1 ;
                    break;
            
                default:
                    break;
            }
        })
        let results = [
            { buena,
             mala,
             regular,
             muy_buena}
         ]
   
        res.json({
            results
        })
    })

  
});
router.get('/data/respuestas', async (req, res) => {

    return leerCsv("egresados",(data) => {
        let respuestas = []
        data.map((e,i) => {
            if (i != 0){
                respuestas.push(e)
            }
        })
        res.json({
            respuestas
        })
    })

  
});
router.get('/descargar/data', async (req, res) => {
    try {
        const msg = await abrirFormulario("egresados")
        res.json({
            msg
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
  
});
router.get('/perfilegresados/', async (req, res) => {

    client.authorize(async (err,tokens) => {
        if(err){
            return res.json({
                err
            })
            
        }else{
            console.log(getRange(req.params))
            const data = await run(client,'C2:C')
            const data2=await run(client,'P2:P')
            const data3=await run(client,'B2:B')
            const data4 =await run(client,'D2:D')



            return res.json({
                data:data.flat(),
                data2:data2.flat(),
                data3:data3.flat(),
                data4:data4.flat(),
            })
        }
    
    })

  
});
router.get('/egresados-main/', async (req, res) => {
    let str = "hola"
    console.log(getGeneracion(str))
       

    client.authorize(async (err,tokens) => {
        if(err){
            return res.json({
                err
            })
            
        }else{
            console.log(getRange(req.params))
            const data = await run(client,'C2:C')
            const data2=await run(client,'A1:GT1')
            const titulados=await run(client,'P2:P')
            const data3=await run(client,'CJ2:CJ')

            return res.json({
                nombres:data.flat(),
                preguntas:data2.flat(),
                numeroEgresados:data.flat().length,
                titulados: getDataEstadistica("Si",titulados),
                data3: getDataEstadistica("100%",data3),
               // matriculas:getGeneEgresados(matriculas)

            })
        }
    
    })

  
});


module.exports = router;