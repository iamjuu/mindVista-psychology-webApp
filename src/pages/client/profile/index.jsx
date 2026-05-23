import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiInstance from "../../../instance";
import {
  isValidPatientIdentifier,
  parsePatientIdentifier,
} from "../../../utils/patientIdentifier";
import { checkPatientExists } from "../../../utils/checkPatientExists";
import {
  getPatientToken,
  clearPatientSession,
} from "../../../constants/patientAuthStorage";
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
  const history = (appointments || []).map((a) => ({
    id: a.id || a.appointmentId,
    appointmentId: a.appointmentId,
    doctorName: a.doctorName,
    age: a.age,
    date: a.date,
    time: a.time,
    location: a.location,
    name: a.name,
  }));
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
  const selectedChatIdRef = useRef(null);

  useEffect(() => {
    selectedChatIdRef.current = selectedChatThread?.appointmentId ?? null;
  }, [selectedChatThread?.appointmentId]);

  const hasToken = () => !!getPatientToken();

  const loadProfile = useCallback(async () => {
    const token = getPatientToken();
    if (!token) {
      setProfile(null);
      setReady(true);
      setLoading(false);
      return;
    }

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
    const onPatientAuthChanged = () => {
      if (getPatientToken()) {
        loadProfile();
      }
    };
    window.addEventListener("patient-auth-changed", onPatientAuthChanged);
    return () =>
      window.removeEventListener("patient-auth-changed", onPatientAuthChanged);
  }, [loadProfile]);

  const loadChatThreads = useCallback(async () => {
    if (!getPatientToken()) return;
    setChatThreadsLoading(true);
    setChatThreadsError("");
    try {
      const { data } = await apiInstance.get("/chat/patient/me/threads");
      const threads = Array.isArray(data?.data) ? data.data : [];
      setChatThreads(threads);
      setSelectedChatThread((current) => {
        if (current && threads.some((thread) => thread.appointmentId === current.appointmentId)) {
          return threads.find((thread) => thread.appointmentId === current.appointmentId);
        }
        return threads[0] || null;
      });
    } catch (err) {
      console.error("Failed to load patient chat threads", err);
      setChatThreadsError(err.response?.data?.message || "Failed to load messages");
    } finally {
      setChatThreadsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "messages" && hasToken()) {
      loadChatThreads();
    }
  }, [activeTab, loadChatThreads]);

  const handleIncomingMessage = useCallback((message) => {
    if (!message?.appointmentId) return;
    const isActive = selectedChatIdRef.current === message.appointmentId;
    const fromDoctor = message.senderRole === "doctor";
    setChatThreads((prev) => {
      const updated = prev.map((thread) => {
        if (thread.appointmentId !== message.appointmentId) return thread;
        return {
          ...thread,
          lastMessage: message,
          updatedAt: message.createdAt,
          unreadCount:
            fromDoctor && !isActive
              ? (thread.unreadCount || 0) + 1
              : fromDoctor && isActive
                ? 0
                : thread.unreadCount,
        };
      });
      updated.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
      return updated;
    });
    loadChatThreads();
  }, [loadChatThreads]);

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
        if (data.exists) {
          if (data.email) {
            console.log("[ProfileGate] Account exists → login:", data.email);
            navigate("/login", { state: { email: data.email } });
          } else {
            setGateError(
              "Account found but no email on file. Please contact support."
            );
          }
        } else if (data.hasBooking) {
          const loginEmail =
            data.email || (parsed.type === "email" ? parsed.email : undefined);
          console.log("[ProfileGate] Booking found → login:", {
            email: loginEmail,
            phone: data.phone,
            source,
          });
          navigate("/login", {
            state: {
              email: loginEmail,
              phone:
                data.phone ||
                (parsed.type === "phone" ? parsed.phone : undefined),
              hasBooking: true,
              fromProfileGate: true,
            },
          });
        } else {
          console.warn("[ProfileGate] No account or booking found for:", identifier);
          setGateError(
            parsed.type === "email"
              ? "No booking found for this email. Check spelling (e.g. muhammed vs muhammad) or try your phone number."
              : "No account or booking found with this phone. Please check the number or try your booking email."
          );
        }
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

  const showShimmer = loading || !ready || (hasToken() && !profile);

  if (ready && !hasToken()) {
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
            <Link
              to="/login"
              onClick={clearPatientSession}
              style={{
                display: "inline-block",
                marginTop: 16,
                padding: "10px 16px",
                background: "#007bff",
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Log in again
            </Link>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  const getThreadDisplayName = (thread) =>
    thread.doctorName || profile?.doctorName || "Doctor";

  const getThreadSubtitle = (thread) =>
    `${thread.date || ""}${thread.time ? ` at ${thread.time}` : ""}`.trim();

  return (
    <PageWrapper>
      <Container>
        <div style={{ display: "flex", gap: 12, padding: "20px 24px 0" }}>
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
