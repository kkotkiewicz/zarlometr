import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AnalyticsListener from "./components/AnalyticsListener";
import AppShell from "./components/layout/AppShell";
import PageTransition from "./components/PageTransition";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// App pages
import DashboardPage from "./pages/app/DashboardPage";
import JournalPage from "./pages/app/JournalPage";
import AddMealPage from "./pages/app/AddMealPage";
import RecipesPage from "./pages/app/RecipesPage";
import ProgressPage from "./pages/app/ProgressPage";
import OnboardingPage from "./pages/app/OnboardingPage";

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
      {/* ── Bez nawigacji ── */}
      <Route path="/login" element={
        <PublicRoute>
          <PageTransition><LoginPage /></PageTransition>
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <PageTransition><RegisterPage /></PageTransition>
        </PublicRoute>
      } />
      <Route path="/onboarding" element={
        <PrivateRoute>
          <PageTransition><OnboardingPage /></PageTransition>
        </PrivateRoute>
      } />

      {/* ── Z nawigacją (AppShell) ── */}
      <Route element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route path="/"              element={<PageTransition><DashboardPage /></PageTransition>} />
        <Route path="/journal"       element={<PageTransition><JournalPage /></PageTransition>} />
        <Route path="/journal/:date" element={<PageTransition><JournalPage /></PageTransition>} />
        <Route path="/add"           element={<PageTransition><AddMealPage /></PageTransition>} />
        <Route path="/recipes"       element={<PageTransition><RecipesPage /></PageTransition>} />
        <Route path="/progress"      element={<PageTransition><ProgressPage /></PageTransition>} />
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
        <AnalyticsListener />
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}
