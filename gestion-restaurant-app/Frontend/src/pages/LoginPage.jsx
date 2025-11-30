// src/pages/LoginPage.jsx
import { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import logo from "../assets/logo.png"; 

export default function LoginPage() {
  const [nom, setNom] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(nom, motDePasse);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur de connexion");
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
      <Paper sx={{ p: 4, width: 360, textAlign: "center" }}>
        {/*  Logo au-dessus du titre */}
        <Box
          component="img"
          src={logo}
          alt="Logo restaurant"
          sx={{
            width: 80,
            height: 80,
            borderRadius: 2,
            objectFit: "cover",
            mb: 2,
          }}
        />

        <Typography variant="h5" mb={2}>
          Connexion au restaurant
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom d'utilisateur"
            fullWidth
            margin="normal"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Se connecter
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
