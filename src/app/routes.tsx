import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/home/Home";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import Dashboard from "../features/dashboard/Dashboard";
import Profile from "../features/profile/Profile";
import Header from "../components/Header";
import Footer from "../components/Footer"; // <-- Importa el footer

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        
        {/* Contenedor principal */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>

        {/* Footer siempre visible al final */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
