import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import apiInstance from "../../../instance";
import {
  isValidPatientIdentifier,
  parsePatientIdentifier,
} from "../../../utils/patientIdentifier";
import {
  checkPatientExists,
  loadGuestProfileByIdentifier,
} from "../../../utils/checkPatientExists";
import PatientOtpForm, {
  OTP_STORAGE_KEY,
} from "../../../components/patient/PatientOtpForm";
import {
  resolveChatAppointmentId,
  groupPatientThreadsByDoctor,
  expandGroupedThreads,
  clearGroupedThreadUnread,
} from "../../../components/chat/chatUtils";
import {
  getPatientToken,
  clearPatientSession,
} from "../../../constants/patientAuthStorage";
import {
  saveGuestProfileSession,
  loadGuestProfileSession,
  clearGuestProfileSession,
} from "../../../constants/patientGuestSession";
import { getGuestChatEmail } from "../../../constants/patientGuestChat";
import { loadGuestChatThreadsFromBookings } from "../../../utils/loadGuestChatThreads";
import {
  ActionButton,
  Actions,
  BasicInfo,
  Company,
  Container,
  Content,
  Description,
  Experience,
  ExperienceDetails,
  ExperienceItem,
  InfoItem,
  Label,
  LeftColumn,
  Logo,
  Name,
  Notes,
  NotesButton,
  NotesTitle,
  PageWrapper,
  Period,
  ProfileImage,
  ProfileSection,
  RightColumn,
  Role,
  SectionTitle,
  Skill,
  Skills,
  ShimmerActionBtn,
  ShimmerActionsRow,
  ShimmerAvatar,
  ShimmerButton,
  ShimmerExpLines,
  ShimmerExperienceRow,
  ShimmerLine,
  ShimmerLogo,
  ShimmerSkillPill,
  ShimmerSkillsRow,
  ShimmerTextarea,
  Value,
} from "./style";
import { Pic1 } from "../../../assets";
import WhatsAppChatShell from "../../../components/chat/WhatsAppChatShell";
import { useAppointmentChatRealtime } from "../../../hooks/useAppointmentChatRealtime";

function formatDateDisplay(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(d);
  }
}

function formatPhone(num) {
  if (!num) return "";
  const s = String(num).replace(/\D/g, "");
  if (s.length === 10) return `+91 ${s.slice(0, 5)} ${s.slice(5)}`;
  return String(num);
}

function mapApiResponseToProfile(data) {
  const { patient, summary, appointments } = data;
  const history = (appointments || []).map((a) => {
    const chatId = resolveChatAppointmentId(a);
    return {
      id: chatId,
      appointmentId: chatId,
      doctorId: a.doctorId,
      doctorName: a.doctorName,
      age: a.age,
      date: a.date,
      time: a.time,
      location: a.location,
      name: a.name,
    };
  });
  const s = summary;
  return {
    source: "api",
    patientId: patient?._id,
    name: s?.name || patient?.name || "",
    email: patient?.email || "",
    number: s?.number || patient?.phone || "",
    appointmentId: s?.appointmentId,
    age: s?.age,
    doctorName: s?.doctorName,
    date: s?.date,
    time: s?.time,
    location: s?.location,
    history,
  };
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [chatThreads, setChatThreads] = useState([]);
  const [selectedChatThread, setSelectedChatThread] = useState(null);
  const [chatThreadsLoading, setChatThreadsLoading] = useState(false);
  const [chatThreadsError, setChatThreadsError] = useState("");
  const [gateIdentifier, setGateIdentifier] = useState("");
  const [gateChecking, setGateChecking] = useState(false);
  const [gateError, setGateError] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [guestProfileUnlocked, setGuestProfileUnlocked] = useState(false);
  const selectedChatIdRef = useRef(null);

  useEffect(() => {
    selectedChatIdRef.current = selectedChatThread?.appointmentId ?? null;
  }, [selectedChatThread?.appointmentId]);

  const hasToken = () => !!getPatientToken();

  const loadProfile = useCallback(async () => {
    const token = getPatientToken();
    if (!token) {
      const guestSession = loadGuestProfileSession();
      if (guestSession?.profile) {
        setProfile(guestSession.profile);
        setGuestProfileUnlocked(true);
        if (guestSession.identifier) {
          setGateIdentifier(guestSession.identifier);
        }
        setReady(true);
        setLoading(false);
        return;
      }
      setProfile(null);
      setGuestProfileUnlocked(false);
      setReady(true);
      setLoading(false);
      return;
    }

    clearGuestProfileSession();

    setLoading(true);
    try {
      const { data } = await apiInstance.get("/patient/me");
      if (data.success) {
        setProfile(mapApiResponseToProfile(data));
      } else {
        setProfile(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        clearPatientSession();
        setProfile(null);
      } else {
        setProfile(null);
      }
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (location.state?.email) {
      setGateIdentifier(location.state.email);
    }
    if (location.state?.fromPayment) {
      toast.success("Enter your booking email below to open your profile.");
    }
  }, [location.state?.email, location.state?.fromPayment]);

  useEffect(() => {
    const onPatientAuthChanged = () => {
      if (getPatientToken()) {
        loadProfile();
      }
    };
    window.addEventListener("patient-auth-changed", onPatientAuthChanged);
    return () =>
      window.removeEventListener("patient-auth-changed", onPatientAuthChanged);
  }, [loadProfile]);

  const buildThreadsFromHistory = useCallback((historyItems) => {
    if (!Array.isArray(historyItems)) return [];
    const seen = new Set();
    return historyItems
      .map((item) => {
        const appointmentId = resolveChatAppointmentId(item);
        if (!appointmentId || seen.has(appointmentId)) return null;
        seen.add(appointmentId);
        return {
          appointmentId,
          doctorId: item.doctorId,
          doctorName: item.doctorName || profile?.doctorName || "Doctor",
          patientName: profile?.name || "",
          date: item.date,
          time: item.time,
          lastMessage: null,
          unreadCount: 0,
          updatedAt: item.date || new Date().toISOString(),
        };
      })
      .filter(Boolean);
  }, [profile?.doctorName, profile?.name]);

  const loadChatThreads = useCallback(async () => {
    const token = getPatientToken();
    setChatThreadsLoading(true);
    setChatThreadsError("");
    try {
      let threads = [];
      if (token) {
        const { data } = await apiInstance.get("/chat/patient/me/threads");
        threads = Array.isArray(data?.data) ? data.data : [];
      } else {
        const guestEmail = profile?.email?.trim() || getGuestChatEmail();
        if (guestEmail) {
          try {
            const { data } = await apiInstance.get("/chat/patient/threads", {
              params: { patientEmail: guestEmail },
            });
            threads = Array.isArray(data?.data) ? data.data : [];
          } catch (threadErr) {
            if (threadErr.response?.status === 404) {
              console.warn(
                "[Messages] /chat/patient/threads not on server — using booking fallback"
              );
              threads = await loadGuestChatThreadsFromBookings(guestEmail);
            } else {
              throw threadErr;
            }
          }
        }
      }
      if (threads.length === 0 && profile?.history?.length) {
        threads = buildThreadsFromHistory(profile.history);
      }
      threads = groupPatientThreadsByDoctor(threads);
      setChatThreads(threads);
      setSelectedChatThread((current) => {
        if (current && threads.some((thread) => thread.appointmentId === current.appointmentId)) {
          return threads.find((thread) => thread.appointmentId === current.appointmentId);
        }
        const preferredId = profile?.appointmentId
          ? String(profile.appointmentId)
          : null;
        if (preferredId) {
          const preferred = threads.find((thread) => String(thread.appointmentId) === preferredId);
          if (preferred) return preferred;
        }
        return threads[0] || null;
      });
    } catch (err) {
      console.error("Failed to load patient chat threads", err);
      setChatThreadsError(err.response?.data?.message || "Failed to load messages");
    } finally {
      setChatThreadsLoading(false);
    }
  }, [buildThreadsFromHistory, profile?.appointmentId, profile?.history, profile?.email]);

  useEffect(() => {
    const canLoadMessages =
      activeTab === "messages" &&
      profile &&
      (hasToken() || guestProfileUnlocked);
    if (canLoadMessages) {
      loadChatThreads();
    }
  }, [activeTab, loadChatThreads, profile, guestProfileUnlocked]);

  const handleIncomingMessage = useCallback((message) => {
    if (!message?.appointmentId) return;
    const appointmentId = String(message.appointmentId);
    const isActive = selectedChatIdRef.current === appointmentId;
    const fromDoctor = message.senderRole === "doctor";

    setChatThreads((prev) => {
      let flat = expandGroupedThreads(prev);
      const idx = flat.findIndex((t) => String(t.appointmentId) === appointmentId);
      if (idx === -1) {
        flat = [
          {
            appointmentId,
            doctorId: message.doctorId,
            doctorName: message.senderName || profile?.doctorName || "Doctor",
            patientName: profile?.name || "",
            date: profile?.date,
            time: profile?.time,
            lastMessage: message,
            unreadCount: fromDoctor && !isActive ? 1 : 0,
            updatedAt: message.createdAt,
          },
          ...flat,
        ];
      } else {
        flat = flat.map((t) => {
          if (String(t.appointmentId) !== appointmentId) return t;
          return {
            ...t,
            lastMessage: message,
            updatedAt: message.createdAt,
            unreadCount:
              fromDoctor && !isActive
                ? (t.unreadCount || 0) + 1
                : fromDoctor && isActive
                  ? 0
                  : t.unreadCount,
          };
        });
      }
      return groupPatientThreadsByDoctor(flat);
    });
  }, [profile?.date, profile?.doctorName, profile?.name, profile?.time]);

  const handleMarkedRead = useCallback((appointmentId) => {
    setChatThreads((prev) => clearGroupedThreadUnread(prev, appointmentId));
  }, []);

  const guestChatEmail =
    !hasToken() && guestProfileUnlocked
      ? profile?.email?.trim() || getGuestChatEmail()
      : "";

  useAppointmentChatRealtime({
    enabled:
      activeTab === "messages" && (!!getPatientToken() || !!guestChatEmail),
    appointmentIds: chatThreads.flatMap((thread) =>
      thread.appointmentIds?.length ? thread.appointmentIds : [thread.appointmentId]
    ),
    currentRole: "patient",
    currentUserId: profile?.patientId || profile?.email,
    currentUserName: profile?.name || "Patient",
    skipAppointmentId: selectedChatThread?.appointmentId,
    onMessage: handleIncomingMessage,
  });

  const handleGateSubmit = async (e) => {
    e.preventDefault();
    const identifier = gateIdentifier.trim();
    if (!identifier) {
      setGateError("Please enter a valid email or phone number");
      return;
    }
    if (!isValidPatientIdentifier(identifier)) {
      setGateError("Please enter a valid email or phone number");
      return;
    }
    const parsed = parsePatientIdentifier(identifier);
    setGateChecking(true);
    setGateError("");
    try {
      console.log("[ProfileGate] Checking identifier:", {
        identifier,
        parsed,
        apiBase: apiInstance.defaults.baseURL,
      });
      const { data, source } = await checkPatientExists(identifier);
      console.log("[ProfileGate] check response:", { data, source });
      if (data.success) {
        if (data.exists || data.hasBooking) {
          const guestProfile = await loadGuestProfileByIdentifier(identifier, data);
          if (guestProfile) {
            setProfile(guestProfile);
            setGuestProfileUnlocked(true);
            saveGuestProfileSession(identifier, guestProfile);
            setReady(true);
            toast.success("Welcome back");
            return;
          }
          setGateError(
            "We found your booking but could not load your profile. Try your email or contact support."
          );
          return;
        }

        navigate("/register", {
          state: {
            email: parsed.type === "email" ? parsed.email : undefined,
            phone: parsed.type === "phone" ? parsed.phone : undefined,
          },
        });
      } else {
        console.warn("[ProfileGate] API returned success:false", data);
        setGateError("Could not verify your details. Please try again.");
      }
    } catch (err) {
      console.error("[ProfileGate] Request failed:", {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        url: err.config?.url,
        baseURL: err.config?.baseURL,
        data: err.response?.data,
      });
      if (err.response?.status === 404) {
        setGateError(
          "Could not verify this phone number on the server. Try your email address, or ask support to update the live API."
        );
      } else if (err.code === "ERR_NETWORK") {
        setGateError(
          "Cannot reach the server. Check your internet connection and try again."
        );
      } else {
        setGateError(
          err.response?.data?.message ||
            "Could not verify your details. Please try again."
        );
      }
    } finally {
      setGateChecking(false);
    }
  };

  const handleLogout = () => {
    clearPatientSession();
    clearGuestProfileSession();
    sessionStorage.removeItem(OTP_STORAGE_KEY);
    setOtpEmail("");
    setOtpExpiresAt(null);
    setGuestProfileUnlocked(false);
    setProfile(null);
    setGateIdentifier("");
    setActiveTab("profile");
    setChatThreads([]);
    setSelectedChatThread(null);
    setReady(true);
    toast.success("Logged out");
  };

  const hasData =
    ready &&
    !loading &&
    profile &&
    (profile.name || profile.email || profile.patientId);

  const history = Array.isArray(profile?.history) ? profile.history : [];

  const skills =
    hasData && profile
      ? [profile.doctorName, formatPhone(profile.number)].filter(Boolean)
      : [];

  const showShimmer =
    loading || !ready || (hasToken() && !profile) || (guestProfileUnlocked && !profile);

  if (ready && !hasToken() && otpEmail && otpExpiresAt && !guestProfileUnlocked) {
    return (
      <PageWrapper>
        <Container>
          <PatientOtpForm
            email={otpEmail}
            expiresAt={otpExpiresAt}
            onVerified={() => {
              setOtpEmail("");
              setOtpExpiresAt(null);
              clearGuestProfileSession();
              loadProfile();
            }}
            onBack={() => {
              setOtpEmail("");
              setOtpExpiresAt(null);
            }}
          />
        </Container>
      </PageWrapper>
    );
  }

  if (ready && !hasToken() && !guestProfileUnlocked) {
    return (
      <PageWrapper>
        <Container>
          <div style={{ maxWidth: 420, margin: "48px auto", padding: 24, textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111b21", marginBottom: 8 }}>
              Your profile & messages
            </h1>
            <p style={{ color: "#667781", marginBottom: 24, fontSize: 15 }}>
              Enter the email or phone number you used when booking to continue.
            </p>
            <form onSubmit={handleGateSubmit}>
              <input
                type="text"
                value={gateIdentifier}
                onChange={(e) => setGateIdentifier(e.target.value)}
                placeholder="Email or phone number"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #e9edef",
                  borderRadius: 8,
                  fontSize: 16,
                  marginBottom: 12,
                  boxSizing: "border-box",
                }}
              />
              {gateError && (
                <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 12 }}>{gateError}</p>
              )}
              <button
                type="submit"
                disabled={gateChecking}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#25d366",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: gateChecking ? "wait" : "pointer",
                  opacity: gateChecking ? 0.7 : 1,
                }}
              >
                {gateChecking ? "Checking..." : "Continue"}
              </button>
            </form>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  if (ready && !loading && hasToken() && !profile) {
    return (
      <PageWrapper>
        <Container>
          <div style={{ padding: 32, textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#333" }}>
              Could not load profile
            </h1>
            <p style={{ color: "#666", marginTop: 8 }}>
              Please log in again to access your profile and messages.
            </p>
            <button
              type="button"
              onClick={() => {
                clearPatientSession();
                clearGuestProfileSession();
                setOtpEmail("");
                setOtpExpiresAt(null);
                setGuestProfileUnlocked(false);
                setProfile(null);
                setGateIdentifier("");
                setReady(true);
              }}
              style={{
                marginTop: 16,
                padding: "10px 16px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Try again
            </button>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  const getThreadDisplayName = (thread) =>
    thread.doctorName || profile?.doctorName || "Doctor";

  const getThreadSubtitle = () => "";

  return (
    <PageWrapper>
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "20px 24px 0",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === "profile" ? "2px solid #007bff" : "2px solid transparent",
              background: "transparent",
              color: activeTab === "profile" ? "#007bff" : "#555",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("messages")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === "messages" ? "2px solid #007bff" : "2px solid transparent",
              background: "transparent",
              color: activeTab === "messages" ? "#007bff" : "#555",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Messages
          </button>
          {(hasToken() || guestProfileUnlocked) && (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                marginLeft: "auto",
                padding: "8px 14px",
                border: "1px solid #e9edef",
                borderRadius: 8,
                background: "#fff",
                color: "#dc2626",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Log out
            </button>
          )}
        </div>

        {activeTab === "profile" ? (
          <Content>
          <LeftColumn>
            <ProfileSection>
              {showShimmer ? (
                <>
                  <ShimmerAvatar />
                  <ShimmerLine $w="200px" $h="24px" $mb="12px" />
                  <ShimmerLine $w="160px" $h="16px" $mb="16px" />
                  <ShimmerLine $w="100%" $h="14px" $mb="8px" />
                  <ShimmerLine $w="95%" $h="14px" $mb="8px" />
                  <ShimmerLine $w="80%" $h="14px" $mb="24px" />
                  <ShimmerSkillsRow>
                    <ShimmerSkillPill $w="120px" />
                    <ShimmerSkillPill $w="160px" />
                  </ShimmerSkillsRow>
                  <Notes style={{ marginTop: 24 }}>
                    <ShimmerLine $w="140px" $h="20px" $mb="8px" />
                    <ShimmerTextarea />
                    <ShimmerButton />
                  </Notes>
                </>
              ) : profile ? (
                <>
                  <ProfileImage src={Pic1} alt="Profile" />
                  <Name>{profile?.name || "—"}</Name>
                  <Role>
                    {profile?.appointmentId
                      ? `Appointment ID: ${profile.appointmentId}`
                      : "Appointment"}
                  </Role>
                  <Description>
                    {profile?.doctorName && (
                      <>
                        Doctor: {profile.doctorName}
                        <br />
                      </>
                    )}
                    {profile?.date && (
                      <>
                        Session date: {formatDateDisplay(profile.date)}
                        {profile?.time ? ` · ${profile.time}` : ""}
                        <br />
                      </>
                    )}
                    Message your doctor securely from the Messages tab.
                  </Description>
                  <Skills>
                    {skills.map((skill, index) => (
                      <Skill key={index}>{skill}</Skill>
                    ))}
                  </Skills>
                  <Notes>
                    <NotesTitle>Doctor messages</NotesTitle>
                    <p style={{ color: "#667781", fontSize: 14, marginBottom: 12 }}>
                      Chat with your doctor about appointments and care.
                    </p>
                    <NotesButton type="button" onClick={() => setActiveTab("messages")}>
                      Open Messages
                    </NotesButton>
                  </Notes>
                </>
              ) : null}
            </ProfileSection>
          </LeftColumn>

          <RightColumn>
            {showShimmer ? (
              <>
                <BasicInfo>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <InfoItem key={i}>
                      <ShimmerLine $w="56px" $h="16px" $mb="8px" />
                      <ShimmerLine $w="100%" $maxW="180px" $h="18px" />
                    </InfoItem>
                  ))}
                </BasicInfo>
                <ShimmerActionsRow>
                  <ShimmerActionBtn />
                  <ShimmerActionBtn />
                </ShimmerActionsRow>
                <Experience>
                  <ShimmerLine $w="220px" $h="22px" $mb="16px" />
                  {[1, 2, 3].map((i) => (
                    <ShimmerExperienceRow key={i}>
                      <ShimmerLogo />
                      <ShimmerExpLines>
                        <ShimmerLine $w="40%" $h="16px" />
                        <ShimmerLine $w="70%" $h="12px" />
                        <ShimmerLine $w="55%" $h="12px" />
                        <ShimmerLine $w="85%" $h="12px" />
                      </ShimmerExpLines>
                    </ShimmerExperienceRow>
                  ))}
                </Experience>
              </>
            ) : profile ? (
              <>
                <BasicInfo>
                  <InfoItem>
                    <Label>AGE</Label>
                    <Value>
                      {profile?.age ? `${profile.age} years` : "—"}
                    </Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>PHONE</Label>
                    <Value>
                      {profile?.number ? formatPhone(profile.number) : "—"}
                    </Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>Next session</Label>
                    <Value>
                      {profile?.date
                        ? `${formatDateDisplay(profile.date)}${
                            profile?.time ? ` · ${profile.time}` : ""
                          }`
                        : "—"}
                    </Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>LOCATION</Label>
                    <Value>{profile?.location || "—"}</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>EMAIL</Label>
                    <Value>{profile?.email || "—"}</Value>
                  </InfoItem>
                </BasicInfo>
                <Actions>
                  <ActionButton type="button">Download History</ActionButton>
                  <a
                    href="https://wa.me/917025715250?text=Hello%2C%20I%20need%20help%20with%20MindVista"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flex: 1, textDecoration: "none" }}
                  >
                    <ActionButton secondary type="button">
                      Help
                    </ActionButton>
                  </a>
                </Actions>
                <Experience>
                  <SectionTitle>History of Consultant</SectionTitle>
                  {history.length === 0 ? (
                    <Period style={{ color: "#888" }}>
                      No past sessions listed yet.
                    </Period>
                  ) : (
                    history.map((exp) => (
                      <ExperienceItem key={exp.id || exp.appointmentId}>
                        <Logo color="#4e95ff">MV</Logo>
                        <ExperienceDetails>
                          <Company>MindVista</Company>
                          <Period>{exp.doctorName || "—"}</Period>
                          <Period>{exp.age ? `${exp.age} years` : "—"}</Period>
                          <Period>
                            {formatDateDisplay(exp.date)}
                            {exp.location ? ` | ${exp.location}` : ""}
                          </Period>
                        </ExperienceDetails>
                      </ExperienceItem>
                    ))
                  )}
                </Experience>
              </>
            ) : null}
          </RightColumn>
          </Content>
        ) : (
          <div style={{ padding: 24 }}>
            <WhatsAppChatShell
              threads={chatThreads}
              selectedThread={selectedChatThread}
              onSelectThread={setSelectedChatThread}
              loading={chatThreadsLoading}
              error={chatThreadsError}
              onRefresh={loadChatThreads}
              currentRole="patient"
              currentUserId={profile?.patientId || profile?.email}
              currentUserName={profile?.name || "Patient"}
              doctorId={selectedChatThread?.doctorId}
              patientEmail={guestChatEmail}
              getThreadDisplayName={getThreadDisplayName}
              getThreadSubtitle={getThreadSubtitle}
              onMessageSent={(message) => {
                setChatThreads((prev) => {
                  const updated = prev.map((thread) =>
                    thread.appointmentId === message.appointmentId
                      ? { ...thread, lastMessage: message, updatedAt: message.createdAt }
                      : thread
                  );
                  updated.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
                  return updated;
                });
              }}
              onIncomingMessage={handleIncomingMessage}
              onMarkedRead={handleMarkedRead}
              emptyStateText="No appointment chats yet."
              listTitle="Messages"
              listSubtitle="Your appointment conversations"
            />
          </div>
        )}
      </Container>
    </PageWrapper>
  );
};

export default ProfilePage;
