// Backend/middleware/roleMiddleware.js

function authorizeRoles(...rolesAutorises) {
    return (req, res, next) => {
      // Normalement, req.utilisateur est rempli par authMiddleware.protect
      if (!req.utilisateur) {
        return res.status(401).json({ message: 'Non authentifié.' });
      }
  
      if (!rolesAutorises.includes(req.utilisateur.role)) {
        return res.status(403).json({ message: 'Accès refusé.' });
      }
  
      next();
    };
  }
  
  module.exports = { authorizeRoles };
  