import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Code2Icon } from "lucide-react";
import Navbar from "../components/common/Navbar";
import { PROBLEMS } from "../data/problems.js";
import { getDifficulty } from "../utils/getDifficulty.js";

// Memoized ProblemCard component to prevent unnecessary re-renders
const ProblemCard = memo(({ problem }) => {
  const difficultyBadge = getDifficulty(problem.difficulty);

  return (
    <Link to={`/problem/${problem.id}`} className="card bg-base-100 hover:scale-[1.01] transition-transform">
      <div className="card-body">
        <div className="flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Code2Icon className="size-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold">{problem.title}</h2>
                  <span className={`badge ${difficultyBadge}`}>{problem.difficulty}</span>
                </div>
                <p className="text-sm text-base-content/60">{problem.category}</p>
              </div>
            </div>
            <p className="text-base-content/80 mb-3">{problem.description.text}</p>
          </div>
          {/* Right */}
          <div className="flex items-center gap-2 text-primary">
            <span className="font-medium">solve</span>
            <ChevronRight className="size-5" />
          </div>
        </div>
      </div>
    </Link>
  );
});
ProblemCard.displayName = "ProblemCard";

// Memoized Stats component
const StatsCard = memo(({ total, easy, medium, hard }) => (
  <div className="mt-12 card bg-base-100 shadow-lg">
    <div className="card-body">
      <div className="stats stats-vertical lg:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Total Problems</div>
          <div className="stat-value text-primary">{total}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Easy Problems</div>
          <div className="stat-value text-success">{easy}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Medium Problems</div>
          <div className="stat-value text-warning">{medium}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Hard Problems</div>
          <div className="stat-value text-error">{hard}</div>
        </div>
      </div>
    </div>
  </div>
));
StatsCard.displayName = "StatsCard";

function ProblemsPage() {
  // Convert PROBLEMS object to array and memoize (static data doesn't change)
  const problems = useMemo(() => Object.values(PROBLEMS), []);

  // Memoize difficulty counts (only recalculates if problems change)
  const stats = useMemo(() => {
    return {
      total: problems.length,
      easy: problems.filter((p) => p.difficulty === "Easy").length,
      medium: problems.filter((p) => p.difficulty === "Medium").length,
      hard: problems.filter((p) => p.difficulty === "Hard").length,
    };
  }, [problems]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-base-content/70">Sharpen your coding skills and keyboard noises.</p>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>

        {/* Stats footer */}
        <StatsCard total={stats.total} easy={stats.easy} medium={stats.medium} hard={stats.hard} />
      </div>
    </div>
  );
}

export default ProblemsPage;
