# CookSign API

![Badge de version](https://img.shields.io/badge/version-1.0.0-blue)
![Badge NodeJS](https://img.shields.io/badge/framework-NodeJS-green)

## Introduction

L'API de CookSign fournit toutes les fonctionnalités back-end nécessaires pour le fonctionnement de la borne de commande CookSign. Elle gère les commandes, les utilisateurs, les notifications en temps réel et bien plus encore.

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Modèles](#modèles)
- [Routes API](#routes-api)
- [Système de Socket avec Socket.io](#système-de-socket-avec-socketio)
- [Déploiement](#déploiement)
- [Dépendances](#dépendances)
- [Contact](#contact)

## Prérequis

- Node.js (version recommandée: 14.x)
- npm (version recommandée: 6.x)

## Installation

1. **Clonez le dépôt de l'API** :
   ```bash
   git clone https://rendu-git.etna-alternance.net/module-8898/activity-48680/group-969357.git
   ```

2. **Accédez au dossier de l'API** :
   ```bash
   cd cooksign-api
   ```

3. **Installez les dépendances** :
   ```bash
   npm install
   ```

## Configuration

Avant de démarrer l'API, configurez les variables d'environnement. Créez un fichier `.env` à la racine du projet et définissez :

```
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
PORT=your_preferred_port
```

## Modèles

L'API de CookSign utilise plusieurs modèles pour structurer les données :

- **Borne** : `cooksign-api/models/bornes.js`
- **Catégorie** : `cooksign-api/models/categorie.js`
- **Facture** : `cooksign-api/models/factures.js`
- **Image** : `cooksign-api/models/image.js`
- **Index** : `cooksign-api/models/index.js`
- **Ingrédient** : `cooksign-api/models/ingredient.js`
- **Menu** : `cooksign-api/models/menu.js`
- **Plat-Ingredient** : `cooksign-api/models/plat-has-ingredient.model.js`
- **Plat-Menu** : `cooksign-api/models/plat-has-menu.model.js`
- **Plat** : `cooksign-api/models/plats.js`
- **Détails du Restaurant** : `cooksign-api/models/restaurant-details.js`
- **Restaurant** : `cooksign-api/models/restaurant.js`
- **Rôle** : `cooksign-api/models/roles.js`
- **User-Rôle** : `cooksign-api/models/user-has-role.model.js`
- **Utilisateur** : `cooksign-api/models/users.js`

## Routes API

L'API de CookSign offre plusieurs routes pour gérer les différentes fonctionnalités. Pour chaque modèle, les routes CRUD (Create, Read, Update, Delete) sont disponibles :

- **/bornes** : Gestion des bornes.
- **/categories** : Gestion des catégories.
- **/factures** : Gestion des factures.
- **/images** : Gestion des images.
- **/ingredients** : Gestion des ingrédients.
- **/menus** : Gestion des menus.
- **/plats** : Gestion des plats.
- **/restaurants** : Gestion des restaurants.
- **/roles** : Gestion des rôles.
- **/users** : Gestion des utilisateurs.

## Système de Socket avec Socket.io

L'API utilise Socket.io pour permettre une communication en temps réel entre le serveur et les clients.

## Déploiement

L'API de CookSign a été déployée sur digitalOcean. Assurez-vous de configurer correctement les variables d'environnement pour la production.

## Dépendances

L'API de CookSign utilise plusieurs dépendances pour offrir ses fonctionnalités :

- **axios** : Pour effectuer des requêtes HTTP.
- **bcrypt** : Pour le hachage des mots de passe.
- **body-parser** : Pour analyser les corps des requêtes entrantes.
- **cookie-parser** : Pour analyser les cookies des requêtes entrantes.
- **cors** : Pour activer CORS.
- **dotenv** : Pour charger les variables d'environnement.
- **express** : Framework pour construire l'API.
- **googleapis** : Client pour les APIs Google.
- **joi** : Pour la validation des données.
- **multer** : Pour gérer le téléchargement de fichiers.
- **mysql2** : Driver pour MySQL.
- **nodemon** : Pour le rechargement automatique du serveur pendant le développement.
- **passport** et ses stratégies : Pour l'authentification.
- **run-script-os** : Pour exécuter des scripts spécifiques à l'OS.
- **sequelize** et **sequelize-cli** : ORM pour interagir avec la base de données.
- **socket.io** : Pour la communication en temps réel.
- **swagger-jsdoc** et **swagger-ui-express** : Pour la documentation de l'API.

## Contact

Pour toute question ou suggestion concernant l'API, contactez-nous à ```hello@cooksign.com```.
