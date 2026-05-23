import { Check, CheckCheck } from "lucide-react";

const MessageStatus = ({ message, currentRole }) => {
  if (!message || message.senderRole !== currentRole) return null;

  const isPending = message._pending && !message._failed;
  const isRead =
    currentRole === "doctor"
      ? message.readByPatient
      : message.readByDoctor;

  if (isPending && !message._failed) {
    return (
      <span className="ml-1 inline-flex text-gray-400" title="Sending">
        <Check size={14} strokeWidth={2.5} />
      </span>
    );
  }

  if (message._failed) {
    return null;
  }

  const read = isRead;
  return (
    <span
      className={`ml-1 inline-flex ${read ? "text-[#53bdeb]" : "text-gray-400"}`}
      title={read ? "Read" : "Delivered"}
    >
      <CheckCheck size={14} strokeWidth={2.5} />
    </span>
  );
};

export default MessageStatus;
