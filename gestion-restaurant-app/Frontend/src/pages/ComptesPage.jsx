// src/pages/ComptesPage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axiosClient from "../api/axiosClient";

const ROLES = ["Gérant", "Serveur", "Cuisinier"];

export default function ComptesPage() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nom: "",
    motDePasse: "",
    role: "Serveur",
  });

  const loadUtilisateurs = async () => {
    try {
      setError("");
      const res = await axiosClient.get("/utilisateurs");
      setUtilisateurs(res.data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des comptes");
    }
  };

  useEffect(() => {
    loadUtilisateurs();
  }, []);

  const handleOpenDialog = () => {
    setForm({
      nom: "",
      motDePasse: "",
      role: "Serveur",
    });
    setError("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateCompte = async () => {
    try {
      setError("");

      if (!form.nom || !form.motDePasse) {
        setError("Tous les champs sont obligatoires");
        return;
      }

      await axiosClient.post("/utilisateurs", {
        nom: form.nom,
        motDePasse: form.motDePasse,
        role: form.role,
      });

      await loadUtilisateurs();
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Erreur lors de la création du compte"
      );
    }
  };

const handleDeleteCompte = async (id, nom) => {
  if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le compte de ${nom} ?`)) {
    return;
  }

  try {
    const response = await axiosClient.delete(`/utilisateurs/${id}`);
    console.log("✅ Réponse backend:", response.data); // LOG
    await loadUtilisateurs();
  } catch (err) {
    setError(
      err?.response?.data?.message || "Erreur lors de la suppression du compte"
    );
  }
};



  // Grouper par rôle
  const gerants = utilisateurs.filter((u) => u.role === "Gérant");
  const serveurs = utilisateurs.filter((u) => u.role === "Serveur");
  const cuisiniers = utilisateurs.filter((u) => u.role === "Cuisinier");

  return (
    <Box sx={{ bgcolor: "#f5f5f7", minHeight: "100vh", py: 4 }}>
      <Box sx={{ width: "80%", mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight={600}>
            Gestion des comptes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ borderRadius: 2 }}
          >
            Créer un compte
          </Button>
        </Box>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        {/* Liste des comptes par rôle */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Gérants */}
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Gérants ({gerants.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {gerants.length === 0 ? (
              <Typography color="text.secondary">Aucun gérant</Typography>
            ) : (
              <List>
                {gerants.map((u) => (
                  <ListItem
                    key={u._id}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: "white",
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleDeleteCompte(u._id, u.nom)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography fontWeight={500}>{u.nom}</Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          {/* Serveurs */}
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Serveurs ({serveurs.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {serveurs.length === 0 ? (
              <Typography color="text.secondary">Aucun serveur</Typography>
            ) : (
              <List>
                {serveurs.map((u) => (
                  <ListItem
                    key={u._id}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: "white",
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleDeleteCompte(u._id, u.nom)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography fontWeight={500}>{u.nom}</Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          {/* Cuisiniers */}
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Cuisiniers ({cuisiniers.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {cuisiniers.length === 0 ? (
              <Typography color="text.secondary">Aucun cuisinier</Typography>
            ) : (
              <List>
                {cuisiniers.map((u) => (
                  <ListItem
                    key={u._id}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: "white",
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleDeleteCompte(u._id, u.nom)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography fontWeight={500}>{u.nom}</Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Dialog Création de compte */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Créer un nouveau compte
          </Typography>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}
          <TextField
            label="Nom complet"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            label="Mot de passe"
            name="motDePasse"
            type="password"
            value={form.motDePasse}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Rôle"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            {ROLES.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreateCompte}
            sx={{ borderRadius: 2 }}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}