```md
# Gestion de Restaurant 

Application full-stack de gestion de restaurant permettant de gérer les utilisateurs, les plats, les commandes et les statistiques, avec un backend Node.js/Express et un frontend React/Vite. [web:30]

---

## Fonctionnalités

- Gestion des utilisateurs avec rôles : Gérant, Serveur, Cuisinier
- Authentification sécurisée via JWT (login, tokens, protection des routes)
- CRUD complet des plats (création, modification, suppression, listing)
- Gestion des commandes avec statuts dynamiques :
  - Ouverte
  - En Préparation
  - Prête
  - Servie
  - Payée
- Interfaces dédiées :
  - Interface Serveur pour créer et suivre ses commandes
  - Interface Cuisinier pour gérer les commandes en préparation
- Statistiques avancées via MongoDB Aggregation :
  - Chiffre d’affaires total
  - Plats les plus vendus
  - Temps moyen de service
  - Performances des serveurs
  - Ventes par catégorie
- UI moderne avec React + Material UI et navigation dynamique selon le rôle utilisateur. [web:32]

---

##  Stack technique

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Bcrypt
- Dotenv
- Nodemon [web:33]

### Frontend

- React 18
- Vite
- Axios
- Material UI
- React Router DOM
- Context API [web:33]

---

##  Structure du projet

```
gestion-restaurant-app/
├── Backend/
│   ├── controllers/     # Logique métier (utilisateurs, plats, commandes, stats)
│   ├── models/          # Schémas MongoDB
│   ├── routes/          # Routes de l'API
│   ├── middleware/      # Authentification, vérification des rôles
│   ├── server.js        # Point d'entrée du backend
│   └── .env             # Variables d'environnement (MONGO_URI, JWT_SECRET, PORT)
└── Frontend/
    ├── src/
    │   ├── api/         # Config Axios pour appeler le backend
    │   ├── context/     # Contexte global (AuthContext, etc.)
    │   ├── layout/      # Layouts communs (sidebar, topbar, structure générale)
    │   ├── pages/       # Pages (Login, Register, Dashboard, Plats, Commandes, Stats, etc.)
    │   ├── App.jsx      # Définition des routes frontend
    │   └── main.jsx     # Point d'entrée React
    └── vite.config.js
```
[web:30]

---

##  Installation & lancement

Prérequis : Node.js installé sur votre machine. [web:34]

### 1 Backend

```
cd Backend
npm install
npm start
```

Par défaut, le backend tourne sur :  
http://localhost:5000 [web:34]

### 2 Frontend

```
cd Frontend
npm install
npm run dev
```

Par défaut, le frontend tourne sur :  
http://localhost:5173 [web:34]

---

## Rôles et permissions

- Gérant
  - Accès complet aux plats, commandes et statistiques
  - Peut créer, modifier et supprimer des plats
- Serveur
  - Peut créer des commandes
  - Peut passer une commande aux statuts : Servie, Payée
  - Ne voit que ses propres commandes
- Cuisinier
  - Accède uniquement aux commandes "En Préparation"
  - Peut marquer une commande comme "Prête" [web:32]

---

## API principale

### Utilisateurs

```
POST   /api/utilisateurs           # Créer un utilisateur
POST   /api/utilisateurs/login     # Login
GET    /api/utilisateurs           # Liste des utilisateurs (gérant uniquement)
```

### Plats

```
POST   /api/plats                  # Créer un plat
GET    /api/plats                  # Liste des plats
PUT    /api/plats/:id              # Mettre à jour un plat
DELETE /api/plats/:id              # Supprimer un plat
```

### Commandes

```
POST   /api/commandes              # Créer une commande
GET    /api/commandes              # Liste des commandes
PUT    /api/commandes/:id/statut   # Mettre à jour le statut d'une commande
```

### Statistiques

```
GET /api/stats/chiffre-affaires    # Chiffre d'affaires total
GET /api/stats/popular-plats       # Plats les plus vendus
GET /api/stats/avg-service-time    # Temps moyen de service
GET /api/stats/server-performance  # Performances des serveurs
GET /api/stats/sales-by-category   # Ventes par catégorie
```
[web:30]

---

## Statistiques (MongoDB Aggregation)

Les pipelines d’agrégation MongoDB permettent notamment de : [web:32]

- Calculer le chiffre d’affaires total
- Identifier les plats les plus vendus
- Mesurer le temps moyen de service
- Suivre les performances par serveur
- Consolider les ventes par catégorie de plat

---

## Améliorations possibles

- Ajout de tests (Jest / React Testing Library / Supertest)
- Gestion avancée des erreurs et des logs
- Internationalisation (i18n)
- Gestion des réservations de tables [web:33]
```