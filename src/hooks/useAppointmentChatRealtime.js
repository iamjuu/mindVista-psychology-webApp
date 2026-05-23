import { useEffect, useRef } from "react";
import { WS_BASE_URL } from "../config/api";
import { useInterval } from "./useInterval";

const THREAD_POLL_MS = 4000;

/**
 * WebSocket for live chat + HTTP polling fallback (needed when WS host is unavailable, e.g. Vercel).
 */
export function useAppointmentChatRealtime({
  enabled = false,
  appointmentIds = [],
  currentRole,
  currentUserId,
  currentUserName,
  skipAppointmentId = null,
  onMessage,
  onPoll,
}) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;
  const onPollRef = useRef(onPoll);
  onPollRef.current = onPoll;
  const anyWsConnectedRef = useRef(false);

  useInterval(
    () => {
      if (!anyWsConnectedRef.current) {
        onPollRef.current?.();
      }
    },
    THREAD_POLL_MS,
    enabled
  );

  useEffect(() => {
    if (!enabled || !currentRole) return undefined;

    const skipId = skipAppointmentId ? String(skipAppointmentId) : null;
    const ids = [...new Set(appointmentIds.map(String).filter(Boolean))].filter(
      (id) => id !== skipId
    );

    if (ids.length === 0) return undefined;

    let wsOpenCount = 0;
    const setWsConnected = () => {
      anyWsConnectedRef.current = wsOpenCount > 0;
    };

    const sockets = ids.map((appointmentId) => {
      const params = new URLSearchParams({
        chat: "1",
        appointmentId,
        role: currentRole,
        userId: currentUserId || `${currentRole}-${Date.now()}`,
        username: currentUserName || currentRole,
      });
      const socket = new WebSocket(`${WS_BASE_URL}?${params.toString()}`);

      socket.onopen = () => {
        wsOpenCount += 1;
        setWsConnected();
        socket.send(
          JSON.stringify({
            type: "chat:join",
            appointmentId,
            role: currentRole,
            userId: currentUserId,
          })
        );
      };

      socket.onerror = () => {
        if (socket.readyState !== WebSocket.OPEN) {
          wsOpenCount = Math.max(0, wsOpenCount - 1);
          setWsConnected();
        }
      };

      socket.onclose = () => {
        wsOpenCount = Math.max(0, wsOpenCount - 1);
        setWsConnected();
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "chat:message" && payload.message) {
            onMessageRef.current?.(payload.message);
          }
        } catch (err) {
          console.error("Invalid chat realtime payload", err);
        }
      };

      return socket;
    });

    return () => {
      anyWsConnectedRef.current = false;
      sockets.forEach((socket) => {
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          socket.close();
        }
      });
    };
  }, [
    enabled,
    currentRole,
    currentUserId,
    currentUserName,
    skipAppointmentId,
    appointmentIds.join(","),
  ]);
}
