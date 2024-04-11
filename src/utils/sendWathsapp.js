require('dotenv').config();

const {
  WHAT_BOT_ID, WHAT_PHONE_NBR, WHAT_BEARER_TOKEN
} = process.env;


const botId = WHAT_BOT_ID;
const phoneNbr = WHAT_PHONE_NBR;
const bearerToken = WHAT_BEARER_TOKEN;

const url = 'https://graph.facebook.com/v18.0/' + botId + '/messages';
const data = {
  messaging_product: 'whatsapp',
  to: phoneNbr,
  type: 'template',
  template: {
    name:'hello_world',
    language:{ code: 'en_US' }
  }
};

const postReq = {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + bearerToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data),
  json: true
};

fetch(url, postReq)
  .then(data => {
    return data.json()
  })
  .then(res => {
    console.log(res)
  })
  .catch(error => console.log(error));