export function upsertMessage(messages, message) {
  if (!message) return messages;
  const id = message._id;
  if (!id) return messages;
  const exists = messages.some((item) => item._id === id);
  if (exists) {
    return messages.map((item) => (item._id === id ? { ...item, ...message } : item));
  }
  return [...messages, message].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );
}

export function formatBubbleTime(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function formatThreadTime(value) {
  if (!value) return "";
  try {
    const date = new Date(value);
    const now = new Date();
    if (isSameDay(date, now)) {
      return formatBubbleTime(value);
    }
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (isSameDay(date, yesterday)) {
      return "Yesterday";
    }
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function formatDateSeparator(value) {
  if (!value) return "";
  try {
    const date = new Date(value);
    const now = new Date();
    if (isSameDay(date, now)) return "Today";
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (isSameDay(date, yesterday)) return "Yesterday";
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function getInitials(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getDateKey(value) {
  if (!value) return "";
  try {
    return startOfDay(new Date(value)).toISOString();
  } catch {
    return "";
  }
}
