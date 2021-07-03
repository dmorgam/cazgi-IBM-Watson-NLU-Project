const express = require('express');
const dotenv = require('dotenv')
dotenv.config()

const getNLUInstance = () => {
  const api_key = process.env.API_KEY
  const api_url = process.env.API_URL

  const NaturalLanguajeUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1')
  const { IamAuthenticator } = require('ibm-watson/auth')

  const NatLangUnd = new NaturalLanguajeUnderstandingV1({
    version: '2021-03-25',
    authenticator: new IamAuthenticator ({
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
    const NLU = getNLUInstance()

    NLU.analyze({
      url: req.query.url,
      features: {
        entities: {
          emotion: true
        },
        keywords: {
          emotion: true
        }
      },
      languaje: 'en'
    })
    .then(analysisResults => {
        const result = JSON.stringify(analysisResults.result.keywords[0].emotion)

        res.setHeader('Content-Type', 'application/json')
        return res.send(result);
    })
    .catch(err => {
      console.log('error:', err);
    });
});

app.get("/url/sentiment", (req,res) => {
    const NLU = getNLUInstance()

    NLU.analyze({
      url: req.query.url,
      features: {
        entities: {
          sentiment: true
        },
        keywords: {
          sentiment: true
        }
      },
      languaje: 'en'
    })
    .then(analysisResults => {
        const result = analysisResults.result.keywords[0].sentiment.label

        // return res.send(result);
        res.setHeader('Content-Type', 'application/json')
        return res.send({ label: result, text: "url sentiment for "+req.query.url });
    })
    .catch(err => {
      console.log('error:', err);
    });
});

app.get("/text/emotion", (req,res) => {
    const NLU = getNLUInstance()

    NLU.analyze({
      text: req.query.text,
      features: {
        entities: {
          emotion: true
        },
        keywords: {
          emotion: true
        }
      },
      languaje: 'en'
    })
    .then(analysisResults => {
        const result = JSON.stringify(analysisResults.result.keywords[0].emotion)

        res.setHeader('Content-Type', 'application/json')
        return res.send(result);
    })
    .catch(err => {
      console.log('error:', err);
    });
});

app.get("/text/sentiment", (req,res) => {
    const NLU = getNLUInstance()

    NLU.analyze({
      text: req.query.text,
      features: {
        entities: {
          sentiment: true
        },
        keywords: {
          sentiment: true
        }
      },
      languaje: 'en'
    })
    .then(analysisResults => {
        const result = analysisResults.result.keywords[0].sentiment.label

        // return res.send(result);
        res.setHeader('Content-Type', 'application/json')
        return res.send({ label: result, text: "text sentiment for "+req.query.text });
    })
    .catch(err => {
      console.log('error:', err);
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

