// Backend/utils/generateToken.js

const jwt = require('jsonwebtoken');

function generateToken(utilisateur) {
  return jwt.sign(
    {
      id: utilisateur._id,
      role: utilisateur.role,
      nom: utilisateur.nom
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = generateToken;
