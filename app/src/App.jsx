import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppShell from "./components/layout/AppShell";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OnboardingPage from "./pages/auth/OnboardingPage";

import DashboardPage from "./pages/app/DashboardPage";
import JournalPage from "./pages/app/JournalPage";
import AddMealPage from "./pages/app/AddMealPage";
import RecipesPage from "./pages/app/RecipesPage";
import ProgressPage from "./pages/app/ProgressPage";

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}

function Router() {
  return (
    <Routes>
      {/* ── Without nav ── */}
      <Route path="/login"      element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register"   element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/onboarding" element={<PrivateRoute><OnboardingPage /></PrivateRoute>} />

      {/* ── WIth nav (AppShell) ── */}
      <Route element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route path="/"               element={<DashboardPage />} />
        <Route path="/journal"        element={<JournalPage />} />
        <Route path="/journal/:date"  element={<JournalPage />} />
        <Route path="/add"            element={<AddMealPage />} />
        <Route path="/recipes"        element={<RecipesPage />} />
        <Route path="/progress"       element={<ProgressPage />} />
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}
