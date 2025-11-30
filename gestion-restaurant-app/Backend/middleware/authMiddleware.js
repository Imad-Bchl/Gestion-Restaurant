// Backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

async function protect(req, res, next) {
  let token;

  // On attend un header Authorization: Bearer xxxxxx
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Récupérer le token
      token = req.headers.authorization.split(' ')[1];

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Chercher l'utilisateur en base (mot de passe exclu)
      req.utilisateur = await Utilisateur.findById(decoded.id).select('-motDePasse');

      if (!req.utilisateur) {
        return res.status(401).json({ message: 'Utilisateur introuvable.' });
      }

      return next();
    } catch (error) {
      console.error('Erreur auth:', error.message);
      return res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
  }

  return res.status(401).json({ message: 'Non autorisé, token manquant.' });
}

module.exports = { protect };
