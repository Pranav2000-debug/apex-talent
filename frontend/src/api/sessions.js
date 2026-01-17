import api from "./axios.js";

export const sessionApi = {
  createSession: async (data) => {
    const res = await api.post("/sessions", data);
    return res.data;
  },
  getActiveSessions: async () => {
    const res = await api.get("/sessions/active");
    return res.data;
  },
  getMyRecentSessions: async () => {
    const res = await api.get("/sessions/my-recent");
    return res.data;
  },
  getSessionById: async (id) => {
    const res = await api.get(`/sessions/${id}`, id);
    return res.data;
  },
  joinSession: async (id) => {
    const res = await api.post(`/sessions/${id}/join`);
    return res.data;
  },
  endSession: async (id) => {
    const res = await api.post(`/sessions/${id}/end`);
    return res.data;
  },
  getStreamToken: async () => {
    const res = await api.get(`/chat/token`);
    return res.data;
  },
};


