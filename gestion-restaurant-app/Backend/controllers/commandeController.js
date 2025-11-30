// backend/controllers/commandeController.js

const Commande = require('../models/Commande');
const Plat = require('../models/Plat');

// F2: Créer une commande
exports.createCommande = async (req, res) => {
  try {
    const { numeroTable, serveurId, items } = req.body;
    if (!numeroTable || !serveurId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Données incomplètes.' });
    }

    let montantTotal = 0;
    const itemsAEnregistrer = [];

    // Vérification des items et calcul du total
    for (const item of items) {
      const plat = await Plat.findById(item.platId);
      if (!plat || !plat.disponible) {
        return res
          .status(404)
          .json({ message: `Le plat (ID: ${item.platId}) est indisponible.` });
      }
      montantTotal += plat.prix * item.quantite;

      itemsAEnregistrer.push({
        plat: plat._id,
        nom: plat.nom,
        quantite: item.quantite,
        prixUnitaire: plat.prix,
      });
    }

    const nouvelleCommande = await Commande.create({
      numeroTable,
      serveur: serveurId,
      items: itemsAEnregistrer,
      montantTotal: parseFloat(montantTotal.toFixed(2)),
      statut: 'En Préparation',          // statut initial
      dateCreation: Date.now(),
    });

    res.status(201).json(nouvelleCommande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// F3/F4: Mettre à jour le statut
exports.updateCommandeStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const commandeId = req.params.id;

    let updateData = { statut };
    if (statut === 'Servie') updateData.dateService = Date.now();
    if (statut === 'Payée') updateData.datePaiement = Date.now(); // F4: Clôture

    const commandeMiseAJour = await Commande.findByIdAndUpdate(
      commandeId,
      updateData,
      { new: true }
    );

    if (!commandeMiseAJour) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }
    res.status(200).json(commandeMiseAJour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour le contenu d'une commande (numéro de table + items)
// Utilisé par le serveur tant que la commande est "En Préparation"
exports.updateCommandeDetails = async (req, res) => {
  try {
    const commandeId = req.params.id;
    const { numeroTable, items } = req.body;

    if (!numeroTable || !items || items.length === 0) {
      return res.status(400).json({ message: 'Données incomplètes.' });
    }

    let montantTotal = 0;
    const itemsAEnregistrer = [];

    for (const item of items) {
      const plat = await Plat.findById(item.platId);
      if (!plat || !plat.disponible) {
        return res
          .status(404)
          .json({ message: `Le plat (ID: ${item.platId}) est indisponible.` });
      }
      montantTotal += plat.prix * item.quantite;

      itemsAEnregistrer.push({
        plat: plat._id,
        nom: plat.nom,
        quantite: item.quantite,
        prixUnitaire: plat.prix,
      });
    }

    const commande = await Commande.findById(commandeId);
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    // Protection du workflow : modif uniquement si En Préparation
    if (commande.statut !== 'En Préparation') {
      return res
        .status(400)
        .json({ message: 'La commande ne peut plus être modifiée.' });
    }

    commande.numeroTable = numeroTable;
    commande.items = itemsAEnregistrer;
    commande.montantTotal = parseFloat(montantTotal.toFixed(2));

    const commandeMiseAJour = await commande.save();
    res.status(200).json(commandeMiseAJour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lire TOUTES les commandes (tous statuts)
exports.getCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find({})
      .populate('serveur', 'nom role')
      .sort({ dateCreation: 1 });

    res.status(200).json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
