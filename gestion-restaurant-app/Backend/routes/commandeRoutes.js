const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');

// création
router.post('/', commandeController.createCommande);

// lecture
router.get('/', commandeController.getCommandes);

// mise à jour DU CONTENU (serveur, En Préparation)
router.put('/:id', commandeController.updateCommandeDetails);

// mise à jour DU STATUT
router.put('/:id/statut', commandeController.updateCommandeStatut);

module.exports = router;
