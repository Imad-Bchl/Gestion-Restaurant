// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  alpha,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReceiptIcon from "@mui/icons-material/Receipt";
import KitchenIcon from "@mui/icons-material/Kitchen";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

// ---------- COMPOSANT KPI CARD ----------
const KPICard = ({ title, value, subtitle, icon, color }) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
      color: "white",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
      },
    }}
  >
    <CardContent sx={{ position: "relative", zIndex: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            bgcolor: alpha("#fff", 0.2),
            borderRadius: 2,
            p: 1,
            display: "flex",
            mr: 1.5,
          }}
        >
          {icon}
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
    <Box
      sx={{
        position: "absolute",
        right: -20,
        bottom: -20,
        opacity: 0.1,
        fontSize: "120px",
      }}
    >
      {icon}
    </Box>
  </Card>
);

// ---------- COMPOSANT PRINCIPAL ----------
export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const [ca, setCa] = useState(null);
  const [avgTime, setAvgTime] = useState(null);
  const [nbPlats, setNbPlats] = useState(0);
  const [commandes, setCommandes] = useState([]);
  const [popular, setPopular] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setError("");

      const [caRes, avgRes, platsRes, cmdRes, popularRes] = await Promise.all([
        axiosClient.get("/stats/chiffre-affaires"),
        axiosClient.get("/stats/avg-service-time"),
        axiosClient.get("/plats"),
        axiosClient.get("/commandes"),
        axiosClient.get("/stats/popular-plats"),
      ]);

      const caArray = Array.isArray(caRes.data) ? caRes.data : [];
      const totalCA = caArray.reduce(
        (sum, row) => sum + (row.chiffreAffaires || 0),
        0
      );
      setCa({ total: totalCA });

      const avgData = avgRes.data;
      const avgMinutes =
        avgData && typeof avgData.averageServiceTimeMinutes === "number"
          ? avgData.averageServiceTimeMinutes
          : null;
      setAvgTime(avgMinutes);

      const plats = Array.isArray(platsRes.data) ? platsRes.data : [];
      setNbPlats(plats.length);

      const allCmd = Array.isArray(cmdRes.data) ? cmdRes.data : [];
      setCommandes(allCmd);

      setPopular(Array.isArray(popularRes.data) ? popularRes.data : []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement du dashboard.");
    }
  };

  const badgeColor = (statut) => {
    switch (statut) {
      case "En Préparation":
        return "warning";
      case "Prête":
        return "info";
      case "Servie":
        return "primary";
      case "Payée":
        return "success";
      case "Annulée":
        return "default";
      default:
        return "default";
    }
  };

  if (hasRole("Gérant")) {
    return (
      <ManagerDashboard
        ca={ca}
        avgTime={avgTime}
        nbPlats={nbPlats}
        commandes={commandes}
        popular={popular}
        error={error}
        badgeColor={badgeColor}
      />
    );
  }

  if (hasRole("Serveur")) {
    return (
      <ServeurDashboard
        user={user}
        avgTime={avgTime}
        commandes={commandes}
        error={error}
        badgeColor={badgeColor}
      />
    );
  }

  if (hasRole("Cuisinier")) {
    return <CuisinierDashboard commandes={commandes} error={error} badgeColor={badgeColor} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Dashboard
      </Typography>
      <Typography>Rôle non reconnu pour le dashboard.</Typography>
    </Box>
  );
}

// ---------- DASHBOARD GÉRANT ----------
function ManagerDashboard({ ca, avgTime, nbPlats, commandes, popular, error, badgeColor }) {
  const last5 = [...commandes]
    .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
    .slice(0, 5);

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            background: "black",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Tableau de bord
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vue d'ensemble des performances du restaurant
        </Typography>
      </Box>

      {error && (
        <Box sx={{ px: 4, mb: 3 }}>
          <Paper
            sx={{
              p: 2,
              bgcolor: "#ffebee",
              border: "1px solid #ef5350",
            }}
          >
            <Typography color="error">{error}</Typography>
          </Paper>
        </Box>
      )}

      {/* KPIs */}
      <Box sx={{ mb: 3, width: "100%", display: "flex", justifyContent: "center" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Chiffre d'affaires"
              value={
                ca && typeof ca.total === "number"
                  ? `${ca.total.toFixed(2)} $`
                  : "—"
              }
              icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
              color="#1976d2"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Commandes ouvertes"
              value={
                commandes.filter(
                  (c) => c.statut !== "Payée" && c.statut !== "Annulée"
                ).length
              }
              icon={<ReceiptIcon sx={{ fontSize: 28 }} />}
              color="#9c27b0"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Plats au menu"
              value={nbPlats}
              icon={<RestaurantMenuIcon sx={{ fontSize: 28 }} />}
              color="#ff9800"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Temps moyen"
              value={
                typeof avgTime === "number"
                  ? `${avgTime.toFixed(1)} min`
                  : "—"
              }
              subtitle="Temps de service"
              icon={<AccessTimeIcon sx={{ fontSize: 28 }} />}
              color="#4caf50"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Deux colonnes */}
      <Box sx={{ mb: 3, width: "100%", display: "flex", justifyContent: "center" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} width={415}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid #e0e0e0",
                height: 500,
                overflow: "auto",
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                Dernières commandes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {last5.length === 0 ? (
                <Typography color="text.secondary">
                  Aucune commande pour le moment.
                </Typography>
              ) : (
                <List dense>
                  {last5.map((c) => (
                    <ListItem
                      key={c._id}
                      sx={{
                        bgcolor: alpha("#1976d2", 0.05),
                        borderRadius: 2,
                        mb: 1,
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 0.5 }}>
                        <Typography fontWeight={600} sx={{ flex: 1 }}>
                          Table {c.numeroTable}
                        </Typography>
                        <Chip label={c.statut} color={badgeColor(c.statut)} size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {c.montantTotal?.toFixed
                          ? c.montantTotal.toFixed(2)
                          : c.montantTotal}{" "}
                        $ • Serveur : {c.serveur?.nom || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {c.dateCreation
                          ? new Date(c.dateCreation).toLocaleString()
                          : ""}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} width={415}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid #e0e0e0",
                height: 500,
                overflow: "auto",
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                Top plats populaires
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {popular.length === 0 ? (
                <Typography color="text.secondary">
                  Aucune donnée pour l'instant.
                </Typography>
              ) : (
                <List dense>
                  {popular.map((p) => (
                    <ListItem
                      key={p._id}
                      sx={{
                        bgcolor: alpha("#9c27b0", 0.05),
                        borderRadius: 2,
                        mb: 1,
                      }}
                    >
                      <ListItemText
                        primary={<Typography fontWeight={600}>{p.nom}</Typography>}
                        secondary={`${p.totalVendu} ventes`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

// ---------- DASHBOARD SERVEUR ----------
function ServeurDashboard({ user, avgTime, commandes, error, badgeColor }) {
  const commandesServeur = commandes.filter(
    (c) => c.serveur && c.serveur._id === user._id
  );

  const ouvertes = commandesServeur.filter(
    (c) => c.statut !== "Payée" && c.statut !== "Annulée"
  );

  const payees = commandesServeur.filter((c) => c.statut === "Payée");

  const caServeur = payees.reduce(
    (sum, c) => sum + (c.montantTotal || 0),
    0
  );

  const last5 = [...commandesServeur]
    .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
    .slice(0, 5);

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            background: "black",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Dashboard Serveur
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenue {user?.nom}
        </Typography>
      </Box>

      {error && (
        <Box sx={{ px: 4, mb: 3 }}>
          <Paper
            sx={{
              p: 2,
              bgcolor: "#ffebee",
              border: "1px solid #ef5350",
            }}
          >
            <Typography color="error">{error}</Typography>
          </Paper>
        </Box>
      )}

      {/* KPIs */}
      <Box sx={{ mb: 3, width: "100%", display: "flex", justifyContent: "center" }}>
        <Grid container spacing={3} >
          <Grid item xs={12} sm={6} md={3} width={200}>
            <KPICard
              title="Commandes ouvertes"
              value={ouvertes.length}
              icon={<ReceiptIcon sx={{ fontSize: 28 }} />}
              color="#9c27b0"
            />
          </Grid>

          <Grid item xs={12} md={4} width={200}>
            <KPICard
              title="Commandes payées"
              value={payees.length}
              icon={<DoneAllIcon sx={{ fontSize: 28 }} />}
              color="#4caf50"
            />
          </Grid>

          <Grid item xs={12} md={4} width={200}>
            <KPICard
              title="Mon CA"
              value={`${caServeur.toFixed(2)} $`}
              icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
              color="#1976d2"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Mes commandes + Infos */}
      <Box sx={{ mb: 3, width: "100%", display: "flex", justifyContent: "center" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} width={315}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid #e0e0e0",
                height: 420,
                overflow: "auto",
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                📋 Mes dernières commandes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {last5.length === 0 ? (
                <Typography color="text.secondary">
                  Aucune commande pour le moment.
                </Typography>
              ) : (
                <List dense>
                  {last5.map((c) => (
                    <ListItem
                      key={c._id}
                      sx={{
                        bgcolor: alpha("#9c27b0", 0.05),
                        borderRadius: 2,
                        mb: 1,
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 0.5 }}>
                        <Typography fontWeight={600} sx={{ flex: 1 }}>
                          Table {c.numeroTable}
                        </Typography>
                        <Chip label={c.statut} color={badgeColor(c.statut)} size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {c.montantTotal?.toFixed
                          ? c.montantTotal.toFixed(2)
                          : c.montantTotal}{" "}
                        $
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4} width={315}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid #e0e0e0",
                height: 420,
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                ℹ️ Infos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" mb={2}>
                <strong>Temps moyen de service :</strong>{" "}
                {typeof avgTime === "number"
                  ? `${avgTime.toFixed(1)} min`
                  : "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Utilise la page Commandes Serveur pour créer, modifier et
                clôturer tes commandes.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

// ---------- DASHBOARD CUISINIER ----------
function CuisinierDashboard({ commandes, error, badgeColor }) {
  const enPrep = commandes.filter((c) => c.statut === "En Préparation");
  const pretes = commandes.filter((c) => c.statut === "Prête");

  const totalPlatsEnPrep = enPrep.reduce((sum, c) => {
    const qte =
      c.items?.reduce((s, item) => s + (item.quantite || 0), 0) || 0;
    return sum + qte;
  }, 0);

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            background: "black",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Dashboard Cuisine
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestion des commandes en cours
        </Typography>
      </Box>

      {error && (
        <Box sx={{ px: 4, mb: 3 }}>
          <Paper
            sx={{
              p: 2,
              bgcolor: "#ffebee",
              border: "1px solid #ef5350",
            }}
          >
            <Typography color="error">{error}</Typography>
          </Paper>
        </Box>
      )}

      {/* KPIs */}
      <Box sx={{ mb: 3, width: "100%", display: "flex", justifyContent: "center" }}>
        <Grid container spacing={3} >
          <Grid item xs={12} sm={6} md={3} width={200}>
            <KPICard
              title="En préparation"
              value={enPrep.length}
              subtitle="Commandes"
              icon={<KitchenIcon sx={{ fontSize: 28 }} />}
              color="#ff9800"
            />
          </Grid>

          <Grid item xs={12} md={4} width={200}>
            <KPICard
              title="Prêtes"
              value={pretes.length}
              subtitle="Commandes"
              icon={<DoneAllIcon sx={{ fontSize: 28 }} />}
              color="#4caf50"
            />
          </Grid>

          <Grid item xs={12} md={4} width={200}>
            <KPICard
              title="Plats à préparer"
              value={totalPlatsEnPrep}
              icon={<RestaurantMenuIcon sx={{ fontSize: 28 }} />}
              color="#1976d2"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Listes */}
      <Box sx={{ mb: 3, width: "100%", display: "flex", justifyContent: "center" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} width={315}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid #e0e0e0",
                height: 420,
                overflow: "auto",
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                🔥 À préparer
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {enPrep.length === 0 ? (
                <Typography color="text.secondary">
                  Aucune commande en préparation.
                </Typography>
              ) : (
                <List dense>
                  {enPrep.map((c) => (
                    <ListItem
                      key={c._id}
                      sx={{
                        bgcolor: alpha("#ff9800", 0.05),
                        borderRadius: 2,
                        mb: 1,
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 0.5 }}>
                        <Typography fontWeight={600} sx={{ flex: 1 }}>
                          Table {c.numeroTable}
                        </Typography>
                        <Chip label={c.statut} color="warning" size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {c.items
                          ?.map((it) => `${it.nom} x ${it.quantite || 0}`)
                          .join(" • ")}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} width={315}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid #e0e0e0",
                height: 420,
                overflow: "auto",
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                ✅ Prêtes à servir
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {pretes.length === 0 ? (
                <Typography color="text.secondary">
                  Aucune commande prête.
                </Typography>
              ) : (
                <List dense>
                  {pretes.map((c) => (
                    <ListItem
                      key={c._id}
                      sx={{
                        bgcolor: alpha("#4caf50", 0.05),
                        borderRadius: 2,
                        mb: 1,
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 0.5 }}>
                        <Typography fontWeight={600} sx={{ flex: 1 }}>
                          Table {c.numeroTable}
                        </Typography>
                        <Chip label={c.statut} color="success" size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {c.items
                          ?.map((it) => `${it.nom} x ${it.quantite || 0}`)
                          .join(" • ")}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
