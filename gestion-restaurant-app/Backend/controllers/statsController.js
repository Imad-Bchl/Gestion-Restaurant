// backend/controllers/statsController.js

const Commande = require('../models/Commande'); 

// F6: Chiffre d'Affaires total par jour
exports.getChiffreAffaires = async (req, res) => {
    try {
        const pipeline = [
            { $match: { statut: 'Payée' } },
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$datePaiement" } },
                chiffreAffaires: { $sum: "$montantTotal" }, 
                nombreCommandes: { $sum: 1 } 
            }},
            { $sort: { _id: 1 } }
        ];
        const result = await Commande.aggregate(pipeline);
        res.status(200).json(result);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// F7: Plats les Plus Populaires
exports.getPopularPlats = async (req, res) => {
    try {
        const pipeline = [
            { $unwind: "$items" },
            { $group: {
                _id: "$items.plat", 
                nom: { $first: "$items.nom" }, 
                totalVendu: { $sum: "$items.quantite" } 
            }},
            { $sort: { totalVendu: -1 } },
            { $limit: 5 }
        ];
        const popularPlats = await Commande.aggregate(pipeline);
        res.status(200).json(popularPlats);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// F8: Temps de Service Moyen
exports.getAverageServiceTime = async (req, res) => {
    try {
        const pipeline = [
            { $match: { statut: 'Payée', datePaiement: { $exists: true }, dateCreation: { $exists: true } } },
            { $project: {
                // Calcul de la différence en millisecondes, puis division pour obtenir les minutes
                timeDifferenceMinutes: {
                    $divide: [{ $subtract: ["$datePaiement", "$dateCreation"] }, 1000 * 60] 
                }
            }},
            { $group: {
                _id: null,
                averageServiceTimeMinutes: { $avg: "$timeDifferenceMinutes" }
            }}
        ];
        const result = await Commande.aggregate(pipeline);
        res.status(200).json(result.length > 0 ? result[0] : { averageServiceTimeMinutes: 0 });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// F9: Performance des Serveurs
exports.getServerPerformance = async (req, res) => {
    try {
        const pipeline = [
            { $match: { statut: 'Payée' } },
            { $group: {
                _id: "$serveur",
                totalCA: { $sum: "$montantTotal" },
                totalOrders: { $sum: 1 }
            }},
            { $sort: { totalCA: -1 } },
            // Joindre avec la collection Utilisateur pour obtenir le nom
            { $lookup: {
                from: "utilisateurs", 
                localField: "_id",
                foreignField: "_id",
                as: "serveurInfo"
            }},
            { $unwind: "$serveurInfo" },
            { $project: {
                _id: 0,
                serveurId: "$_id",
                serveurNom: "$serveurInfo.nom",
                totalCA: 1,
                totalOrders: 1
            }}
        ];
        const result = await Commande.aggregate(pipeline);
        res.status(200).json(result);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// F10: Analyse des Ventes par Catégorie
exports.getSalesByCategory = async (req, res) => {
    try {
        const pipeline = [
            { $match: { statut: 'Payée' } },
            { $unwind: "$items" },
            // Joindre avec Plat pour obtenir la catégorie
            { $lookup: {
                from: "plats", 
                localField: "items.plat",
                foreignField: "_id",
                as: "platDetails"
            }},
            { $unwind: "$platDetails" },
            { $group: {
                _id: "$platDetails.categorie",
                totalRevenue: { $sum: { $multiply: ["$items.quantite", "$items.prixUnitaire"] } },
                totalQuantity: { $sum: "$items.quantite" }
            }},
            { $sort: { totalRevenue: -1 } }
        ];
        const result = await Commande.aggregate(pipeline);
        res.status(200).json(result);
    } catch (error) { res.status(500).json({ message: error.message }); }
};