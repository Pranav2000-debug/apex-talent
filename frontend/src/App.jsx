import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";

// Only lazy load the heavy/protected pages
const ProblemsPage = lazy(() => import("./pages/ProblemsPage"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));

import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-base-100 via-base-200 to-base-300">
      <div className="text-center space-y-4">
        <div className="loading loading-spinner loading-xl text-primary"></div>
        <p className="text-base-content/60">Loading...</p>
      </div>
    </div>
  );
}

// Protected route wrapper that doesn't block initial render
function ProtectedRoutes() {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading state while auth is checking
  if (!isLoaded) {
    return <PageLoader />;
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <>
      <Routes>
        {/* Homepage loads immediately - no suspense needed */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route element={<ProtectedRoutes />}>
          {/* if needed add Suspense manually for lazy loaded routes */}
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>

      <Toaster toastOptions={{ duration: 2500 }} />
    </>
  );
}

export default App;
