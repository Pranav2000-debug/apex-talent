import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";

// Only lazy load the heavy/protected pages
const ProblemsPage = lazy(() => import("./pages/ProblemsPage"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));

// Public Routes
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";

// Loading fallback component
import PageLoader from "./ui/PageLoader";

// Protected route wrapper that doesn't block initial render
import ProtectedRoutes from "./routes/protected/ProtectedRoutes";

function App() {
  return (
    <>
      <Routes>
        {/* Homepage loads immediately - no suspense needed */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route
            path="/problems"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProblemsPage />
              </Suspense>
            }
          />

          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>

      <Toaster toastOptions={{ duration: 2500 }} />
    </>
  );
}

export default App;
