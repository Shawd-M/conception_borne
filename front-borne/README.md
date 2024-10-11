# CookSign

![Badge de version](https://img.shields.io/badge/version-1.0.0-blue)
![Badge NuxtJS](https://img.shields.io/badge/framework-NuxtJS-green)

## Introduction

CookSign est une borne de commande innovante conçue pour les restaurateurs. Elle vise à optimiser les bénéfices des restaurateurs et à réduire le temps d'attente des consommateurs dans la restauration rapide. Grâce à cette borne, les restaurateurs peuvent automatiser la prise de commande, offrant ainsi, une meilleure expérience utilisateur tout en améliorant l'efficacité opérationnelle.

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)
- [Packages Utilisés](#packages-utilisés)
- [Tests fonctionelle avec Cypress](#tests-fonctionelle-avec-cypress)
- [Déploiement](#déploiement)
- [Remerciements](#remerciements)
- [Équipe](#équipe)
- [Vision](#vision)
- [Contact](#contact)
- [Sécurité](#sécurité)

## Prérequis

- Node.js (version recommandée: 14.x)
- npm (version recommandée: 6.x)

## Installation

1. **Clonez le dépôt** :
   ```bash
   git clone https://rendu-git.etna-alternance.net/module-8898/activity-48680/group-969357.git
   ``````

2. **Accédez au dossier du projet** :
   ```bash
   cd cooksign
   ```

3. **Installez les dépendances** :
   ```bash
   npm install
   ```

## Configuration

Avant de démarrer l'application, configurez les variables d'environnement. Créez un fichier `.env` et définissez :

```
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```


## Utilisation

Pour démarrer CookSign en mode développement :
```bash
npm run dev
```
Le site sera accessible à l'URL 
```bash
http://localhost:3001
```

## Structure du Projet

CookSign est construit avec le framework NuxtJS. Voici une brève description de la structure du projet :

- **Pages** : Vues principales de l'application.
- **Components** : Éléments réutilisables.
- **Middleware** : Fonctions exécutées avant le rendu d'une page.

## Packages Utilisés

CookSign utilise une variété de packages pour étendre ses fonctionnalités :

- **@nuxtjs/auth-next** : Un module d'authentification pour NuxtJS.
- **@nuxtjs/axios** : Intégration d'Axios pour faciliter les requêtes HTTP.
- **vue-masonry-css** : Pour des mises en page de type masonry.
- **vuetify** : Un framework de composants UI basé sur Material Design pour Vue.js.

## Tests fonctionelle avec Cypress

Pour installer Cypress :
```bash
npm install cypress --save-dev
```

Pour exécuter les tests :
```bash
npx cypress open
```

## Déploiement

CookSign a été déployé sur Netlify. Vous pouvez accéder à la version en production via le lien fourni dans la description du dépôt GitHub ou directement via l'URL Netlify associée.

## Remerciements

Merci à tous ceux qui ont contribué et soutenu ce projet.

## Équipe

L'équipe derrière CookSign est composée d'étudiants talentueux de l’école d’informatique de l’Etna :

- **M.STANISZEWSKI Krystian & M. MEKOULOU Keysah** : Ils pilotent le projet, gèrent la relation client et supervisent le développement.
- **M.TANSEL Attila** : Spécialiste du front-end, il est responsable de l'interface utilisateur.
- **M.KIM Théodore & M. JOSEPH Dhierry** : Ils gèrent le back-end, s'assurant que tout fonctionne sans accroc.

## Vision

CookSign aspire à être la solution technologique de référence pour les restaurateurs.

## Contact

Pour toute question, contactez-nous à ```hello@cooksign.com```.

## Sécurité

Pour signaler des problèmes de sécurité, veuillez nous contacter directement à ```support@cooksign.com```.
