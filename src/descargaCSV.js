const puppeteer = require('puppeteer');
const StreamZip = require('node-stream-zip');
const fs = require("fs"); // filesystem
const csv = require("csv-parse"); // Encargado de parsear
const path = require("path")

const URL_EMPLEDORES = "https://docs.google.com/forms/d/1QKlqvk54lFoV1Edoi6d3OJJN66olM9iMPU-ErwutMgo/edit?chromeless=1#responses";
const URL_EGRESADOS = "https://docs.google.com/forms/d/1RW9GHVsxfxyVYOT4YdCCWmh6kCDUtYj4S4NM2NMv7XY/edit#responses";
const DIRECTORIO_DESCARGA = path.join(__dirname,"../data/")

const URL_ZIP_EGREADOS = DIRECTORIO_DESCARGA + "egresados/EGRESADOS (TESI).csv.zip";
const URL_ZIP_EMPLEADORES = DIRECTORIO_DESCARGA + "empleadores/CUESTIONARIO PARA EMPLEADORES.csv.zip";

const URL_CSV_EGRESADOS = DIRECTORIO_DESCARGA + "egresados/EGRESADOS (TESI).csv";
const URL_CSV_EMPLEADORES = DIRECTORIO_DESCARGA + "empleadores/CUESTIONARIO PARA EMPLEADORES.csv";


const configPuppeteer = async (TYPE) => {

    try {
            /**
        *    CONFIG LAUNCH 
        **/
        const browser = await puppeteer.launch({
            headless: true
        });
        /** */
        const page = await browser.newPage();
        /** */
        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: DIRECTORIO_DESCARGA + TYPE
        })
        return {
            page,
            browser
        }
            
    } catch (error) {
        return error
    }
    
}
const clickFirts = async (page) => {
    /** */
    try {
        const select = await page.$('div.freebirdFormeditorViewResponsesButton > div.docsWizActionMenuMenuButton > div');
        await select.click()
        
    } catch (error) {
        return error
    }
}
const clickSecond = async (page,TYPE) => {
    /** */
    try {
        const select_donwload = await page.waitForSelector('div.quantumWizMenuPapermenuMenu > div.quantumWizMenuPapermenuMenuScrollBox > div');
        await select_donwload.click();
        await page.waitFor(1000);
        await select_donwload.click();
        await page.waitFor(2000);
        console.log(DIRECTORIO_DESCARGA + TYPE)
        const zip = new StreamZip({
            file: establecerRutaZip(TYPE),
            storeEntries: true
        });
    
        zip.on('error', err => console.log(err));
        zip.on('ready', () => {
            zip.extract(null,DIRECTORIO_DESCARGA + TYPE,( err) => {
                console.log(err ? 'Extract error' : 'Extracted');
                zip.close();
            });
        });
        
    } catch (error) {
        return error
    }
}

const establecerRuta = (URL) => {
    switch (URL) {
        case "empleadores":
            return URL_EMPLEDORES;
    
        default:
            return URL_EGRESADOS;
    }
}
const establecerRutaZip = (TYPE) => {
    switch (TYPE) {
        case "empleadores":
            return URL_ZIP_EMPLEADORES;
    
        default:
            return URL_ZIP_EGREADOS;
    }
}
const establecerRutaCsv= (TYPE) => {
    switch (TYPE) {
        case "empleadores":
            return URL_CSV_EMPLEADORES;
    
        default:
            return URL_CSV_EGRESADOS;
    }
}

const descomprimirArchivo = ( TYPE, callback) => {
    /**Abrir archivo zip */
    const zip = new StreamZip({
        file: establecerRutaZip(TYPE),
        storeEntries: true
    });

    zip.on('error', err => callback(err));
    zip.on('ready', () => {
        zip.extract(null,DIRECTORIO_DESCARGA + TYPE,( err) => {
            console.log(err ? 'Extract error' : 'Extracted');
            zip.close();
            callback(null,true)
        });
    });

}
const abrirFormulario = async (URL_TYPE) => {
    try {
        const { page,browser } = await configPuppeteer(URL_TYPE)
        await page.goto(establecerRuta(URL_TYPE));
        await clickFirts(page)
        await clickSecond(page,URL_TYPE)
        await browser.close()
        return 'ok'

    } catch (error) {
        return error
    }
}

const leerCsv = async (TYPE,callback) => {
    let data = []
    const parseador = csv({
        delimiter: ",", //Delimitador, por defecto es la coma ,
        cast: true, // Intentar convertir las cadenas a tipos nativos
        comment: "#", // El carácter con el que comienzan las líneas de los comentarios, en caso de existir
    });
    
    parseador.on("readable", function () {
        while ((f = parseador.read())) {
            data.push(f)
        }
    });
      
    parseador.on("error", function (err) {
        console.error("Error al leer CSV:", err.message);
    });
    fs.createReadStream(establecerRutaCsv(TYPE)) // Abrir archivo
    .pipe(parseador) // Pasarlo al parseador a través de una tubería
    .on("end", function () {
        // Y al finalizar, terminar lo necesario
        callback(data)
        parseador.end();
     

    });
}
//( async () => {
//    try {
//        const page = await abrirFormulario("egresados")
//        
//    } catch (error) {
//            console.log(error)
//    }
//})()

module.exports = { abrirFormulario,leerCsv}