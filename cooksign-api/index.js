require('dotenv').config();
const express = require('express')
const cookieParser = require('cookie-parser');
const app = express()
const fs = require('fs');
const cors = require('./helpers/cors');
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const swaggerDocs = require('./helpers/swagger');
const passport = require('passport');
const handleErrors = require('./middleware/handleErrors');
const { GeneralError } = require('./helpers/errors');
const Facture = require("./services/facture.service");

const http = require('http');
const server = http.createServer(app); // Passer 'app' à createServer
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  // Envoyer des données en temps réel
  let intervalId;
  socket.on('restaurantId', (restaurantId) => {
    // Arrêter l'ancien intervalle
    clearInterval(intervalId);

    // Lancer un nouvel intervalle pour interroger la base de données
    intervalId = setInterval(() => {
      Facture.ReadAllByRestaurant(restaurantId).then((data) => {
        // Envoyer les données à tous les clients connectés
        io.emit('data', data);
      }).catch((err) => {
        console.error(err);
      });
    }, 5000);
  });

  // Gérer la déconnexion du client
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);
  });
});

// Remplacer 'app.listen' par 'server.listen'
server.listen(process.env.PORT || 6670, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 6670}`);
  console.log('url:', `http://localhost:${port}/`);
});

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
require('./helpers/passport');

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

const port = normalizePort(process.env.PORT || 6670);
const middleware = passport.authenticate('jwt', { session: false }, null);

const controllers = fs.readdirSync(`${__dirname}/controllers`);

controllers.forEach((controller) => {
    const name = controller.split('.')[0];
    if (name.includes('auth') || name.includes('notification')) {
      app.use(`/api/${name}`, require(`./controllers/${controller}`)(express(), GeneralError));
    } else {
      app.use(`/api/${name}`, middleware, require(`./controllers/${controller}`)(express(), GeneralError));
    }
  });

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/', require('./helpers/not-found')(express(), GeneralError));

app.use(handleErrors);

app.get('/test', (req,res) => {
    res.send("Liste des parkings")
})