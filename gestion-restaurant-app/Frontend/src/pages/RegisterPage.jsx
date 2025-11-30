// src/pages/RegisterPage.jsx
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  MenuItem,
} from "@mui/material";
import axiosClient from "../api/axiosClient";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = ["Gérant", "Serveur", "Cuisinier"];

export default function RegisterPage() {
  const [nom, setNom] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("Gérant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // on va réutiliser login pour auto-connecter

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1) créer l'utilisateur
      await axiosClient.post("/utilisateurs", { nom, motDePasse, role });

      // 2) connexion auto après inscription
      await login(nom, motDePasse);

      // 3) redirection vers dashboard
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f0f2f5",
      }}
    >
      <Paper sx={{ p: 4, width: 380 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Créer un compte utilisateur
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom d'utilisateur"
            fullWidth
            margin="normal"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />

          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            margin="normal"
            required
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />

          <TextField
            select
            label="Rôle"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLES.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>

          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Création..." : "Créer le compte"}
          </Button>
        </form>

        <Typography variant="body2" mt={2} textAlign="center">
          Tu as déjà un compte ?{" "}
          <RouterLink to="/login">Se connecter</RouterLink>
        </Typography>
      </Paper>
    </Box>
  );
}
