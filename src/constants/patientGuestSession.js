export const GUEST_PROFILE_SESSION_KEY = "mindvistaGuestProfileSession";

export function saveGuestProfileSession(identifier, profile) {
  if (!identifier || !profile) return;
  try {
    localStorage.setItem(
      GUEST_PROFILE_SESSION_KEY,
      JSON.stringify({
        identifier: String(identifier).trim(),
        profile,
        savedAt: new Date().toISOString(),
      })
    );
  } catch (e) {
    console.error("saveGuestProfileSession", e);
  }
}

export function loadGuestProfileSession() {
  try {
    const raw = localStorage.getItem(GUEST_PROFILE_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.profile || typeof data.profile !== "object") return null;
    return data;
  } catch {
    return null;
  }
}

export function clearGuestProfileSession() {
  localStorage.removeItem(GUEST_PROFILE_SESSION_KEY);
}
