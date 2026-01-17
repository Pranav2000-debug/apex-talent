import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "../../ui/PageLoader";

function ProtectedRoutes() {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast.error("Please sign in");
    }
  }, [isLoaded, isSignedIn]);
  // Show loading state while auth is checking
  if (!isLoaded) {
    return <PageLoader />;
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={{ user }} />;
}

export default ProtectedRoutes;
