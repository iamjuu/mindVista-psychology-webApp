import apiInstance from "../instance";
import { resolveChatAppointmentId, groupPatientThreadsByDoctor } from "../components/chat/chatUtils";
import { normalizePhoneDigits } from "./patientIdentifier";

function normalizeEmail(value) {
  return String(value || "").toLowerCase().trim();
}

/**
 * Load patient message threads when GET /chat/patient/threads is unavailable (e.g. live API not deployed).
 * Uses /request-pateint + per-appointment chat when guest email access is supported.
 */
export async function loadGuestChatThreadsFromBookings(patientEmail) {
  const email = normalizeEmail(patientEmail);
  if (!email) return [];

  const { data } = await apiInstance.get("/request-pateint");
  const list = Array.isArray(data?.data) ? data.data : [];
  const matches = list.filter((row) => normalizeEmail(row.email) === email);

  const threads = await Promise.all(
    matches.map(async (appt) => {
      const appointmentId = resolveChatAppointmentId(appt);
      if (!appointmentId) return null;

      let lastMessage = null;
      let unreadCount = 0;
      let updatedAt = appt.updatedAt || appt.createdAt;

      try {
        const { data: chatData } = await apiInstance.get(
          `/chat/appointment/${appointmentId}`,
          { params: { role: "patient", patientEmail: email } }
        );
        const messages = Array.isArray(chatData?.data) ? chatData.data : [];
        if (messages.length > 0) {
          lastMessage = messages[messages.length - 1];
          updatedAt = lastMessage.createdAt || updatedAt;
          unreadCount = messages.filter(
            (m) => m.senderRole === "doctor" && !m.readByPatient
          ).length;
        }
      } catch {
        /* chat endpoint may be unavailable on older API */
      }

      return {
        appointmentId,
        doctorId: appt.doctor?._id || appt.doctor || null,
        doctorName: appt.doctorName || "Doctor",
        patientName: appt.name || "",
        patientEmail: email,
        patientPhone: normalizePhoneDigits(appt.phone || appt.number) || "",
        date: appt.date,
        time: appt.time,
        lastMessage,
        unreadCount,
        updatedAt,
      };
    })
  );

  return groupPatientThreadsByDoctor(threads.filter(Boolean));
}
