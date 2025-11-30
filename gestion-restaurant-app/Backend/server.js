// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

// Importation de TOUTES les routes
const platsRoutes = require('./routes/platRoutes');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const statsRoutes = require('./routes/statsRoutes'); 

app.use(express.json()); 
app.use(cors()); 

// =======================================================
// DÉCLARATION DES ROUTES API
// =======================================================
app.use('/api/plats', platsRoutes); 
app.use('/api/utilisateurs', utilisateurRoutes); 
app.use('/api/commandes', commandeRoutes); 
app.use('/api/stats', statsRoutes); 
app.get('/', (req, res) => {
    res.send('API Restaurant est en ligne...');
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// =======================================================
// CONNEXION À MONGODB
// =======================================================
const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log(' Connexion à MongoDB Atlas réussie !');
        
        app.listen(port, () => {
            console.log(`Serveur démarré sur http://localhost:${port}`);
        });

    } catch (error) {
        console.error(' Erreur de connexion à MongoDB :', error.message);
        process.exit(1); 
    }
}

connectDB();