function converToNDecimals(num, numDig){
  if(num === 0){
    return num;
  }
  let decimalDig;
  let newListDecimal = [];

  const numberString = num.toString();
  const lisnumSeparate = numberString.split('.');

  if(lisnumSeparate.length >= 2){
    decimalDig = lisnumSeparate[1].split('');
  }else{
    return num
  }
  
  if(lisnumSeparate[1] && parseFloat(lisnumSeparate[1]) === 0){
    return num
  }
  if(lisnumSeparate[1] && lisnumSeparate[1].length <= numDig ){
    return num
  }
  
  for (let i = 0; i < numDig; i++) {
    if(i < numDig){      
      newListDecimal.push(decimalDig[i])    }    
  }
  const newPartDecimal = newListDecimal.join('');
  const newLisNumber = [lisnumSeparate[0], newPartDecimal];
  const truncNumber = newLisNumber.join('.');
  let newNumber = parseFloat(truncNumber);
  newNumber = parseFloat(newNumber.toFixed(numDig));
  return newNumber;
}

module.exports = converToNDecimals; 