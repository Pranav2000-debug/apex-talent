import { ArrowRightIcon, CheckIcon, Code2Icon, UsersIcon, VideoIcon, ZapIcon } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import { memo } from "react";
import Navbar from "../components/common//Navbar";

// Memoized hero image to prevent re-renders
const HeroImage = memo(() => (
  <img
    src="/hero_sunset.png"
    alt="CodeCollab Platform"
    className="w-full h-auto rounded-3xl shadow-2xl border-4 border-base-100 hover:scale-105 transition-transform duration-500"
    loading="lazy"
  />
));
HeroImage.displayName = "HeroImage";

// Memoized stats component
const Stats = memo(() => (
  <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg">
    <div className="stat">
      <div className="stat-value text-primary">10K+</div>
      <div className="stat-title">Active Users</div>
    </div>
    <div className="stat">
      <div className="stat-value text-secondary">50K+</div>
      <div className="stat-title">Sessions</div>
    </div>
    <div className="stat">
      <div className="stat-value text-accent">99.9%</div>
      <div className="stat-title">Uptime</div>
    </div>
  </div>
));
Stats.displayName = "Stats";

// Memoized feature card
// eslint-disable-next-line no-unused-vars
const FeatureCard = memo(({ icon: Icon, title, description }) => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body items-center text-center">
      <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="size-8 text-primary" />
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="text-base-content/70">{description}</p>
    </div>
  </div>
));
FeatureCard.displayName = "FeatureCard";

function HomePage() {
  return (
    <div className="bg-linear-to-br from-base-100 via-base-200 to-base-300">
      {/* 
        Navbar has its own internal suspense boundary for auth.
        The page content below renders immediately without waiting.
      */}
      <Navbar />

      {/* HERO SECTION - Renders immediately */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div className="badge badge-primary badge-lg">
              <ZapIcon className="size-4" />
              Real-time Collaboration
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Code Together,
              </span>
              <br />
              <span className="text-base-content">Learn Together</span>
            </h1>

            <p className="text-xl text-base-content/70 leading-relaxed max-w-xl">
              The ultimate platform for collaborative coding interviews and pair programming. Connect face-to-face, code in real-time, and ace your
              technical interviews.
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3">
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                Live Video Chat
              </div>
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                Code Editor
              </div>
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                Multi-Language
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-lg">
                  Start Coding Now
                  <ArrowRightIcon className="size-5" />
                </button>
              </SignInButton>

              <button className="btn btn-outline btn-lg">
                <VideoIcon className="size-5" />
                Watch Demo
              </button>
            </div>

            {/* STATS */}
            <Stats />
          </div>

          {/* RIGHT IMAGE with lazy loading */}
          <HeroImage />
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to <span className="text-primary font-mono">Succeed</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={VideoIcon}
            title="HD Video Call"
            description="Crystal clear video and audio for seamless communication during interviews"
          />
          <FeatureCard
            icon={Code2Icon}
            title="Live Code Editor"
            description="Collaborate in real-time with syntax highlighting and multiple language support"
          />
          <FeatureCard
            icon={UsersIcon}
            title="Easy Collaboration"
            description="Share your screen, discuss solutions, and learn from each other in real-time"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;