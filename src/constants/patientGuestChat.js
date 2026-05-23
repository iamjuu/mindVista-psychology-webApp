import { loadGuestProfileSession } from "./patientGuestSession";

/** Booking email used for guest chat API access (no JWT). */
export function getGuestChatEmail() {
  const session = loadGuestProfileSession();
  const email = session?.profile?.email;
  return email ? String(email).toLowerCase().trim() : "";
}
