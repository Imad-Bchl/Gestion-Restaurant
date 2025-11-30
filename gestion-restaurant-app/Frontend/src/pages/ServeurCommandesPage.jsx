// src/pages/ServeurCommandesPage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function ServeurCommandesPage() {
  const { user, hasRole } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [plats, setPlats] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // null = création, id = édition

  const [form, setForm] = useState({
    numeroTable: "",
    items: [],
  });

  if (!hasRole("Gérant", "Serveur")) {
    return <Typography>Accès réservé au serveur / gérant.</Typography>;
  }

  const loadData = async () => {
    try {
      setError("");

      const resPlats = await axiosClient.get("/plats");
      setPlats(resPlats.data);

      const resCmd = await axiosClient.get("/commandes");
      const list = resCmd.data.filter(
        (c) => c.serveur && c.serveur._id === user._id
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCommandes(list);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des données.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ numeroTable: "", items: [] });
  };

  const addPlat = (platId) => {
    if (!platId) return;
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { platId, quantite: 1 }],
    }));
  };

  const updateQuantite = (index, quantite) => {
    setForm((prev) => {
      const updated = [...prev.items];
      updated[index].quantite = quantite < 1 ? 1 : quantite;
      return { ...prev, items: updated };
    });
  };

  const calculTotalForm = () => {
    return form.items.reduce((sum, item) => {
      const plat = plats.find((p) => p._id === item.platId);
      return sum + (plat?.prix || 0) * item.quantite;
    }, 0);
  };

  // Création ou modification
  const envoyerCommande = async () => {
    try {
      setError("");

      if (!form.numeroTable) {
        setError("Le numéro de table est obligatoire.");
        return;
      }
      if (form.items.length === 0) {
        setError("Ajoute au moins un plat à la commande.");
        return;
      }

      if (editingId) {
        // MODIFICATION
        await axiosClient.put(`/commandes/${editingId}`, {
          numeroTable: Number(form.numeroTable),
          items: form.items,
        });
      } else {
        // CRÉATION
        await axiosClient.post("/commandes", {
          numeroTable: Number(form.numeroTable),
          serveurId: user._id,
          items: form.items,
        });
      }

      resetForm();
      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Erreur lors de l'enregistrement de la commande."
      );
    }
  };

  const updateStatut = async (id, statut) => {
    try {
      await axiosClient.put(`/commandes/${id}/statut`, { statut });
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour du statut.");
    }
  };

  // Charger une commande dans le formulaire pour la modifier
  const startEditCommande = (commande) => {
    // On ne permet la modif que si En Préparation
    if (commande.statut !== "En Préparation") {
      setError("La commande ne peut plus être modifiée (déjà prête ou servie).");
      return;
    }

    setEditingId(commande._id);
    setForm({
      numeroTable: String(commande.numeroTable),
      items: (commande.items || []).map((item) => ({
        platId: item.plat, // c.items[].plat = ObjectId
        quantite: item.quantite,
      })),
    });
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f7", minHeight: "100vh", py: 4, width: "100%", mx: "auto"  }}> 
      <Box sx={{ width: "80%", mx: "auto"  }}>
        <Typography variant="h4" fontWeight={600} marginBottom={3} >
          Espace serveur — Mes commandes
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {/* FORMULAIRE NOUVELLE / MODIF COMMANDE */}
          <Paper sx={{ p: 2, flex: 1, minWidth: 320 }}>
            <Typography variant="h6">
              {editingId ? "Modifier la commande" : "Nouvelle commande"}
            </Typography>
            <Divider sx={{ my: 1 }} />

            <TextField
              label="Numéro de table"
              fullWidth
              type="number"
              value={form.numeroTable}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, numeroTable: e.target.value }))
              }
              sx={{ mb: 2 }}
            />

            <TextField
              select
              label="Ajouter un plat"
              fullWidth
              value=""
              onChange={(e) => addPlat(e.target.value)}
              sx={{ mb: 2 }}
            >
              {plats.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.nom} — {p.prix} $
                </MenuItem>
              ))}
            </TextField>

            {form.items.length > 0 && (
              <List>
                {form.items.map((item, index) => {
                  const plat = plats.find((p) => p._id === item.platId);
                  return (
                    <ListItem key={index} sx={{ gap: 2 }}>
                      <ListItemText
                        primary={plat?.nom || "Plat inconnu"}
                        secondary={`${plat?.prix || 0} $`}
                      />
                      <TextField
                        type="number"
                        label="Qté"
                        value={item.quantite}
                        onChange={(e) =>
                          updateQuantite(index, Number(e.target.value))
                        }
                        sx={{ width: 80 }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}

            <Typography variant="h6" sx={{ mt: 2 }}>
              Total estimé : {calculTotalForm().toFixed(2)} $
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={envoyerCommande}
            >
              {editingId ? "Enregistrer les modifications" : "Enregistrer la commande"}
            </Button>

            {editingId && (
              <Button
                variant="text"
                fullWidth
                sx={{ mt: 1 }}
                onClick={resetForm}
              >
                Annuler la modification
              </Button>
            )}
          </Paper>

          {/* LISTE DES COMMANDES DU SERVEUR */}
          <Paper sx={{ p: 2, flex: 1, minWidth: 320 }}>
            <Typography variant="h6">Mes commandes</Typography>
            <Divider sx={{ my: 1 }} />

            {commandes.length === 0 ? (
              <Typography>Aucune commande.</Typography>
            ) : (
              commandes.map((c) => (
                <Paper key={c._id} sx={{ p: 2, mb: 2 }} variant="outlined">
                  <Typography fontWeight={600}>
                    Table {c.numeroTable} — {c.statut}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  {c.items?.map((item, i) => (
                    <Typography key={i}>
                      {item.nom} x {item.quantite} ={" "}
                      {(item.quantite * item.prixUnitaire).toFixed(2)} $
                    </Typography>
                  ))}

                  <Typography fontWeight={600} sx={{ mt: 1 }}>
                    Total :{" "}
                    {c.montantTotal?.toFixed
                      ? c.montantTotal.toFixed(2)
                      : c.montantTotal}{" "}
                    $
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                    {/* Modifier seulement si En Préparation */}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => startEditCommande(c)}
                      disabled={c.statut !== "En Préparation"}
                    >
                      Modifier
                    </Button>

                    {/* Servie seulement si Prête */}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => updateStatut(c._id, "Servie")}
                      disabled={c.statut !== "Prête"}
                    >
                      Marquer servie
                    </Button>

                    {/* Payée seulement si Servie */}
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => updateStatut(c._id, "Payée")}
                      disabled={c.statut !== "Servie"}
                    >
                      Marquer payée
                    </Button>
                  </Box>
                </Paper>
              ))
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
