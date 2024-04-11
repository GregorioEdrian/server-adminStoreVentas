const pdf = require('html-pdf')

const generatePdfCutClose = async (html) => {
  try {
    const options = { format: 'Letter', orientation: "portrait", border: "1cm" };
    return new Promise((resolve, reject) => {
      pdf.create(html, options).toBuffer(function(err, buffer){
        if (err) {
          console.error('Error al crear el PDF:', err);
          reject({ error: 'Error al crear el PDF:' });
        }      
        const base64String = buffer.toString('base64');
        resolve(base64String);
      })
    })  
    
  } catch (error) {
    return res.status(400).json({error: error})
  }
}

module.exports = generatePdfCutClose;