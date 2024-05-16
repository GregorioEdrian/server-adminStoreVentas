require('dotenv').config();

const {
  COIN
} = process.env;

function getConfigCoinIsMlcOrRef(){
  if(!COIN || COIN === 'mlc'){
    return 'mlc'
  }else if(COIN === 'ref'){
    return 'ref'
  }
}

module.exports = getConfigCoinIsMlcOrRef