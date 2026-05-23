import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, AlertCircle, RefreshCw, RotateCcw, Send } from "lucide-react";
import apiInstance from "../../instance";
import { WS_BASE_URL } from "../../config/api";
import MessageStatus from "./MessageStatus";
import {
  upsertMessage,
  formatBubbleTime,
  formatDateSeparator,
  getDateKey,
} from "./chatUtils";

const TYPING_DEBOUNCE_MS = 400;
const NEAR_BOTTOM_PX = 80;
/** Poll when WebSocket unavailable (e.g. Vercel serverless). */
const CHAT_POLL_MS = 3000;

function markMessagesReadByRole(messages, role) {
  const flag = role === "doctor" ? "readByDoctor" : "readByPatient";
  return messages.map((item) =>
    item.senderRole !== role ? { ...item, [flag]: true } : item
  );
}

function markOwnMessagesReadByOther(messages, otherRole) {
  const flag = otherRole === "doctor" ? "readByDoctor" : "readByPatient";
  return messages.map((item) =>
    item.senderRole === otherRole ? item : { ...item, [flag]: true }
  );
}

const AppointmentChat = ({
  appointmentId,
  currentRole,
  currentUserId,
  currentUserName,
  doctorId,
  patientEmail,
  title,
  subtitle,
  compact = false,
  hideHeader = false,
  onBack,
  onMessageSent,
  onIncomingMessage,
  onMarkedRead,
}) => {
  const roomId = appointmentId ? String(appointmentId) : "";
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [otherTyping, setOtherTyping] = useState(false);
  const wsRef = useRef(null);
  const wsConnectedRef = useRef(false);
  const reconnectRef = useRef(null);
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingClearRef = useRef(null);
  const typingDebounceRef = useRef(null);
  const nearBottomRef = useRef(true);

  const queryParams = useMemo(() => {
    const params = { role: currentRole };
    if (currentRole === "doctor" && doctorId) params.doctorId = doctorId;
    if (currentRole === "patient" && patientEmail) {
      params.patientEmail = patientEmail;
    }
    return params;
  }, [currentRole, doctorId, patientEmail]);

  const otherRole = currentRole === "doctor" ? "patient" : "doctor";

  const scrollToBottom = useCallback((behavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  const checkNearBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
  }, []);

  const markRead = useCallback(async () => {
    if (!roomId) return;
    try {
      const { data } = await apiInstance.patch(`/chat/appointment/${roomId}/read`, {
        role: currentRole,
        doctorId,
        ...(currentRole === "patient" && patientEmail ? { patientEmail } : {}),
      });
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "chat:read",
            appointmentId: roomId,
            role: currentRole,
          })
        );
      }
      setMessages((prev) => markMessagesReadByRole(prev, otherRole));
      onMarkedRead?.(roomId);
      return data;
    } catch (err) {
      console.error("Failed to mark chat read", err);
    }
    return null;
  }, [roomId, currentRole, doctorId, otherRole, onMarkedRead]);

  const syncMessages = useCallback(
    async ({ showLoading = false } = {}) => {
      if (!roomId) return;
      if (showLoading) {
        setLoading(true);
        setError("");
      }
      try {
        const { data } = await apiInstance.get(`/chat/appointment/${roomId}`, {
          params: queryParams,
        });
        const incoming = Array.isArray(data?.data) ? data.data : [];
        setMessages((prev) => {
          const pending = prev.filter((m) => m._pending);
          let merged = prev.filter((m) => !m._pending);
          incoming.forEach((msg) => {
            merged = upsertMessage(merged, msg);
          });
          return [...merged, ...pending];
        });
        await markRead();
      } catch (err) {
        console.error("Failed to load chat", err);
        if (showLoading) {
          setError(err.response?.data?.message || "Failed to load messages");
        }
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [roomId, queryParams, markRead]
  );

  const loadMessages = useCallback(
    () => syncMessages({ showLoading: true }),
    [syncMessages]
  );

  useEffect(() => {
    setMessages([]);
    loadMessages();
  }, [roomId, loadMessages]);

  useEffect(() => {
    if (!roomId || !currentRole) return undefined;
    const poll = () => {
      if (wsConnectedRef.current) return;
      syncMessages({ showLoading: false });
    };
    const id = setInterval(poll, CHAT_POLL_MS);
    return () => clearInterval(id);
  }, [roomId, currentRole, syncMessages]);

  useEffect(() => {
    if (nearBottomRef.current) {
      scrollToBottom(messages.length <= 1 ? "auto" : "smooth");
    }
  }, [messages.length, scrollToBottom]);

  const emitTyping = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN || !roomId) return;
    wsRef.current.send(
      JSON.stringify({
        type: "chat:typing",
        appointmentId: roomId,
        role: currentRole,
        userId: currentUserId,
      })
    );
  }, [roomId, currentRole, currentUserId]);

  useEffect(() => {
    if (!roomId || !currentRole) return undefined;
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      const params = new URLSearchParams({
        chat: "1",
        appointmentId: roomId,
        role: currentRole,
        userId: currentUserId || `${currentRole}-${Date.now()}`,
        username: currentUserName || currentRole,
      });
      const socket = new WebSocket(`${WS_BASE_URL}?${params.toString()}`);
      wsRef.current = socket;

      socket.onopen = () => {
        wsConnectedRef.current = true;
        socket.send(
          JSON.stringify({
            type: "chat:join",
            appointmentId: roomId,
            role: currentRole,
            userId: currentUserId,
          })
        );
      };

      socket.onerror = () => {
        wsConnectedRef.current = false;
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.appointmentId && String(payload.appointmentId) !== roomId) return;

          if (payload.type === "chat:message" && payload.message) {
            const incoming = payload.message;
            setMessages((prev) => {
              const withoutTemp = prev.filter(
                (m) =>
                  !m._pending ||
                  m.message !== incoming.message ||
                  m.senderRole !== incoming.senderRole
              );
              return upsertMessage(withoutTemp, incoming);
            });
            if (incoming.senderRole !== currentRole) {
              markRead();
            }
            onIncomingMessage?.(incoming);
            if (nearBottomRef.current) {
              requestAnimationFrame(() => scrollToBottom());
            }
            return;
          }

          if (payload.type === "chat:typing" && payload.role !== currentRole) {
            setOtherTyping(true);
            if (typingClearRef.current) clearTimeout(typingClearRef.current);
            typingClearRef.current = setTimeout(() => setOtherTyping(false), 3000);
            return;
          }

          if (payload.type === "chat:read" && payload.role !== currentRole) {
            setMessages((prev) => markOwnMessagesReadByOther(prev, payload.role));
          }
        } catch (err) {
          console.error("Invalid chat websocket payload", err);
        }
      };

      socket.onclose = () => {
        wsConnectedRef.current = false;
        if (cancelled) return;
        reconnectRef.current = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      cancelled = true;
      wsConnectedRef.current = false;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (typingClearRef.current) clearTimeout(typingClearRef.current);
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
      wsRef.current?.close();
    };
  }, [
    roomId,
    currentRole,
    currentUserId,
    currentUserName,
    markRead,
    onIncomingMessage,
    scrollToBottom,
  ]);

  const handleDraftChange = (event) => {
    const value = event.target.value;
    setDraft(value);
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    if (value.trim()) {
      typingDebounceRef.current = setTimeout(emitTyping, TYPING_DEBOUNCE_MS);
    }
  };

  const sendMessage = async (text, tempId = null) => {
    if (!text || !roomId) return;

    const optimisticId = tempId || `temp-${Date.now()}`;
    if (!tempId) {
      const optimistic = {
        _id: optimisticId,
        appointmentId: roomId,
        senderRole: currentRole,
        senderName: currentUserName,
        message: text,
        createdAt: new Date().toISOString(),
        _pending: true,
        readByDoctor: currentRole === "doctor",
        readByPatient: currentRole === "patient",
      };
      setMessages((prev) => upsertMessage(prev, optimistic));
      setDraft("");
      nearBottomRef.current = true;
      scrollToBottom("auto");
    } else {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId ? { ...m, _pending: true, _failed: false } : m
        )
      );
    }

    setSending(true);
    setError("");
    try {
      const { data } = await apiInstance.post(`/chat/appointment/${roomId}`, {
        senderRole: currentRole,
        senderName: currentUserName,
        doctorId,
        message: text,
        ...(currentRole === "patient" && patientEmail ? { patientEmail } : {}),
      });
      if (data?.success && data.data) {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m._id !== optimisticId);
          return upsertMessage(filtered, data.data);
        });
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "chat:message",
              appointmentId: roomId,
              message: data.data,
            })
          );
        }
        onMessageSent?.(data.data);
        onIncomingMessage?.(data.data);
      }
    } catch (err) {
      console.error("Failed to send chat message", err);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === optimisticId ? { ...m, _pending: false, _failed: true } : m
        )
      );
      setError(err.response?.data?.message || "Failed to send message");
      if (!tempId) setDraft(text);
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || sending) return;
    sendMessage(text);
  };

  const handleRetry = (message) => {
    if (!message?._failed) return;
    sendMessage(message.message, message._id);
  };

  const groupedMessages = useMemo(() => {
    const groups = [];
    let lastDateKey = null;
    messages.forEach((item) => {
      const key = getDateKey(item.createdAt);
      if (key !== lastDateKey) {
        groups.push({ type: "separator", key, label: formatDateSeparator(item.createdAt) });
        lastDateKey = key;
      }
      groups.push({ type: "message", item });
    });
    return groups;
  }, [messages]);

  if (!roomId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#f0f2f5] p-6 text-center text-sm text-[#667781]">
        Select an appointment to start messaging.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#e5ddd5]">
      {!hideHeader && (
        <div className="flex shrink-0 items-center gap-2 border-b border-[#e9edef] bg-[#f0f2f5] px-3 py-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full p-2 text-[#54656f] hover:bg-[#e9edef] md:hidden"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-medium text-[#111b21]">{title || "Chat"}</h3>
            {otherTyping ? (
              <p className="text-xs text-[#25d366]">typing...</p>
            ) : (
              subtitle && <p className="truncate text-xs text-[#667781]">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={loadMessages}
            className="rounded-full p-2 text-[#54656f] hover:bg-[#e9edef]"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={() => {
          nearBottomRef.current = checkNearBottom();
        }}
        className={`relative min-h-0 flex-1 overflow-y-auto px-3 py-2 ${
          compact ? "max-h-[360px]" : ""
        }`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc4' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
        {loading && (
          <p className="py-4 text-center text-sm text-[#667781]">Loading messages...</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="py-8 text-center text-sm text-[#667781]">No messages yet. Say hello!</p>
        )}
        <div className="space-y-1">
          {groupedMessages.map((entry) => {
            if (entry.type === "separator") {
              return (
                <div key={`sep-${entry.key}`} className="my-3 flex justify-center">
                  <span className="rounded-lg bg-[#ffffffcc] px-3 py-1 text-xs text-[#54656f] shadow-sm">
                    {entry.label}
                  </span>
                </div>
              );
            }
            const item = entry.item;
            const mine = item.senderRole === currentRole;
            return (
              <div
                key={item._id}
                className={`flex ${mine ? "justify-end" : "justify-start"} py-0.5`}
              >
                <div
                  className={`relative max-w-[85%] rounded-lg px-2.5 py-1.5 shadow-sm ${
                    mine
                      ? "rounded-tr-none bg-[#d9fdd3] text-[#111b21]"
                      : "rounded-tl-none bg-white text-[#111b21]"
                  } ${item._failed ? "opacity-80" : ""}`}
                >
                  <p className="whitespace-pre-wrap break-words text-[14.2px] leading-[19px]">
                    {item.message}
                  </p>
                  <div
                    className={`mt-0.5 flex items-center justify-end gap-0.5 text-[11px] text-[#667781]`}
                  >
                    <span>{formatBubbleTime(item.createdAt)}</span>
                    {mine && <MessageStatus message={item} currentRole={currentRole} />}
                  </div>
                  {item._failed && (
                    <button
                      type="button"
                      onClick={() => handleRetry(item)}
                      className="mt-1 flex items-center gap-1 text-xs text-red-600 hover:underline"
                    >
                      <RotateCcw size={12} />
                      Retry
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {error && (
        <div className="flex shrink-0 items-center gap-2 border-t border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="flex shrink-0 items-end gap-2 bg-[#f0f2f5] px-2 py-2">
        <textarea
          value={draft}
          onChange={handleDraftChange}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message"
          rows={1}
          className="max-h-28 flex-1 resize-none rounded-lg border-0 bg-white px-3 py-2.5 text-sm text-[#111b21] outline-none focus:ring-1 focus:ring-[#25d366]"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!draft.trim() || sending}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white hover:bg-[#20bd5a] disabled:cursor-not-allowed disabled:bg-[#aebac1]"
          title="Send"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AppointmentChat;
