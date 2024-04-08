module.exports = (data) => {

  const allCard = data.map((tag) => {
    return `
      <div class='containerCards'>
        <div class='conatainerPrice'>
          <span id='price'>${tag.price}</span>
          <span>Bs.</span>
        </div>
        <p>${tag.name}.</p>
      </div>
    `
  }).join('');

 
  return `
    <!DOCTYPE html>
    <html lang="es">
      
    <head>
      <meta charset="UTF-8"/>
      <title>Etiquetas de precios</title>
      <style>
        .cardsContainer{
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 15px;
          overflow-x: auto;
          border: 1px solid rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 5px;
        }
        
        .containerCards{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 1px solid rgba(0, 0, 0, 1);
          border-radius: 8px;
          padding: 5px;
          max-width: max-content;
        }
        .conatainerPrice{
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 100%;
        }
        .conatainerPrice > span{
          padding: 0;
          margin: 0;
          font-size: 18px;
          font-weight: 100;
          padding: 0;
          margin: 0;
        }
        .containerCards > p{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 100%;
          text-align: center;
          font-size: 16px;
          padding: 0;
          margin: 0;
          font-weight: 100;
        }
        #price{
          font-size: 32px;
        }
      </style>
    </head>
    
    <body>
      <div class = "cardsContainer">
        ${allCard}
      </div>
    </body>

    </html>
  `
}