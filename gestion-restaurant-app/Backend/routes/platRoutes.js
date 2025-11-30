// backend/routes/platsRoutes.js

const express = require('express');
const router = express.Router();
const platController = require('../controllers/platController');
const upload = require("../middleware/upload");
router.post("/", upload.single("image"), platController.createPlat);
router.put("/:id", upload.single("image"), platController.updatePlat);
router.get('/', platController.getPlats); // R
router.post('/', platController.createPlat); // C
router.get('/:id', platController.getPlatById); // R
router.put('/:id', platController.updatePlat); // U
router.delete('/:id', platController.deletePlat); // D

module.exports = router;