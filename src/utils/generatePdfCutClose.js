const puppeteer = require('puppeteer');

const generatePdfCutClose = async (html) => {
  try {
      /* 
        {
        headless: true,
        defaultViewport:{
            width: 816,
            height: 500,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: false,
            isLandscape: false
          }
        }
      */
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    /* await page.emulateMediaType("screen") */
    await page.setContent(html);
    
    // Generar PDF en formato buffer
    const pdfBuffer = await page.pdf();
    
    await browser.close();
    
    // Convertir el buffer a una cadena base64
    const base64String = pdfBuffer.toString('base64');
    
    return base64String;
    
  } catch (error) {
    throw new Error('Error al generar pdf');
  }
}

module.exports = generatePdfCutClose;