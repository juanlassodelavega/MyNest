import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/home/Home";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import Dashboard from "../features/dashboard/Dashboard";
import Profile from "../features/profile/Profile";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
