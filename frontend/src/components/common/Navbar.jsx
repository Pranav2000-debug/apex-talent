import { UserButton, useUser } from "@clerk/clerk-react";
import { BookOpen, HomeIcon, LayoutDashboardIcon } from "lucide-react";
import { Suspense } from "react";
import { Link, useLocation } from "react-router-dom";

function AuthButton() {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  if (!isLoaded) {
    return <div className="skeleton h-10 w-32 rounded-xl"></div>;
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to={"/problems"}
          className={`px-4 py-2.5 rounded-lg transition-all duration-200 ${
            isActive("/problems") ? "bg-primary text-primary-content" : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
          }`}>
          <div className="flex items-center gap-2.5">
            <BookOpen className="size-4" />
            <span className="font-medium text-sm hidden sm:inline">Problems</span>
          </div>
        </Link>
        <Link
          to={"/dashboard"}
          className={`px-4 py-2.5 rounded-lg transition-all duration-200 ${
            isActive("/dashboard") ? "bg-primary text-primary-content" : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
          }`}>
          <div className="flex items-center gap-2.5">
            <LayoutDashboardIcon className="size-4" />
            <span className="font-medium text-sm hidden sm:inline">Dashboard</span>
          </div>
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

function Navbar() {
  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        <Link to={"/"} className="group flex items-center gap-3 hover:scale-105 transition-transform">
          <div className="size-10 rounded-xl bg-linear-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
            <HomeIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Apex Talent
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">noisy keyboard warriors</span>
          </div>
        </Link>
        <Suspense>
          <AuthButton />
        </Suspense>
      </div>
    </nav>
  );
}

export default Navbar;
