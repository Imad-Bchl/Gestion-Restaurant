// src/pages/PlatsPage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Entrée", "Plat", "Dessert", "Boisson"];

export default function PlatsPage() {
  const { hasRole } = useAuth();
  const [plats, setPlats] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie: "Plat",
    imageFile: null,   // fichier choisi sur le PC
    imageUrl: "",      // pour prévisualiser / voir l’ancienne image
  });

  const fetchPlats = async () => {
    try {
      setError("");
      const res = await axiosClient.get("/plats");
      setPlats(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Erreur de chargement des plats"
      );
    }
  };

  useEffect(() => {
    fetchPlats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      
    }));
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      nom: "",
      description: "",
      prix: "",
      categorie: "Plat",
      imageFile: null,
      imageUrl: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("description", form.description);
      formData.append("prix", form.prix);
      formData.append("categorie", form.categorie);
      
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      if (editId) {
        await axiosClient.put(`/plats/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosClient.post("/plats", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      await fetchPlats();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Erreur lors de l'enregistrement du plat"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plat) => {
    setEditId(plat._id);
    setForm({
      nom: plat.nom || "",
      description: plat.description || "",
      prix: plat.prix || "",
      categorie: plat.categorie || "Plat",
      imageFile: null,             
      imageUrl: plat.imageUrl || "", 
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce plat ?")) return;
    try {
      await axiosClient.delete(`/plats/${id}`);
      await fetchPlats();
    } catch (err) {
      setError("Erreur lors de la suppression du plat");
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f7", minHeight: "100vh", py: 4, width: "100%", mx: "auto"  }}> 
      <Box sx={{ width: "80%", mx: "auto"  }}>
        <Typography variant="h4" fontWeight={600} marginBottom={3}>
          Gestion des plats
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {/* Formulaire d'ajout / édition */}
          {hasRole("Gérant") && (
            <Paper sx={{ p: 2, flex: 1, minWidth: 320 }}>
              <Typography variant="h6" mb={1}>
                {editId ? "Modifier un plat" : "Ajouter un plat"}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Nom"
                  name="nom"
                  fullWidth
                  required
                  margin="normal"
                  value={form.nom}
                  onChange={handleChange}
                />

                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  margin="normal"
                  value={form.description}
                  onChange={handleChange}
                  multiline
                  minRows={2}
                />

                <TextField
                  label="Prix ($)"
                  name="prix"
                  type="number"
                  fullWidth
                  required
                  margin="normal"
                  value={form.prix}
                  onChange={handleChange}
                  inputProps={{ step: "0.01", min: "0" }}
                />

                <TextField
                  select
                  label="categorie"
                  name="categorie"
                  value={form.categorie}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Upload d'image depuis le PC */}
                <TextField
                  type="file"
                  fullWidth
                  margin="normal"
                  inputProps={{ accept: "image/*" }}
                  onChange={handleFileChange}
                />

                {/* Prévisualisation pour un plat existant */}
                {form.imageUrl && !form.imageFile && (
                  <Box
                    sx={{
                      mt: 2,
                      borderRadius: 1,
                      overflow: "hidden",
                      border: "1px solid #ddd",
                    }}
                  >
                    <Box
                      component="img"
                      src={form.imageUrl}
                      alt={form.nom || "Image du plat"}
                      sx={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button type="submit" variant="contained" disabled={loading}>
                    {loading
                      ? "Enregistrement..."
                      : editId
                      ? "Mettre à jour"
                      : "Enregistrer"}
                  </Button>
                  {editId && (
                    <Button variant="outlined" onClick={resetForm}>
                      Annuler
                    </Button>
                  )}
                </Box>
              </form>
            </Paper>
          )}

          {/* Liste des plats */}
          <Paper sx={{ p: 2, flex: 2, minWidth: 320 }}>
            <Typography variant="h6" mb={1}>
              Liste des plats
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {plats.length === 0 ? (
              <Typography>Aucun plat pour l'instant.</Typography>
            ) : (
              plats.map((plat) => (
                <Box
                  key={plat._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.5,
                    borderBottom: "1px solid #eee",
                    gap: 2,
                  }}
                >
                  {/* Image du plat */}
                  {plat.imageUrl && (
                    <Box
                      component="img"
                      src={plat.imageUrl}
                      alt={plat.nom}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}

                  {/* Infos texte */}
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600}>{plat.nom}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plat.categorie} — {plat.prix} $
                    </Typography>
                    {plat.description && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {plat.description}
                      </Typography>
                    )}
                  </Box>

                  {hasRole("Gérant") && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(plat)}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(plat._id)}
                      >
                        Supprimer
                      </Button>
                    </Box>
                  )}
                </Box>
              ))
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
