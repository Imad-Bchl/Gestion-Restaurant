// backend/routes/utilisateurRoutes.js
const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Connexion (public - DOIT être en premier)
router.post('/login', utilisateurController.loginUtilisateur);

// Inscription (pour le premier utilisateur ou création par gérant)
router.post('/', utilisateurController.registerUtilisateur);

// Liste des utilisateurs (réservé au Gérant)
router.get(
  '/',
  protect,
  authorizeRoles('Gérant'),
  utilisateurController.getAllUtilisateurs
);

// Supprimer un utilisateur (réservé au Gérant)
router.delete(
  '/:id',
  protect,
  authorizeRoles('Gérant'),
  utilisateurController.deleteUtilisateur
);

module.exports = router;
