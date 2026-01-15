import { Navigate, Route, Routes } from "react-router-dom";
import ProblemsPage from "./pages/ProblemsPage";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) {
    return <div>Loading</div>;
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
      </Routes>
      <Toaster toastOptions={{ duration: 2500 }} />
    </>
  );
}

export default App;

// todo: react query or tanstack query
