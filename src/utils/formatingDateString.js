//params Date AAAA-MM-DDThh:mm:ssZ
function formateDateToStringToDate(date){
  const splitDate = date.toISOString().slice(0, 19);
  const dateString = splitDate[0]
  const newDate = new Date(dateString)
  return newDate
}

module.exports = formateDateToStringToDate