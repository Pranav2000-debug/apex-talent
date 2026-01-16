import { Link } from "react-router-dom";
import { ArrowRightIcon, LayoutDashboardIcon, SparklesIcon } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Suspense } from "react";

// Auth button wrapper with suspense
function AuthButton() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="skeleton h-10 w-32 rounded-xl"></div>;
  }

  if (isSignedIn) {
    return (
      <div className="flex flex-row gap-4 items-center">
        <Link
          to="/dashboard"
          className="group px-4 py-2 bg-linear-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
          <LayoutDashboardIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
          <span>Dashboard</span>
        </Link>
        <div className="flex items-center hover:scale-105 p-0.5 bg-linear-to-r from-primary to-secondary rounded-full">
          <UserButton />
        </div>
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="group px-6 py-3 bg-linear-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
        <span>Get Started</span>
        <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </SignInButton>
  );
}

function HomeNavbar() {
  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-200">
          <div className="size-10 rounded-xl bg-linear-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
            <SparklesIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Apex Talent
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">noisy keyboard warriors</span>
          </div>
        </Link>

        {/* AUTH BTN with Suspense boundary */}
        <Suspense fallback={<div className="skeleton h-11 w-32 rounded-xl"></div>}>
          <AuthButton />
        </Suspense>
      </div>
    </nav>
  );
}

export default HomeNavbar;
