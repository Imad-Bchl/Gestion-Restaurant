// src/layout/MainLayout.jsx
import { Box, Container } from "@mui/material";
import Topbar from "./Topbar";

export default function MainLayout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f2f5" }}>
      <Topbar />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
