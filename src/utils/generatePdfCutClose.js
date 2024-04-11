/* const pdf = require('html-pdf') */
const puppeteer = require('puppeteer');

const generatePdfCutClose = async (html) => {
  try {
    /* const options = { 
      format: 'Letter', 
      orientation: "portrait", 
      border: "1cm"
    };
    return new Promise((resolve, reject) => {
      pdf.create(html, options).toBuffer(function(err, buffer){
        if (err) {
          console.error('Error al crear el PDF:', err);
          reject({ error: 'Error al crear el PDF:' });
        }      
        const base64String = buffer.toString('base64');
        resolve(base64String);
      })
    }) */  

    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport:{
        width: 816,
        height: 500,
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: false,
        isLandscape: false
      }
    });
    const page = await browser.newPage();
    await page.emulateMediaType("screen")
    await page.setContent(html);
    
    // Generar PDF en formato buffer
    const pdfBuffer = await page.pdf();
    
    await browser.close();
    
    // Convertir el buffer a una cadena base64
    const base64String = pdfBuffer.toString('base64');
    
    return base64String;
    
  } catch (error) {
    return res.status(400).json({error: error})
  }
}

module.exports = generatePdfCutClose;