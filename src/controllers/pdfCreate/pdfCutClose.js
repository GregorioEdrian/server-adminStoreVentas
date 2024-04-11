const pdf = require('html-pdf')
const htmlCutClose = require('./htmlCutClose')

const options = { format: 'Letter' };

const createPDFCutClose = (req, res) => {
  try {
    const html = htmlCutClose();
    pdf.create(html, options).toBuffer(function(err, buffer){
      if (err) {
        console.error('Error al crear el PDF:', err);
        return res.status(500).json({ error: 'Error interno al crear el PDF' });
      }
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cutClose.pdf"'
      });
      const base64String = buffer.toString('base64');
      return res.status(200).json({ pdfBase64: base64String });
    });
  } catch (error) {
    return res.status(400).json({error: error})
  }
}

module.exports = createPDFCutClose;
