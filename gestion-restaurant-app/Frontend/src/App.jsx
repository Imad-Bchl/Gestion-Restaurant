import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PlatsPage from "./pages/PlatsPage";
import MainLayout from "./layout/MainLayout";
import RegisterPage from "./pages/RegisterPage";
import StatsPage from "./pages/StatsPage";
import CommandesPage from "./pages/CommandesPage";
import CuisinePage from "./pages/CuisinePage";
import ServeurCommandesPage from "./pages/ServeurCommandesPage";
import ComptesPage from "./pages/ComptesPage"

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protégées */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/plats"
          element={
            <PrivateRoute>
              <MainLayout>
                <PlatsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/stats"
          element={
            <PrivateRoute>
              <MainLayout>
                <StatsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/Comptes"
          element={
            <PrivateRoute>
              <MainLayout>
                <ComptesPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Gérant : vue globale des commandes */}
        <Route
          path="/commandes"
          element={
            <PrivateRoute>
              <MainLayout>
                <CommandesPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Serveur : ses commandes */}
        <Route
          path="/commandes-serveur"
          element={
            <PrivateRoute>
              <MainLayout>
                <ServeurCommandesPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Cuisinier : commandes en préparation */}
        <Route
          path="/cuisine"
          element={
            <PrivateRoute>
              <MainLayout>
                <CuisinePage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
