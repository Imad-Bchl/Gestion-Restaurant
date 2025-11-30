// backend/controllers/utilisateurController.js

const Utilisateur = require('../models/Utilisateur');
const generateToken = require('../utils/generateToken');

// Inscription
exports.registerUtilisateur = async (req, res) => {
  try {
    const { nom, role, motDePasse } = req.body;

    // Vérifier si le nom est déjà pris
    const utilisateurExiste = await Utilisateur.findOne({ nom });
    if (utilisateurExiste) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris." });
    }

    // Création de l'utilisateur (hachage géré par le modèle)
    const utilisateur = await Utilisateur.create({ nom, role, motDePasse });

    if (!utilisateur) {
      return res.status(400).json({ message: 'Données utilisateur invalides.' });
    }

    const token = generateToken(utilisateur);

    return res.status(201).json({
      _id: utilisateur._id,
      nom: utilisateur.nom,
      role: utilisateur.role,
      token
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Connexion
exports.loginUtilisateur = async (req, res) => {
  try {
    const { nom, motDePasse } = req.body;

    // On récupère aussi le mot de passe pour la comparaison
    const utilisateur = await Utilisateur.findOne({ nom }).select('+motDePasse');

    if (!utilisateur) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe invalide." });
    }

    const isMatch = await utilisateur.matchPassword(motDePasse);
    if (!isMatch) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe invalide." });
    }

    const token = generateToken(utilisateur);

    return res.json({
      _id: utilisateur._id,
      nom: utilisateur.nom,
      role: utilisateur.role,
      token
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Liste de tous les utilisateurs (mot de passe exclu)
exports.getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find({}).select('-motDePasse');
    return res.status(200).json(utilisateurs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id);
    
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    await Utilisateur.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};