// src/pages/CommandesPage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import axiosClient from "../api/axiosClient";


export default function CommandesPage() {
  const [commandes, setCommandes] = useState([]);
  const [plats, setPlats] = useState([]);

  const loadData = async () => {
    const resPlats = await axiosClient.get("/plats");
    setPlats(resPlats.data);

    const resCmd = await axiosClient.get("/commandes");
    setCommandes(resCmd.data);
  };

  useEffect(() => {
    loadData();
  }, []);


  // Séparer: payées à gauche, tout le reste à droite
  const commandesPayees = commandes.filter((c) => c.statut === "Payée").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const commandesEnCours = commandes.filter((c) => c.statut !== "Payée").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Box sx={{ bgcolor: "#f5f5f7", minHeight: "100vh", py: 4, width: "100%", mx: "auto"  }}> 
      <Box sx={{ width: "80%", mx: "auto"  }}>
        <Typography variant="h4" fontWeight={600} marginBottom={3}>
          Gestion des commandes
        </Typography>

        <Box sx={{ display: "flex", gap: 3}}>
          {/* COMMANDES EN COURS (tout sauf payées) */}
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6">Commandes en cours</Typography>
            <Divider sx={{ my: 1 }} />

            {commandesEnCours.length === 0 ? (
              <Typography>Aucune commande en cours.</Typography>
            ) : (
              commandesEnCours.map((c) => (
                <Box
                  key={c._id}
                  sx={{
                    borderBottom: "1px solid #ddd",
                    py: 1,
                    mb: 1,
                  }}
                >
                  <Typography fontWeight={600}>
                    Table {c.numeroTable} — {c.statut}
                  </Typography>

                  <Typography variant="body2">
                    Serveur : {c.serveur?.nom}
                  </Typography>

                  {c.items.map((item, i) => (
                    <Typography key={i}>
                      {item.nom} x {item.quantite} ={" "}
                      {(item.quantite * item.prixUnitaire).toFixed(2)}$
                    </Typography>
                  ))}

                  <Typography fontWeight={600}>
                    Total : {c.montantTotal.toFixed(2)}$
                  </Typography>
                </Box>
              ))
            )}
          </Paper>

          {/* COMMANDES ARCHIVÉES (payées uniquement) */}
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6">Commandes archivées (payées)</Typography>
            <Divider sx={{ my: 1 }} />

            {commandesPayees.length === 0 ? (
              <Typography>Aucune commande payée.</Typography>
            ) : (
              commandesPayees.map((c) => (
                <Box
                  key={c._id}
                  sx={{
                    borderBottom: "1px solid #ddd",
                    py: 1,
                    mb: 1,
                    opacity: 0.7,
                  }}
                >
                  <Typography fontWeight={600}>
                    Table {c.numeroTable} — {c.statut}
                  </Typography>

                  <Typography variant="body2">
                    Serveur : {c.serveur?.nom}
                  </Typography>

                  {c.items.map((item, i) => (
                    <Typography key={i}>
                      {item.nom} x {item.quantite} ={" "}
                      {(item.quantite * item.prixUnitaire).toFixed(2)}$
                    </Typography>
                  ))}

                  <Typography fontWeight={600}>
                    Total : {c.montantTotal.toFixed(2)}$
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
