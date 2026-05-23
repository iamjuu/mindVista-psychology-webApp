export function isEmailLike(value) {
  return String(value || "").includes("@");
}

export function normalizePhoneDigits(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

/**
 * @param {string} value
 * @returns {{ type: 'email'|'phone'|null, email?: string, phone?: string, digits?: string }}
 */
export function parsePatientIdentifier(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return { type: null };
  }

  if (isEmailLike(trimmed)) {
    return { type: "email", email: trimmed.toLowerCase() };
  }

  const digits = normalizePhoneDigits(trimmed);
  if (digits.length >= 10) {
    return { type: "phone", phone: digits, digits };
  }

  return { type: null };
}

export function isValidPatientIdentifier(value) {
  const parsed = parsePatientIdentifier(value);
  return parsed.type === "email" || parsed.type === "phone";
}
