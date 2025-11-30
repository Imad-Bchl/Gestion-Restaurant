const mongoose = require('mongoose');

const PlatSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom du plat est obligatoire."],
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    prix: {
      type: Number,
      required: [true, "Le prix est obligatoire."],
      min: 0,
    },

    categorie: {
      // Champ crucial pour l'agrégation F10
      type: String,
      enum: ["Entrée", "Plat", "Dessert", "Boisson"],
      default: "Plat",
    },

    // ⚠ NOUVEAU : chemin de l'image uploadée (ex: /uploads/plat_123.jpg)
    imageUrl: {
      type: String,
      trim: true,
    },

    disponible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plat", PlatSchema);
