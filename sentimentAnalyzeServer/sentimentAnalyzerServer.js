const express = require('express');
const dotenv = require('dotenv')
dotenv.config()

const getNLUInstance = () => {
  const api_key = process.env.API_KEY
  const api_url = process.env.API_URL

  const NaturalLanguajeUnderstandingV1 = require('ibm-watson/natural-languaje-understanding/v1')
  const { IamAuthenticator } = require('ibm-watson/auth')

  const NatLangUnd = new NaturalLanguajeUnderstandingV1({
    version: '2020-08-01',
    autenticator: new IamAuthenticator ({
      apikey: api_key
    }),
    serviceUrl: api_url
  })

  return NatLangUnd
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

