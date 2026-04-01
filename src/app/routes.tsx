import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PrivateRoute from "../components/PrivateRoute";

const Home = lazy(() => import("../features/home/Home"));
const Login = lazy(() => import("../features/auth/Login"));
const Signup = lazy(() => import("../features/auth/Signup"));
const Dashboard = lazy(() => import("../features/dashboard/Dashboard"));
const Profile = lazy(() => import("../features/profile/Profile"));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <main style={{ flex: 1 }}>
          <Suspense
            fallback={
              <div style={{ padding: 24, textAlign: "center", color: "var(--ink-muted)" }}>
                Loading page...
              </div>
            }
          >
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
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
