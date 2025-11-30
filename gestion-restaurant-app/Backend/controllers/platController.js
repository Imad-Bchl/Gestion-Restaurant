// Backend/controllers/platController.js
const Plat = require("../models/Plat");

// petit helper pour construire une URL complète vers /uploads
function buildImageUrl(req, filename) {
  if (!filename) return undefined;
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
}

// GET /plats
exports.getPlats = async (req, res) => {
  try {
    const plats = await Plat.find({});
    res.status(200).json(plats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /plats  (avec upload.single("image"))
exports.createPlat = async (req, res) => {
  try {
    const { nom, description, prix, categorie } = req.body;

    const platData = {
      nom,
      description,
      prix,
      categorie,
    };

    if (req.file) {
      platData.imageUrl = buildImageUrl(req, req.file.filename);
    }

    const platCréé = await Plat.create(platData);
    res.status(201).json(platCréé);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /plats/:id
exports.getPlatById = async (req, res) => {
  try {
    const plat = await Plat.findById(req.params.id);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé." });
    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /plats/:id  (avec upload.single("image"))
exports.updatePlat = async (req, res) => {

  try {
    const { nom, description, prix, categorie } = req.body;
    const plat = await Plat.findById(req.params.id);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé." });

    plat.nom = nom ?? plat.nom;
    plat.description = description ?? plat.description;
    plat.prix = typeof prix !== "undefined" ? prix : plat.prix;
    plat.categorie = categorie ?? plat.categorie;
    // si on upload une nouvelle image, on remplace l'URL
    if (req.file) {
      plat.imageUrl = buildImageUrl(req, req.file.filename);
    }

    const platSauvé = await plat.save();
    res.status(200).json(platSauvé);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /plats/:id
exports.deletePlat = async (req, res) => {
  try {
    const plat = await Plat.findByIdAndDelete(req.params.id);
    if (!plat) return res.status(404).json({ message: "Plat non trouvé." });
    res.status(200).json({ message: "Plat supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
