import { useCallback, useEffect, useRef, useState } from "react";
import apiInstance from "../../instance";
import WhatsAppChatShell from "./WhatsAppChatShell";

const DoctorMessagesTab = ({ doctorData }) => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selectedIdRef = useRef(null);

  useEffect(() => {
    selectedIdRef.current = selectedThread?.appointmentId ?? null;
  }, [selectedThread?.appointmentId]);

  const loadThreads = useCallback(async () => {
    if (!doctorData?._id) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await apiInstance.get(`/chat/doctor/${doctorData._id}/threads`);
      const nextThreads = Array.isArray(data?.data) ? data.data : [];
      setThreads(nextThreads);
      setSelectedThread((current) => {
        if (current && nextThreads.some((thread) => thread.appointmentId === current.appointmentId)) {
          return nextThreads.find((thread) => thread.appointmentId === current.appointmentId);
        }
        return nextThreads[0] || null;
      });
    } catch (err) {
      console.error("Failed to load doctor chat threads", err);
      setError(err.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [doctorData?._id]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const handleIncomingMessage = useCallback((message) => {
    if (!message?.appointmentId) return;
    const isActive = selectedIdRef.current === message.appointmentId;
    const fromPatient = message.senderRole === "patient";
    setThreads((prev) => {
      const updated = prev.map((thread) => {
        if (thread.appointmentId !== message.appointmentId) return thread;
        return {
          ...thread,
          lastMessage: message,
          updatedAt: message.createdAt,
          unreadCount:
            fromPatient && !isActive
              ? (thread.unreadCount || 0) + 1
              : fromPatient && isActive
                ? 0
                : thread.unreadCount,
        };
      });
      updated.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
      return updated;
    });
    setSelectedThread((current) => {
      if (!current || current.appointmentId !== message.appointmentId) return current;
      return {
        ...current,
        lastMessage: message,
        updatedAt: message.createdAt,
        unreadCount: fromPatient ? 0 : current.unreadCount,
      };
    });
  }, []);

  const handleMessageSent = useCallback((message) => {
    setThreads((prev) => {
      const updated = prev.map((thread) =>
        thread.appointmentId === message.appointmentId
          ? { ...thread, lastMessage: message, updatedAt: message.createdAt }
          : thread
      );
      updated.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
      return updated;
    });
  }, []);

  const getThreadDisplayName = (thread) => thread.patientName || "Patient";

  const getThreadSubtitle = (thread) =>
    `${thread.date || ""}${thread.time ? ` at ${thread.time}` : ""}`.trim();

  return (
    <WhatsAppChatShell
      threads={threads}
      selectedThread={selectedThread}
      onSelectThread={setSelectedThread}
      loading={loading}
      error={error}
      onRefresh={loadThreads}
      currentRole="doctor"
      currentUserId={doctorData?._id}
      currentUserName={doctorData?.name || "Doctor"}
      doctorId={doctorData?._id}
      getThreadDisplayName={getThreadDisplayName}
      getThreadSubtitle={getThreadSubtitle}
      onMessageSent={handleMessageSent}
      onIncomingMessage={handleIncomingMessage}
      emptyStateText="No appointment chats yet."
      listTitle="Messages"
      listSubtitle="Patient conversations"
    />
  );
};

export default DoctorMessagesTab;
