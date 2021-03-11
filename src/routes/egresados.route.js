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
            const data10 = await run(client,'AE2:AE')
            const data11 = await run(client,'AH2:AH')
            const data12 = await run(client,'AI2:AI')
            const data13 = await run(client,'AJ2:AJ')
            const data14 = await run(client,'AK2:AK')
            const data15 = await run(client,'AL2:AL')
            const data16 = await run(client,'AM2:AM')
            const data17 = await run(client,'AN2:AN')
            const data18 = await run(client,'AO2:AO')
            const data19 = await run(client,'AP2:AP')
            const data20 = await run(client,'AQ2:AQ')
            const data21 = await run(client,'AR2:AR')
            const data22 = await run(client,'AT2:AT')
            const data23 = await run(client,'AU2:AU')
            const data24 = await run(client,'AV2:AV')
            const data25 = await run(client,'AW2:AW')
            const data26 = await run(client,'AX2:AX')
            const data27 = await run(client,'AY2:AY')
            const data28 = await run(client,'AZ2:AZ')
            const data29 = await run(client,'BA2:BA')
            const data30 = await run(client,'BB2:BB')
            const data31 = await run(client,'BC2:BC')
            const data32 = await run(client,'BD2:BD')
            const data33 = await run(client,'BL2:BL')
            const data34 = await run(client,'BS2:BS')
            const data35 = await run(client,'BY2:BY')
            const data4 = await run(client,'Q2:Q')
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
                dateTitulacion:[titulacionDate()],

                contenidoRelevante:[
                    ["Name", "¿Los contenidos de las materias fueron utiles?"],
                    ["Muy de acuerdo",getDataEstadistica("Muy de acuerdo",data10)],
                    ["De acuerdo",getDataEstadistica("De acuerdo",data10)],
                    ["En desacuerdo",getDataEstadistica("En desacuerdo",data10)],
                    ["Muy en desacuerdo",getDataEstadistica("Muy en desacuerdo",data10)],
                ],

                comunicacion:[
                    ["Name", "Nivel de Comunicacion del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data11)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data11)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data11)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data11)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data11)],
                ],
                pensamientoCritico:[
                    ["Name", "Nivel del Pensamiento Critico del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data12)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data12)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data12)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data12)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data12)],
                ],
                solucionDeProblemas:[
                    ["Name", "Nivel para identificar problemas del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data13)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data13)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data13)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data13)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data13)],
                ],
                interaccionSocial:[
                    ["Name", "Nivel para formar parte de equipos de trabajo del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data14)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data14)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data14)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data14)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data14)],
                ],
                aprendizaje:[
                    ["Name", "Nivel de aprendizaje del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data15)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data15)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data15)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data15)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data15)],
                ],
                consistenciaEtica:[
                    ["Name", "Nivel para asumir principios éticos del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data16)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data16)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data16)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data16)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data16)],
                ],
                globalizado:[
                    ["Name", "Nivel para comprender los aspectos interdependientes del mundo globalizado del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data17)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data17)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data17)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data17)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data17)],
                ],
                ciudadana:[
                    ["Name", "Nivel para integrarse a la comunidad del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data18)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data18)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data18)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data18)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data18)],
                ],
                sensibilidadEstetica:[
                    ["Name", "Nivel de apreciar y valorar diversas formas artísticas del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data19)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data19)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data19)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data19)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data19)],
                ],
                diseñar:[
                    ["Name", "Nivel para diseñar, configurar y administrar redes computacionales del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data20)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data20)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data20)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data20)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data20)],
                ],
                diseñar2:[
                    ["Name", "Nivel para diseñar, desarrollar y aplica modelos computacionales para solucionar problemas del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data21)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data21)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data21)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data21)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data21)],
                ],
                diseñar3:[
                    ["Name", "Nivel para diseñar e implementar interfaces hombre-máquina y máquina-máquina para la automatización de sistemas del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data22)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data22)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data22)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data22)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data22)],
                ],
                identificarComprender:[
                    ["Name", "Nivel para identificar y comprender las tecnologías de hardware del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data23)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data23)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data23)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data23)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data23)],
                ],
                diseñarBases:[
                    ["Name", "Nivel para diseñar, desarrollar y administrar bases de datos conforme a requerimientos definidos del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data24)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data24)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data24)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data24)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data24)],
                ],
                soluciones:[
                    ["Name", "Nivel para integrar soluciones computacionales con diferentes tecnologías del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data25)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data25)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data25)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data25)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data25)],
                ],
                empresarial:[
                    ["Name", "Nivel para desarrollar una visión empresarial para detectar áreas de oportunidad del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data26)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data26)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data26)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data26)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data26)],
                ],
                desempeñar:[
                    ["Name", "Nivel para desempeñar sus actividades profesionales del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data27)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data27)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data27)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data27)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data27)],
                ],
                habMetod:[
                    ["Name", "Nivel para poseer habilidades metodológicas de investigación del Egresado"],
                    ["EXCELENTE (95% A 100%)",getDataEstadistica("EXCELENTE (95% A 100%)",data28)],
                    ["NOTABLE (90% A 94%)",getDataEstadistica("NOTABLE (90% A 94%)",data28)],
                    ["BUENO (80% A 89%)",getDataEstadistica("BUENO (80% A 89%)",data28)],
                    ["SUFICIENTE (70% A 79%)",getDataEstadistica("SUFICIENTE (70% A 79%)",data28)],
                    ["DEFICIENTE (MENOS DEL 70%)",getDataEstadistica("DEFICIENTE (MENOS DEL 70%)",data28)],
                ],
                docentes:[
                    ["Name", "Los docentes con los que contó tu división de carrera tenían las competencias y capacidades para dotarnos de la formación comprometida"],
                    ["Muy de acuerdo",getDataEstadistica("Muy de acuerdo",data29)],
                    ["De acuerdo",getDataEstadistica("De acuerdo",data29)],
                    ["En desacuerdo",getDataEstadistica("En desacuerdo",data29)],
                    ["Muy en desacuerdo",getDataEstadistica("Muy en desacuerdo",data29)],
                ],
                conociTeor:[
                    ["Name", "Los profesores estaban al día en el conocimiento teórico y práctico de la disciplina y eso era evidente en sus clases"],
                    ["Muy de acuerdo",getDataEstadistica("Muy de acuerdo",data30)],
                    ["De acuerdo",getDataEstadistica("De acuerdo",data30)],
                    ["En desacuerdo",getDataEstadistica("En desacuerdo",data30)],
                    ["Muy en desacuerdo",getDataEstadistica("Muy en desacuerdo",data30)],
                ],
                persAdm:[
                    ["Name", "El personal administrativo de tu división de carrera entregaba los servicios adecuados para un funcionamiento eficiente"],
                    ["Muy de acuerdo",getDataEstadistica("Muy de acuerdo",data31)],
                    ["De acuerdo",getDataEstadistica("De acuerdo",data31)],
                    ["En desacuerdo",getDataEstadistica("En desacuerdo",data31)],
                    ["Muy en desacuerdo",getDataEstadistica("Muy en desacuerdo",data31)],
                ],
                persAdm2:[
                    ["Name", "La cantidad de personal administrativo era la adecuada para proporcionar la atención oportuna y eficiente"],
                    ["Muy de acuerdo",getDataEstadistica("Muy de acuerdo",data32)],
                    ["De acuerdo",getDataEstadistica("De acuerdo",data32)],
                    ["En desacuerdo",getDataEstadistica("En desacuerdo",data32)],
                    ["Muy en desacuerdo",getDataEstadistica("Muy en desacuerdo",data32)],
                ],
                segEgr:[
                    ["Name", "Existe un proceso eficiente de seguimiento de los egresados en el que he participado"],
                    ["Muy de acuerdo",getDataEstadistica("Muy de acuerdo",data33)],
                    ["De acuerdo",getDataEstadistica("De acuerdo",data33)],
                    ["En desacuerdo",getDataEstadistica("En desacuerdo",data33)],
                    ["Muy en desacuerdo",getDataEstadistica("Muy en desacuerdo",data33)],
                ],
                formacion:[
                    ["Name", "La formación que recibí, fue suficiente para desempeñar de manera satisfactoria las prácticas profesionales y para enfrentarme al mundo laboral"],
                    ["Muy de acuerdo",getDataEstadistica("Muy de acuerdo",data34)],
                    ["De acuerdo",getDataEstadistica("De acuerdo",data34)],
                    ["En desacuerdo",getDataEstadistica("En desacuerdo",data34)],
                    ["Muy en desacuerdo",getDataEstadistica("Muy en desacuerdo",data34)],
                ],
                contratado:[
                    ["Name", "Al egresar de la carrera, fui contratado de acuerdo a mis expectativas profesionales y sueldo"],
                    ["Muy de acuerdo",getDataEstadistica("Muy de acuerdo",data35)],
                    ["De acuerdo",getDataEstadistica("De acuerdo",data35)],
                    ["En desacuerdo",getDataEstadistica("En desacuerdo",data35)],
                    ["Muy en desacuerdo",getDataEstadistica("Muy en desacuerdo",data35)],
                ],
                
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
router.get('/datos-egresados/:id', async (req, res) => {
    const correos = await run(client,'B2:B')
    const nombre = await run(client,'C2:C')
    client.authorize(async (err,tokens) => {
        if(err){
            return res.json({
                err
            })
            
        }else{
            return res.json({
                correos:correos[req.params.id],
                nombre

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