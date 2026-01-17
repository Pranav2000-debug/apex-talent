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
import ProblemPage from "./pages/ProblemPage";
import SessionPage from "./pages/SessionPage";

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
            path="/problem/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProblemPage />
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

          <Route
            path="/session/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <SessionPage />
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
