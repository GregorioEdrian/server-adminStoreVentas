const puppeteer = require('puppeteer');

const generatePdfCutClose = async (html) => {
  try {
    const pdfOptions = {
      format: 'A4',
      printBackground: true,
      margin: { left: "0cm", top: "1cm", right: "0cm", bottom: "4cm" },
      /* displayHeaderFooter: true, */
      /* footerTemplate: footerPdf,
      headerTemplate: headerPdf, */
    };

    const browser = await puppeteer.launch({
      args: [
        "--disable-web-security",
      ],
      defaultViewport: {
        width: 750,
        height: 500,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false,
      }
    });

    
    const page = await browser.newPage();
    await page.emulateMediaType('screen');
    await page.setContent(html);
    
    // Generar PDF en formato buffer
    const pdfBuffer = await page.pdf(pdfOptions);
    
    await browser.close();
    
    // Convertir el buffer a una cadena base64
    const base64String = pdfBuffer.toString('base64');
    
    return base64String;
    
  } catch (error) {
    throw new Error('Error al generar pdf');
  }
}

module.exports = generatePdfCutClose;