import { useState } from "react";
import Navbar from "../components/common/Navbar";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions.js";

import WelcomeSection from "../components/dashboardComps/WelcomeSection.jsx";
import ActiveSessions from "../components/dashboardComps/ActiveSessions.jsx";
import RecentSessions from "../components/dashboardComps/RecentSessions.jsx";
import CreateSessionModal from "../components/dashboardComps/CreateSessionModal.jsx";
import StatsCard from "../components/dashboardComps/StatsCard.jsx";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useOutletContext();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const activeSessions = activeSessionsData?.data?.sessions || [];
  const recentSessions = recentSessionsData?.data?.sessions || [];

  const createSessionMutation = useCreateSession();
  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;
    createSessionMutation.mutate(
      { problem: roomConfig.problem, difficulty: roomConfig.difficulty.toLowerCase() },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data?.data?.session._id}`);
        },
      },
    );
  };

  const isUserInSession = (session) => {
    if (!user.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        {/* Grid layout */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCard activeSessionsCount={activeSessions.length} recentSessionsCount={recentSessions.length} />
            <ActiveSessions sessions={activeSessions} isLoading={loadingActiveSessions} isUserInSession={isUserInSession} />
          </div>
          <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions}/>
        </div>
      </div>
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default Dashboard;
