# Gestion Restaurant -- Backend API

API REST complète pour gérer un restaurant, développée avec **Node.js**,
**Express** et **MongoDB (Atlas)**.\
Elle offre la gestion des **utilisateurs**, **plats**, **commandes** et
des **statistiques avancées** (CA, plats populaires, performance
serveurs, etc.).

------------------------------------------------------------------------

##  Fonctionnalités

### Utilisateurs

-   Créer un utilisateur (Gérant / Serveur / Cuisinier)
-   Connexion (login)
-   Lister tous les utilisateurs

###  Plats

-   CRUD complet : créer, lire, modifier, supprimer

###  Commandes

-   Création d'une commande
-   Mise à jour du statut : En cours → Servie → Payée
-   Calcul automatique du CA

###  Statistiques (agrégations MongoDB)

-   Chiffre d'affaires total
-   Plats les plus populaires
-   Temps de service moyen
-   Performance des serveurs
-   Ventes par catégorie

------------------------------------------------------------------------

## Structure du projet

    Backend/
    │── controllers/
    │── models/
    │── routes/
    │── server.js
    │── test.http
    │── package.json
    │── .env

------------------------------------------------------------------------

##  Installation

``` bash
npm install
```


##  Lancer le serveur

``` bash
npx nodemon server.js
```

Serveur disponible sur :

    http://localhost:5000

------------------------------------------------------------------------

##  Tests API -- Fichier `test.http`

Le fichier `test.http` permet de tester **toutes les fonctionnalités du
projet** avec l'extension VS Code **REST Client**.

------------------------------------------------------------------------

#  SCÉNARIO DE TEST COMPLET (F0 → F10)

##  A. Créer un Utilisateur Gérant (F5)

``` http
POST http://localhost:5000/api/utilisateurs
Content-Type: application/json

{
    "nom": "AdminGérant1",
    "role": "Gérant",
    "motDePasse": "securemdp"
}
```

------------------------------------------------------------------------

##  B. Créer un Serveur (F5)

``` http
POST http://localhost:5000/api/utilisateurs
Content-Type: application/json

{
    "nom": "Serveur1",
    "role": "Serveur",
    "motDePasse": "service"
}
```

------------------------------------------------------------------------

##  C. Créer un Plat (F1)

``` http
POST http://localhost:5000/api/plats
Content-Type: application/json

{
    "nom": "Soupe",
    "prix": 6.50,
    "catégorie": "Entrée"
}
```

------------------------------------------------------------------------

##  D. Créer un Deuxième Plat (F1)

``` http
POST http://localhost:5000/api/plats
Content-Type: application/json

{
    "nom": "Filet",
    "prix": 32.00,
    "catégorie": "Plat"
}
```

------------------------------------------------------------------------

##  E. Créer une Commande (F2)

``` http
POST http://localhost:5000/api/commandes
Content-Type: application/json

{
    "numeroTable": 12,
    "serveurId": "Server1Id",
    "items": [
        { "platId": "Plat1Id", "quantite": 2 },
        { "platId": "Plat2Id", "quantite": 1 }
    ]
}
```

------------------------------------------------------------------------

##  F. Marquer la Commande comme Servie (F3)

``` http
PUT http://localhost:5000/api/commandes/Commande1Id/statut
Content-Type: application/json

{
    "statut": "Servie"
}
```

------------------------------------------------------------------------

##  G. Marquer la Commande comme Payée (F4)

``` http
PUT http://localhost:5000/api/commandes/Commande1Id/statut
Content-Type: application/json

{
    "statut": "Payée"
}
```

------------------------------------------------------------------------

# 🔹 PHASE 2 : STATISTIQUES (F6 à F10)

## F6 --- Chiffre d'affaires total

``` http
GET http://localhost:5000/api/stats/chiffre-affaires
```

## F7 --- Plats les plus populaires

``` http
GET http://localhost:5000/api/stats/popular-plats
```

## F8 --- Temps de service moyen

``` http
GET http://localhost:5000/api/stats/avg-service-time
```

## F9 --- Performance des serveurs

``` http
GET http://localhost:5000/api/stats/server-performance
```

## F10 --- Ventes par catégorie

``` http
GET http://localhost:5000/api/stats/sales-by-category
```



