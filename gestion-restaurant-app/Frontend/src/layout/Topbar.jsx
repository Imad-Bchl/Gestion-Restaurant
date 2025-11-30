// src/layout/Topbar.jsx
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  alpha,
  Container,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAuth } from "../context/AuthContext";
import { Link as RouterLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Topbar() {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isActive = (path) => location.pathname === path;

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleProfileClose();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        borderBottom: "1px solid #e0e0e0",
        color: "text.primary",
        paddingBottom: 1,
      }}
    >
      <Container maxWidth={false} sx={{ px: 4 }}>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo + titre cliquable vers le dashboard */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                gap: 1.5,
                "&:hover": { opacity: 0.8 },
                transition: "opacity 0.2s",
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Logo restaurant"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  objectFit: "cover",
                }}
              />
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Gestion Restaurant
              </Typography>
            </Box>

            {user && (
              <Box sx={{ display: "flex", gap: 1 }}>
                {/* Dashboard */}
                <NavButton to="/" label="Dashboard" active={isActive("/")} />

                {/* Plats (tout le monde) */}
                <NavButton
                  to="/plats"
                  label="Plats"
                  active={isActive("/plats")}
                />

                {/* Gérant + Serveur : commandes serveur */}
                {hasRole("Gérant", "Serveur") && (
                  <NavButton
                    to="/commandes-serveur"
                    label="Commandes"
                    active={isActive("/commandes-serveur")}
                  />
                )}

                {/* Gérant + Cuisinier : cuisine */}
                {hasRole("Gérant", "Cuisinier") && (
                  <NavButton
                    to="/cuisine"
                    label="Cuisine"
                    active={isActive("/cuisine")}
                  />
                )}

                {/* Gérant seulement : vue globale + stats */}
                {hasRole("Gérant") && (
                  <>
                    <NavButton
                      to="/commandes"
                      label="Historique"
                      active={isActive("/commandes")}
                    />
                    <NavButton
                      to="/stats"
                      label="Statistiques"
                      active={isActive("/stats")}
                    />
                    <NavButton
                      to="/Comptes"
                      label="Comptes"
                      active={isActive("/Comptes")}
                    />
                  </>
                )}
              </Box>
            )}
          </Box>

          {/* Profil + menu déconnexion */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user && (
              <>
                <Button
                  onClick={handleProfileClick}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: alpha("#1976d2", 0.08),
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: alpha("#1976d2", 0.12),
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 32,
                      height: 32,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {user.nom?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography variant="body2" fontWeight={600}>
                      {user.nom}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ lineHeight: 1 }}
                    >
                      {user.role}
                    </Typography>
                  </Box>
                  <KeyboardArrowDownIcon
                    sx={{
                      transition: "transform 0.2s",
                      transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleProfileClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                      overflow: "visible",
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 20,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: "error.main",
                      py: 1.5,
                      "&:hover": {
                        bgcolor: alpha("#d32f2f", 0.08),
                      },
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Déconnexion</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

/** Bouton de nav réutilisable avec style actif **/
function NavButton({ to, label, active }) {
  return (
    <Button
      component={RouterLink}
      to={to}
      sx={{
        color: active ? "primary.main" : "text.primary",
        fontWeight: active ? 600 : 500,
        px: 2,
        py: 1,
        borderRadius: 2,
        position: "relative",
        textTransform: "none",
        "&:hover": {
          bgcolor: alpha("#1976d2", 0.08),
        },
        "&::after": active
          ? {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: 3,
              bgcolor: "primary.main",
              borderRadius: "3px 3px 0 0",
            }
          : {},
      }}
    >
      {label}
    </Button>
  );
}
