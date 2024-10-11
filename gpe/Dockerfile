# Utiliser une image Node.js comme base
FROM node:16

# Définir le répertoire de travail dans l'image Docker
WORKDIR /app

# Copier les fichiers du projet dans l'image Docker
COPY . /app

# Installer les dépendances
RUN npm install

# Exposer le port d'écoute du serveur Nuxt.js
EXPOSE 3000

# Démarrer le serveur Nuxt.js
CMD ["npm", "run", "dev"]
