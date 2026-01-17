import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { useOutletContext } from "react-router-dom";

function WelcomeSection({ onCreateSession }) {
  const { user } = useOutletContext();

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <SparklesIcon className="size-6 text-white" />
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className="text-md text-base-content/60 ml-16">Ready to level up your coding skills?</p>
          </div>
          <button
            onClick={onCreateSession}
            className="group px-4 py-3 bg-gradient-to-r from-primary to-secondary rounded-2xl transition-all duration-200 hover:opacity-90">
            <div className="flex items-center gap-3 text-white font-bold text-md">
              <ZapIcon className="w-6 h-6" />
              <span>Create Session</span>
              <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
