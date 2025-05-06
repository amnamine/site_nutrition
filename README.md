# Site Nutritionnel

Une application web pour la gestion des patients et des rendez-vous pour les diététiciens.

## Fonctionnalités

- Authentification des utilisateurs (admin et diététiciens)
- Gestion des patients
- Gestion des rendez-vous
- Suivi des consultations
- Interface responsive

## Prérequis

- Node.js (v14 ou supérieur)
- npm (gestionnaire de paquets Node.js)

## Installation

1. Clonez le dépôt :

```bash
git clone <url-du-repo>
cd site-nutri
```

2. Installez les dépendances :

```bash
npm install
```

3. Démarrez le serveur :

```bash
npm start
```

L'application sera accessible à l'adresse : http://localhost:3000

## Comptes par défaut

- Admin :
  - Nom d'utilisateur : admin
  - Mot de passe : admin123

## Structure du projet

```
/site-nutri
  /public
    index.html      # Interface utilisateur
    styles.css      # Styles CSS
    script.js       # JavaScript côté client
  /server
    server.js       # Serveur Express.js
    database.sqlite # Base de données SQLite
```

## Technologies utilisées

- Frontend :

  - HTML5
  - CSS3
  - JavaScript (Vanilla)

- Backend :
  - Node.js
  - Express.js
  - SQLite
  - JWT pour l'authentification

## Sécurité

- Mots de passe hashés avec bcrypt
- Authentification par token JWT
- Protection CORS
- Validation des données

## Développement

Pour lancer l'application en mode développement :

```bash
npm run dev
```

## License

MIT
