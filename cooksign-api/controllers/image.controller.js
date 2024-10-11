const axios = require('axios');

module.exports = (app, GeneralError) => {
  app.get('/', async (req, res) => {
    try {
        // Utilisez req.query.url pour obtenir l'URL de l'image
        const url = req.query.url;

        // Téléchargez l'image
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        // Définissez les en-têtes HTTP que vous souhaitez
        res.setHeader('Expires', new Date(Date.now() + oneWeekInMilliseconds).toUTCString()); // 24 heures à partir de maintenant
        res.setHeader('Content-Type', response.headers['content-type']);

        // Envoyez l'image en réponse
        res.send(response.data);
      } catch (error) {
          console.error(error);
          res.status(500).send('Une erreur est survenue');
      }
  });

  return app;
};
