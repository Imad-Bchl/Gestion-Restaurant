const mongoose = require('mongoose');


const ItemSchema = new mongoose.Schema({
    plat: { // Référence vers le Plat
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plat',
        required: true
    },
    nom: String, 
    quantite: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    prixUnitaire: Number 
}, { _id: false });

// Schéma de la Commande 
const CommandeSchema = new mongoose.Schema({
    numeroTable: {
        type: Number,
        required: true
    },
    serveur: { // Référence vers Utilisateur (pour agrégation F9)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    items: [ItemSchema], // Le tableau d'items imbriqués
    
    statut: { 
        type: String, 
        enum: ['Ouverte', 'En Préparation', 'Prête', 'Servie', 'Payée', 'Annulée'],
        default: 'Ouverte'
    },
    
    // Champs de date critiques pour l'agrégation F8 (Temps de Service) et F6 (CA)
    dateCreation: {
        type: Date,
        default: Date.now
    },
    dateService: Date, 
    datePaiement: Date, 

    montantTotal: Number // Montant calculé pour l'agrégation F6 et F9

}, { timestamps: true });

module.exports = mongoose.model('Commande', CommandeSchema);