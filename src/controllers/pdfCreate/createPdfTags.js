const pdf = require('html-pdf');
const { path } = require('path');

const pdfTemplate = require("../../documents/tags");
const { Console } = require('console');

async function createPdfTags(req, res){
  try {
    const { listTags } = req.body 
    if (!listTags || !Array.isArray(listTags) || listTags.length === 0) {
      return res.status(400).json({ error: 'Debe enviar un array válido de etiquetas' });
    }
    
    const htmlContent  = pdfTemplate(listTags, {})

    /* pdf.create(htmlContent, config).toFile('pathtooutput/generated.pdf', function (err, res) {
      if (err) return console.log(err);
      console.log(res); // { filename: '/pathtooutput/generated.pdf' }
   }); */

        
    pdf.create(htmlContent).toBuffer(function (err, buffer) {
      if (err) {
        console.log(err)
      } else {
        console.log(buffer)
        var pdfBuffer = new Buffer(buffer)
        res.setHeader('Content-disposition', 'inline; filename="test.pdf"');
        res.setHeader('Content-type', 'application/pdf');
        res.send(pdfBuffer)
      }
    })

  } catch (error) {
    return res.status(400).json({error: error.message});
  }
}

module.exports = createPdfTags;