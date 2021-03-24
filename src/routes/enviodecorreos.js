var nodemailer = require("nodemailer");
const express =require('express');
const router = express.Router();

router.get("/send-email/:correo/:asunto/:des", (req, res) => {
    console.log(req.params)
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        post: 465 ,
        secure: false,
        auth: {
            user: "ecologiaramses62@gmail.com",
            pass: "monkey62ramses"
        },
    });
    var mailOptions = {
        from: "Remitente",
        to: req.params.correo,
        subject: req.params.asunto,
        text: req.params.des
    }
    transporter.sendMail(mailOptions, (error, info) =>{
        if(error){
            res.status(500).send(error.message);
        } else{
            console.log("Email correctamente enviado")
            res.status(200).json({ok:req.body});
        }
    });
});


module.exports = router;