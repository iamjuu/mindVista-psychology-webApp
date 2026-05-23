/** Chat API uses MongoDB appointment _id (24 hex chars), not the display appointmentId string. */
export function resolveChatAppointmentId(item) {
  if (!item || typeof item !== "object") return "";
  const candidates = [item._id, item.id, item.appointmentId];
  for (const value of candidates) {
    if (value == null || value === "") continue;
    const s = String(value);
    if (/^[a-f0-9]{24}$/i.test(s)) return s;
  }
  const fallback = item._id ?? item.id ?? item.appointmentId;
  return fallback != null ? String(fallback) : "";
}

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

function doctorGroupKey(thread) {
  if (thread?.doctorId) return `id:${String(thread.doctorId)}`;
  const name = String(thread?.doctorName || "").trim().toLowerCase();
  if (name) return `name:${name}`;
  return `appt:${thread?.appointmentId || "unknown"}`;
}

function pickDisplayLastMessage(sources) {
  const withMsg = sources.filter((s) => s?.lastMessage?.message);
  if (!withMsg.length) return null;

  const doctorSources = withMsg.filter((s) => s.lastMessage.senderRole === "doctor");
  const pool = doctorSources.length ? doctorSources : withMsg;

  let best = pool[0].lastMessage;
  let bestTime = new Date(best.createdAt || 0).getTime();

  for (let i = 1; i < pool.length; i += 1) {
    const msg = pool[i].lastMessage;
    const t = new Date(msg.createdAt || 0).getTime();
    if (t > bestTime) {
      best = msg;
      bestTime = t;
    }
  }
  return best;
}

function mergeSourceThreads(sources) {
  const sorted = [...sources].sort(
    (a, b) =>
      new Date(b.updatedAt || b.lastMessage?.createdAt || 0) -
      new Date(a.updatedAt || a.lastMessage?.createdAt || 0)
  );
  const primary = sorted[0];
  const lastMessage = pickDisplayLastMessage(sources);
  const unreadCount = sources.reduce((sum, s) => sum + (s.unreadCount || 0), 0);

  return {
    appointmentId: primary.appointmentId,
    doctorId: primary.doctorId,
    doctorName: primary.doctorName,
    patientName: primary.patientName,
    date: primary.date,
    time: primary.time,
    lastMessage,
    unreadCount,
    updatedAt: lastMessage?.createdAt || primary.updatedAt,
    sourceThreads: sources.map((s) => ({
      appointmentId: s.appointmentId,
      doctorId: s.doctorId,
      doctorName: s.doctorName,
      date: s.date,
      time: s.time,
      lastMessage: s.lastMessage,
      unreadCount: s.unreadCount || 0,
      updatedAt: s.updatedAt,
    })),
    appointmentIds: sources.map((s) => s.appointmentId),
  };
}

/** Flatten grouped threads back to per-appointment rows. */
export function expandGroupedThreads(groups) {
  if (!Array.isArray(groups)) return [];
  return groups.flatMap((g) => {
    if (Array.isArray(g.sourceThreads) && g.sourceThreads.length > 0) {
      return g.sourceThreads.map((s) => ({
        ...s,
        doctorId: g.doctorId ?? s.doctorId,
        doctorName: g.doctorName ?? s.doctorName,
        patientName: g.patientName ?? s.patientName,
      }));
    }
    return [g];
  });
}

/** One list row per doctor with combined unread count and latest doctor message. */
export function groupPatientThreadsByDoctor(threads) {
  const flat = expandGroupedThreads(threads);
  const map = new Map();

  for (const t of flat) {
    if (!t?.appointmentId) continue;
    const key = doctorGroupKey(t);
    const list = map.get(key) || [];
    list.push({ ...t });
    map.set(key, list);
  }

  return Array.from(map.values())
    .map(mergeSourceThreads)
    .sort(
      (a, b) =>
        new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );
}

export function clearGroupedThreadUnread(groups, appointmentId) {
  const id = String(appointmentId);
  const flat = expandGroupedThreads(groups).map((t) =>
    String(t.appointmentId) === id ? { ...t, unreadCount: 0 } : t
  );
  return groupPatientThreadsByDoctor(flat);
}
