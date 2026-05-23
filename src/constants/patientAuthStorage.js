export const PATIENT_TOKEN_KEY = "mindvistaPatientToken";
export const PATIENT_USER_KEY = "mindvistaPatientUser";

export function savePatientSession(token, patient) {
  localStorage.setItem(PATIENT_TOKEN_KEY, token);
  if (patient) {
    const patientId = patient.id || patient._id;
    localStorage.setItem(
      PATIENT_USER_KEY,
      JSON.stringify({ ...patient, id: patientId, _id: patientId })
    );
  }
  window.dispatchEvent(new Event("patient-auth-changed"));
}

export function clearPatientSession() {
  localStorage.removeItem(PATIENT_TOKEN_KEY);
  localStorage.removeItem(PATIENT_USER_KEY);
  window.dispatchEvent(new Event("patient-auth-changed"));
}

export function getPatientToken() {
  return localStorage.getItem(PATIENT_TOKEN_KEY);
}

export function getPatientUser() {
  try {
    const raw = localStorage.getItem(PATIENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
