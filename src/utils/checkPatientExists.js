import apiInstance from "../instance";
import { normalizePhoneDigits, parsePatientIdentifier } from "./patientIdentifier";

function normalizeEmail(value) {
  return String(value || "").toLowerCase().trim();
}

function appointmentMatchesIdentifier(appointment, parsed) {
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
