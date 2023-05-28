//This is the Server, Thigas. Keep that in mind

const express = require('express');
const fetch = require('node-fetch');
const { async } = require('postcss-js');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening at 3000`);
});
app.use(express.static('src'));
app.use(express.json({ limit: '1mb' }));
//Until now, i`m hosting an static file (index.html)

const OPEN_AI_KEY = process.env.OPEN_AI_KEY;

// -------- function fetchRecomendations ------
app.get('/type/:typeID/place/:placeID/mun/:munID', async (request, answer) => {
  const { typeID, placeID, munID } = request.params;
  const fetch_response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + OPEN_AI_KEY,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: `Três ${typeID} mais indicados para cultivar no Estado de ${placeID}, municipio de ${munID}. Apresente a lista em uma unica linha, separado por virgula`,
      max_tokens: 64, // tamanho da resposta
      temperature: 0, // criatividade na resposta
    }),
  });
  const json = await fetch_response.json();
  answer.json(json.choices[0]);
});

// ------------- function fetchWhy ----------
app.get(
  '/elementWhy/:elementID/placeWhy/:placeID/munWhy/:munID',
  async (request, answer) => {
    const { elementID, placeID, munID } = request.params;
    const fetch_response = await fetch(
      'https://api.openai.com/v1/completions',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + OPEN_AI_KEY,
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: `Considerando o solo e a economia local, por que o cultivo de ${elementID} é indicado no estado de ${placeID}, municipio de ${munID}?`,
          max_tokens: 1000, // tamanho da resposta
          temperature: 0.6, // criatividade na resposta
        }),
      }
    );
    const json = await fetch_response.json();
    answer.json(json.choices[0]);
  }
);

// ----------- function fetchWeather ----------
app.get('/placeWeather/:placeID/munWeather/:munID', async (request, answer) => {
  const { placeID, munID } = request.params;
  const fetch_response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + OPEN_AI_KEY,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: `Quais as características climáticas do estado de ${placeID}, municipio de ${munID} ?`,
      max_tokens: 1000, // tamanho da resposta
      temperature: 0.5, // criatividade na resposta
    }),
  });
  const json = await fetch_response.json();
  answer.json(json.choices[0]);
});

// -------------- function fetchImage ---------------
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');
const googleSearchCredentials = process.env.SE_ID;
const GSKey = process.env.API_KEY;

app.get('/placeImage/:placeID', async (request, answer) => {
  const { placeID } = request.params;
  const response = await customSearch.cse.list({
    auth: GSKey,
    cx: googleSearchCredentials,
    q: `${placeID}`,
    searchType: 'image',
    imgSize: 'large',
    num: 5,
  });
  const imagesUrl = response.data.items.map((item) => {
    return item.link;
  });
  console.log(imagesUrl);
  answer.json(imagesUrl);
});

// ---------- function fetchPlant -------------
app.get(
  '/elementPlant/:elementID/placePlant/:placeID/munPlant/:munID',
  async (request, answer) => {
    const { elementID, placeID, munID } = request.params;
    const fetch_response = await fetch(
      'https://api.openai.com/v1/completions',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + OPEN_AI_KEY,
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: `Elabore um paragráfo com as dicas mais importantes para o sucesso do plantio de ${elementID} no estado de ${placeID}, cidade de ${munID}`,
          max_tokens: 400, // tamanho da resposta
          temperature: 0.6, // criatividade na resposta
        }),
      }
    );
    const json = await fetch_response.json();
    answer.json(json.choices[0]);
  }
);

// ----------------------- PROSA.JS --------------------------
// ------------------ function patternAnswer -----------------
app.get('/pattern/:question', async (request, answer) => {
  const { question } = request.params;
  const fetch_response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + OPEN_AI_KEY,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: `Elabore um parágrafo sobre a pergunta. Responda de forma direta. Pergunta: ${question} `,
      max_tokens: 600, // tamanho da resposta
      temperature: 0.9, // criatividade na resposta
    }),
  });
  const json = await fetch_response.json();
  answer.json(json.choices[0]);
});

// ------------------- function sendQuestion -----------------
app.get('sendQ/:question', async (request, answer) => {
  const { question } = request.params;
  const fetch_response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + OPEN_AI_KEY,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: `Interprete o papel de um agricultor experiente em agricultura orgânica chamado "Wise". Responda à pergunta de forma simples. Pergunta: ${question} `,
      max_tokens: 700, // tamanho da resposta
      temperature: 0.9, // criatividade na resposta
    }),
  });
  const json = await fetch_response.json();
  answer.json(json.choices[0]);
});
