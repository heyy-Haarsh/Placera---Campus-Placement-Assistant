import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import CampusPlacementApp from "./CampusPlacementApp";
import Hero from "./pages/Hero";
import AuthPage from "./pages/AuthPage";

// Guard: redirect to /auth if not logged in.
// Does NOT check role — CampusPlacementApp reads role from localStorage itself.
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!token || !user) return <Navigate to="/auth" replace />;
  return <CampusPlacementApp />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<Hero />} />
        <Route path="/auth" element={<AuthPage />} />

        {/*
          All 3 dashboard routes use the same CampusPlacementApp shell.
          Role is read from localStorage inside CampusPlacementApp — no mismatch possible.
        */}
        <Route path="/Student-Dashboard" element={<ProtectedRoute />} />
        <Route path="/Senior-Dashboard" element={<ProtectedRoute />} />
        <Route path="/Admin-Dashboard" element={<ProtectedRoute />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;