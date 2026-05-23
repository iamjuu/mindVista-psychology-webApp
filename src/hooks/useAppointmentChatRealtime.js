import { useEffect, useRef } from "react";
import { WS_BASE_URL } from "../config/api";

/**
 * Subscribes to appointment chat rooms over WebSocket (real-time delivery).
 * Use on list views; skip the active thread when AppointmentChat already listens.
 */
export function useAppointmentChatRealtime({
  enabled = false,
  appointmentIds = [],
  currentRole,
  currentUserId,
  currentUserName,
  skipAppointmentId = null,
  onMessage,
}) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!enabled || !currentRole) return undefined;

    const skipId = skipAppointmentId ? String(skipAppointmentId) : null;
    const ids = [...new Set(appointmentIds.map(String).filter(Boolean))].filter(
      (id) => id !== skipId
    );

    if (ids.length === 0) return undefined;

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
        socket.send(
          JSON.stringify({
            type: "chat:join",
            appointmentId,
            role: currentRole,
            userId: currentUserId,
          })
        );
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
