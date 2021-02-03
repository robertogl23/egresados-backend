const { google } = require('googleapis');
const keys = require('./keys.json')

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize((err,tokens) => {
    if(err){
        console.log(err)
        return;
    }else{
        console.log("ok")
        run(client)
    }

})

async function run(cl,id,range){
    const gsapi = google.sheets({version:'v4',auth:cl});

    const opt = {
        spreadsheetId:'1k0Jdw5JYtcJQmvB7_pkjN4Ml96UJu6cn4XdDroNNnzw',
        range:'Data!A1:DV'
    };

    let data = await gsapi.spreadsheets.values.get(opt)
    console.log(data.data.values)
}