// src/pages/CuisinePage.jsx
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function CuisinePage() {
  const { user, hasRole } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [error, setError] = useState("");

  if (!hasRole("Gérant", "Cuisinier")) {
    return <Typography>Accès réservé au cuisinier / gérant.</Typography>;
  }

  const loadCommandes = async () => {
    try {
      setError("");
      const res = await axiosClient.get("/commandes");
      // On garde seulement "En Préparation"
      setCommandes(res.data.filter((c) => c.statut === "En Préparation"));
    } catch (err) {
      setError("Erreur lors du chargement des commandes.");
    }
  };

  useEffect(() => {
    loadCommandes();
  }, []);

  const updateStatut = async (id, statut) => {
    try {
      await axiosClient.put(`/commandes/${id}/statut`, { statut });
      await loadCommandes();
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut.");
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f7", minHeight: "100vh", py: 4, width: "100%", mx: "auto"  }}> 
      <Box sx={{ width: "80%", mx: "auto"  }}>
        <Typography variant="h4" fontWeight={600} marginBottom={3}>
          Cuisine – Commandes en préparation
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        {commandes.length === 0 ? (
          <Typography>Aucune commande en préparation.</Typography>
        ) : (
          commandes.map((c) => (
            <Paper key={c._id} sx={{ p: 2, mb: 2 }}>
              <Typography fontWeight={600}>
                Table {c.numeroTable} — {c.statut}
              </Typography>
              <Typography variant="body2">
                Serveur : {c.serveur?.nom} ({c.serveur?.role})
              </Typography>

              <Divider sx={{ my: 1 }} />

              {c.items?.map((item, i) => (
                <Typography key={i}>
                  {item.nom} x {item.quantite}
                </Typography>
              ))}

              <Typography fontWeight={600} sx={{ mt: 1 }}>
                Total : {c.montantTotal?.toFixed
                  ? c.montantTotal.toFixed(2)
                  : c.montantTotal}{" "}
                $
              </Typography>

              <Button
                variant="contained"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => updateStatut(c._id, "Prête")}
              >
                Marquer comme prête
              </Button>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  ); b
}
