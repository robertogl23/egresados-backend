require("./config")
const express = require('express');
const path = require('path')
const cors = require('cors')
const hbs = require('hbs');
const app = express();
const PORT = 4000;

const egresadosRouter = require('./routes/egresados.route')
const empledoresRouter = require('./routes/empleadores.router')
/**
 * ROUTES API-V1
 * @copyright 2020
 * @author Roberto 
 * 
 **/
app.use(cors())
app.use(express.static(path.join(__dirname,'../build')));
//// Express HBS engine
//hbs.registerPartials(path.join(__dirname + '/views'));
//app.set('view engine', 'hbs');

/** 1-*/ app.use('/egresados',egresadosRouter) /**ROUTE PREGUNTAS */
/** 2-*/ app.use('/empleadores',empledoresRouter) /**ROUTE PREGUNTAS */
/** */
/** */
/** */
app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${PORT}`);
})