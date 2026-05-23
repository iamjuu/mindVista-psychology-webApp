import { useEffect, useState } from "react";
import { MessageCircle, RefreshCw } from "lucide-react";
import ThreadListItem from "./ThreadListItem";
import AppointmentChat from "./AppointmentChat";

const WhatsAppChatShell = ({
  threads = [],
  selectedThread,
  onSelectThread,
  loading = false,
  error = "",
  onRefresh,
  currentRole,
  currentUserId,
  currentUserName,
  doctorId,
  getThreadDisplayName,
  getThreadSubtitle,
  onMessageSent,
  onIncomingMessage,
  onMarkedRead,
  emptyStateText = "No conversations yet.",
  compact = false,
  listTitle = "Messages",
  listSubtitle = "",
  patientEmail = "",
}) => {
  const [mobileShowChat, setMobileShowChat] = useState(false);

  useEffect(() => {
    if (!selectedThread) {
      setMobileShowChat(false);
    }
  }, [selectedThread?.appointmentId]);

  const handleSelectThread = (thread) => {
    onSelectThread(thread);
    setMobileShowChat(true);
  };

  const handleBack = () => setMobileShowChat(false);

  const chatProps = {
    appointmentId: selectedThread?.appointmentId,
    currentRole,
    currentUserId,
    currentUserName,
    doctorId: doctorId ?? selectedThread?.doctorId,
    patientEmail,
    title: selectedThread ? getThreadDisplayName(selectedThread) : "Messages",
    subtitle: selectedThread ? getThreadSubtitle(selectedThread) : "",
    compact,
    onMessageSent,
    onIncomingMessage,
    onMarkedRead,
    onBack: handleBack,
    hideHeader: false,
  };

  const threadList = (
    <div className="flex h-full min-h-0 flex-col border-r border-[#e9edef] bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-[#e9edef] bg-[#f0f2f5] px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-[#111b21]">{listTitle}</h2>
          {listSubtitle && <p className="truncate text-sm text-[#667781]">{listSubtitle}</p>}
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-full p-2 text-[#54656f] hover:bg-[#e9edef]"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && <p className="p-4 text-sm text-[#667781]">Loading...</p>}
        {error && <p className="p-4 text-sm text-red-600">{error}</p>}
        {!loading && !error && threads.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center text-[#667781]">
            <MessageCircle className="mb-2 opacity-50" size={32} />
            <p className="text-sm">{emptyStateText}</p>
          </div>
        )}
        {threads.map((thread) => (
          <ThreadListItem
            key={thread.appointmentId}
            thread={thread}
            selected={selectedThread?.appointmentId === thread.appointmentId}
            onSelect={handleSelectThread}
            displayName={getThreadDisplayName(thread)}
            subtitle={getThreadSubtitle(thread)}
          />
        ))}
      </div>
    </div>
  );

  const chatPanel = (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[#e5ddd5]">
      {selectedThread ? (
        <AppointmentChat {...chatProps} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center bg-[#f0f2f5] p-8 text-center text-[#667781]">
          <MessageCircle className="mb-3 opacity-40" size={48} />
          <p className="text-sm">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`flex overflow-hidden rounded-lg border border-[#e9edef] bg-white ${
        compact ? "h-[min(520px,70vh)]" : "min-h-[640px] h-[calc(100vh-12rem)] max-h-[800px]"
      }`}
    >
      {/* Desktop: side-by-side */}
      <div className="hidden h-full w-[320px] shrink-0 md:flex md:flex-col">{threadList}</div>
      <div className="hidden h-full min-w-0 flex-1 md:flex">{chatPanel}</div>

      {/* Mobile: list OR chat */}
      <div className="flex h-full w-full flex-col md:hidden">
        {!mobileShowChat ? (
          <div className="flex h-full flex-col">{threadList}</div>
        ) : (
          <div className="flex h-full flex-col">
            <AppointmentChat {...chatProps} onBack={handleBack} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChatShell;
