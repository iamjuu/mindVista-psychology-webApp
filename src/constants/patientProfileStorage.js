export const PATIENT_PROFILE_KEY = "mindvistaPatientProfile";

/**
 * Persist patient-facing profile after a verified payment so /profile can show real data.
 */
export function savePatientProfileAfterPayment(appointmentData, appointmentId) {
  const id =
    appointmentId ||
    appointmentData?.appointmentId ||
    appointmentData?.registrationId ||
    appointmentData?.id ||
    "";

  const payload = {
    appointmentId: id,
    name: appointmentData?.name ?? "",
    email: appointmentData?.email ?? "",
    number: appointmentData?.number ?? "",
    location: appointmentData?.location ?? "",
    age: String(appointmentData?.age ?? ""),
    doctorName: appointmentData?.doctorName ?? "",
    date: appointmentData?.date ?? "",
    time: appointmentData?.time ?? "",
    updatedAt: new Date().toISOString(),
  };

  try {
    const prev = loadPatientProfile();
    const history = Array.isArray(prev?.history) ? prev.history : [];
    const entry = { ...payload, id: id || `temp-${Date.now()}` };
    const nextHistory = [
      entry,
      ...history.filter((h) => h.id !== entry.id),
    ].slice(0, 20);

    localStorage.setItem(
      PATIENT_PROFILE_KEY,
      JSON.stringify({ ...payload, history: nextHistory })
    );
  } catch (e) {
    console.error("savePatientProfileAfterPayment", e);
  }
}

export function loadPatientProfile() {
  try {
    const raw = localStorage.getItem(PATIENT_PROFILE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

/** Avoid showing another user's local payment snapshot after a different email logs in. */
export function clearPatientProfileIfEmailMismatch(loggedInEmail) {
  if (!loggedInEmail) return;
  const p = loadPatientProfile();
  if (!p?.email) return;
  if (
    p.email.toLowerCase().trim() !== String(loggedInEmail).toLowerCase().trim()
  ) {
    localStorage.removeItem(PATIENT_PROFILE_KEY);
  }
}
