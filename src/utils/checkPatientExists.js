import apiInstance from "../instance";
import { resolveChatAppointmentId } from "../components/chat/chatUtils";
import { normalizePhoneDigits, parsePatientIdentifier } from "./patientIdentifier";

function normalizeEmail(value) {
  return String(value || "").toLowerCase().trim();
}

export function appointmentMatchesIdentifier(appointment, parsed) {
  if (!appointment) return false;
  const apptEmail = normalizeEmail(appointment.email);
  if (parsed.type === "email" && apptEmail && apptEmail === parsed.email) {
    return true;
  }
  if (parsed.type === "phone" && parsed.digits) {
    const apptPhone = normalizePhoneDigits(appointment.phone || appointment.number);
    return apptPhone.length >= 10 && apptPhone === parsed.digits;
  }
  return false;
}

async function probePatientAccountByEmail(email) {
  if (!email) return false;
  try {
    await apiInstance.post("/patient/login/send-otp", { email });
    return true;
  } catch (otpErr) {
    const status = otpErr.response?.status;
    if (status === 404) return false;
    if (status === 404) return false;
    throw otpErr;
  }
}

async function lookupViaAppointments(parsed) {
  const { data } = await apiInstance.get("/request-pateint");
  const list = Array.isArray(data?.data) ? data.data : [];
  const match = list.find((row) => appointmentMatchesIdentifier(row, parsed));

  if (!match) {
    return {
      success: true,
      exists: false,
      hasBooking: false,
      email: parsed.type === "email" ? parsed.email : null,
      phone: parsed.type === "phone" ? parsed.phone : null,
      lookupType: parsed.type,
    };
  }

  const resolvedEmail = match.email ? normalizeEmail(match.email) : null;
  const resolvedPhone = normalizePhoneDigits(match.phone || match.number) || null;

  let exists = false;
  if (resolvedEmail) {
    try {
      await apiInstance.post("/patient/login/send-otp", { email: resolvedEmail });
      exists = true;
    } catch (otpErr) {
      const status = otpErr.response?.status;
      if (status === 404) {
        exists = false;
      } else {
        throw otpErr;
      }
    }
  }

  return {
    success: true,
    exists,
    hasBooking: true,
    email: resolvedEmail,
    phone: resolvedPhone,
    lookupType: parsed.type,
  };
}

/**
 * Check patient account / booking against live API.
 * Primary: GET /patient/exists (when deployed on Vercel).
 * Fallback: GET /request-pateint (works on current production).
 */
export function mapAppointmentsToGuestProfile(appointments, checkData = {}) {
  if (!Array.isArray(appointments) || appointments.length === 0) return null;

  const sorted = [...appointments].sort((a, b) => {
    const da = new Date(a.date || a.createdAt || 0).getTime();
    const db = new Date(b.date || b.createdAt || 0).getTime();
    return db - da;
  });
  const latest = sorted[0];
  const history = sorted.map((a) => {
    const chatId = resolveChatAppointmentId(a);
    return {
      id: chatId,
      appointmentId: chatId,
      displayAppointmentId: a.appointmentId || null,
      doctorId: a.doctor?._id || a.doctor || null,
      doctorName: a.doctorName,
      age: a.age,
      date: a.date,
      time: a.time,
      location: a.location,
      name: a.name,
    };
  });

  const latestChatId = resolveChatAppointmentId(latest);

  return {
    source: "booking",
    name: latest?.name || "",
    email: checkData.email || latest?.email || "",
    number:
      checkData.phone ||
      normalizePhoneDigits(latest?.phone || latest?.number) ||
      "",
    appointmentId: latestChatId,
    age: latest?.age,
    doctorName: latest?.doctorName,
    date: latest?.date,
    time: latest?.time,
    location: latest?.location,
    history,
  };
}

export async function loadGuestProfileByIdentifier(identifier, checkData = {}) {
  const parsed = parsePatientIdentifier(identifier);
  if (!parsed.type) return null;

  const { data } = await apiInstance.get("/request-pateint");
  const list = Array.isArray(data?.data) ? data.data : [];
  const matches = list.filter((row) => appointmentMatchesIdentifier(row, parsed));
  return mapAppointmentsToGuestProfile(matches, checkData);
}

export async function trySendPatientOtp(email) {
  if (!email) return null;
  try {
    const { data } = await apiInstance.post("/patient/login/send-otp", {
      email: email.trim(),
    });
    if (data.success && data.expiresAt) {
      return { email: email.trim(), expiresAt: data.expiresAt };
    }
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
  return null;
}

export async function checkPatientExists(identifier) {
  const parsed = parsePatientIdentifier(identifier);
  if (!parsed.type) {
    throw new Error("Invalid identifier");
  }

  try {
    const { data } = await apiInstance.get("/patient/exists", {
      params: { identifier },
    });
    console.log("[ProfileGate] /patient/exists OK:", data);
    return { data, source: "exists" };
  } catch (err) {
    if (err.response?.status !== 404) {
      throw err;
    }
    console.warn(
      "[ProfileGate] /patient/exists 404 — using /request-pateint fallback (live API)"
    );
  }

  const data = await lookupViaAppointments(parsed);
  console.log("[ProfileGate] appointment fallback result:", data);
  return { data, source: "request-pateint" };
}
