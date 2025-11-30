// backend/models/Utilisateur.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UtilisateurSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true, 
        unique: true 
    },
    role: { 
        type: String, 
        enum: ['Gérant', 'Serveur', 'Cuisinier'], 
        default: 'Serveur' 
    },
    motDePasse: { 
        type: String, 
        required: true,
        select: false
    }
});

// Hachage du mot de passe AVANT sauvegarde
UtilisateurSchema.pre('save', async function () {
    if (!this.isModified('motDePasse')) return;

    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

// Méthode pour comparer les mots de passe
UtilisateurSchema.methods.matchPassword = async function (motDePasseEntre) {
    return await bcrypt.compare(motDePasseEntre, this.motDePasse);
};

module.exports = mongoose.model('Utilisateur', UtilisateurSchema);