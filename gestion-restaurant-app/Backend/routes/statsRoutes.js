// backend/routes/statsRoutes.js

const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// 5 Routes d'Agrégation
router.get('/chiffre-affaires', statsController.getChiffreAffaires); // F6
router.get('/popular-plats', statsController.getPopularPlats); // F7
router.get('/avg-service-time', statsController.getAverageServiceTime); // F8
router.get('/server-performance', statsController.getServerPerformance); // F9
router.get('/sales-by-category', statsController.getSalesByCategory); // F10

module.exports = router;