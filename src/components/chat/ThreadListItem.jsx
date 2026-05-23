import { getInitials, formatThreadTime } from "./chatUtils";

const ThreadListItem = ({
  thread,
  selected,
  onSelect,
  displayName,
  subtitle,
}) => {
  const preview =
    thread?.lastMessage?.message ||
    subtitle ||
    `${thread?.date || ""} ${thread?.time || ""}`.trim() ||
    "No messages yet";
  const time = formatThreadTime(thread?.updatedAt || thread?.lastMessage?.createdAt);
  const unread = (thread?.unreadCount || 0) > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(thread)}
      className={`flex w-full items-center gap-3 border-b border-gray-100 px-3 py-3 text-left transition-colors hover:bg-[#f5f6f6] ${
        selected ? "bg-[#f0f2f5]" : "bg-white"
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dfe5e7] text-sm font-semibold text-[#54656f]">
        {getInitials(displayName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-[15px] font-medium text-[#111b21]">{displayName}</p>
          <span className={`shrink-0 text-xs ${unread ? "text-[#25d366] font-medium" : "text-[#667781]"}`}>
            {time}
          </span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-sm text-[#667781]">{preview}</p>
          {unread && (
            <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#25d366] px-1.5 text-xs font-medium text-white">
              {thread.unreadCount > 99 ? "99+" : thread.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ThreadListItem;
