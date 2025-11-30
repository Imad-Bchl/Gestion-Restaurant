// src/pages/StatsPage.jsx
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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import axiosClient from "../api/axiosClient";

// Recharts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#1976d2", "#9c27b0", "#ff9800", "#4caf50", "#e91e63"];

export default function StatsPage() {
  const [ca, setCa] = useState(null);
  const [popular, setPopular] = useState([]);
  const [avgTime, setAvgTime] = useState(null);
  const [servers, setServers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setError("");

      const [caRes, popularRes, avgRes, perfRes, catRes] = await Promise.all([
        axiosClient.get("/stats/chiffre-affaires"),
        axiosClient.get("/stats/popular-plats"),
        axiosClient.get("/stats/avg-service-time"),
        axiosClient.get("/stats/server-performance"),
        axiosClient.get("/stats/sales-by-category"),
      ]);

      const caArray = Array.isArray(caRes.data) ? caRes.data : [];
      const totalCA = caArray.reduce(
        (sum, row) => sum + (row.chiffreAffaires || 0),
        0
      );
      const totalCommandes = caArray.reduce(
        (sum, row) => sum + (row.nombreCommandes || 0),
        0
      );
      setCa({
        total: totalCA,
        parJour: caArray,
        totalCommandes,
      });

      const populaires = Array.isArray(popularRes.data) ? popularRes.data : [];
      setPopular(populaires);

      const avgData = avgRes.data;
      const avgMinutes =
        avgData && typeof avgData.averageServiceTimeMinutes === "number"
          ? avgData.averageServiceTimeMinutes
          : null;
      setAvgTime(avgMinutes);

      setServers(Array.isArray(perfRes.data) ? perfRes.data : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des statistiques");
    }
  };

  const caParJourData =
    ca?.parJour?.map((row) => ({
      date: row._id,
      total: row.chiffreAffaires || 0,
    })) || [];

  const categoriesPieData =
    categories.map((c) => ({
      name: c._id || "Sans catégorie",
      value: c.totalRevenue || 0,
    })) || [];

  const popularBarData =
    popular.map((p) => ({
      name: p.nom || "Inconnu",
      ventes: p.totalVendu || 0,
    })) || [];

  const serversBarData =
    servers.map((s) => ({
      name: s.serveurNom || "Serveur",
      ca: s.totalCA || 0,
    })) || [];

  const bestServer =
    servers.length > 0
      ? servers.reduce((max, s) =>
          (s.totalCA || 0) > (max.totalCA || 0) ? s : max
        )
      : null;

  const bestPlat =
    popular.length > 0
      ? popular.reduce((max, p) =>
          (p.totalVendu || 0) > (max.totalVendu || 0) ? p : max
        )
      : null;

  // Composant pour les KPI cards
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

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      {/* Container avec largeur fixe centrée */}
      <Box sx={{ width: 1400, maxWidth: "95%", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center"}}>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              background: "black",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Tableau de bord
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vue d'ensemble des performances du restaurant
          </Typography>
        </Box>

        {error && (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              bgcolor: "#ffebee",
              border: "1px solid #ef5350",
            }}
          >
            <Typography color="error">{error}</Typography>
          </Paper>
        )}

        {/* KPIs Cards - Ligne 1 */}
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
                subtitle={
                  ca?.parJour?.length
                    ? `${ca.parJour.length} jours • ${ca.totalCommandes || 0} commandes`
                    : null
                }
                icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
                color="#1976d2"
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
                color="#9c27b0"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Meilleur serveur"
                value={bestServer?.serveurNom || "—"}
                subtitle={
                  bestServer
                    ? `CA: ${bestServer.totalCA.toFixed(2)} $`
                    : null
                }
                icon={<EmojiEventsIcon sx={{ fontSize: 28 }} />}
                color="#ff9800"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Top plat"
                value={bestPlat?.nom || "—"}
                subtitle={
                  bestPlat ? `${bestPlat.totalVendu} ventes` : null
                }
                icon={<RestaurantIcon sx={{ fontSize: 28 }} />}
                color="#4caf50"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Détails texte - Ligne 2 */}
        <Box sx={{ mb: 3, width: "100%", display: "flex", justifyContent: "center"}}>
          <Grid container spacing={4} width={"full"}>
            <Grid item xs={12} width={400}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "white",
                  border: "1px solid #e0e0e0",
                  height: 320,
                  overflow: "auto",
                }}
              >
                <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                  Ventes par catégorie
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {categories.length === 0 ? (
                  <Typography color="text.secondary">Aucune donnée</Typography>
                ) : (
                  <List dense>
                    {categories.map((c) => (
                      <ListItem
                        key={c._id}
                        sx={{
                          bgcolor: alpha("#1976d2", 0.05),
                          borderRadius: 2,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography fontWeight={600}>
                              {c._id || "Sans catégorie"}
                            </Typography>
                          }
                          secondary={`${
                            c.totalRevenue?.toFixed
                              ? c.totalRevenue.toFixed(2)
                              : c.totalRevenue ?? 0
                          } $ • ${c.totalQuantity ?? 0} unités`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} width={400}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "white",
                  border: "1px solid #e0e0e0",
                  height: 320,
                  overflow: "auto",
                }}
              >
                <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                  Performance serveurs
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {servers.length === 0 ? (
                  <Typography color="text.secondary">Aucune donnée</Typography>
                ) : (
                  <List dense>
                    {servers.map((s, idx) => (
                      <ListItem
                        key={idx}
                        sx={{
                          bgcolor: alpha("#9c27b0", 0.05),
                          borderRadius: 2,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography fontWeight={600}>
                              {s.serveurNom || "Serveur inconnu"}
                            </Typography>
                          }
                          secondary={`${s.totalOrders ?? 0} commandes • ${
                            s.totalCA?.toFixed ? s.totalCA.toFixed(2) : s.totalCA ?? 0
                          } $`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Graphiques CA et Catégories - Ligne 3 */}
        <Box sx={{ mb: 3, width: "100%", display: "flex", justifyContent: "center"}}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} width={400}>
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    CA par jour
                  </Typography>
                  {caParJourData.length > 0 && (
                    <Chip
                      size="small"
                      label={`${caParJourData.length} jours`}
                      color="primary"
                    />
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={caParJourData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ReTooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="total"
                      name="CA ($)"
                      fill="#1976d2"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} width={400}>
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
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Répartition par catégorie
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoriesPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label
                    >
                      {categoriesPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ReTooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Graphiques Plats et Serveurs - Ligne 4 */}
        <Box sx={{ mb: 3, width: "100%", display: "flex", justifyContent: "center"}}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} width={400}>
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
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Plats populaires
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={popularBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ReTooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="ventes"
                      name="Ventes"
                      fill="#9c27b0"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} width={400}>
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
                <Typography variant="h6" fontWeight={600} mb={2}>
                  CA par serveur
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serversBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ReTooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="ca"
                      name="CA ($)"
                      fill="#4caf50"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
