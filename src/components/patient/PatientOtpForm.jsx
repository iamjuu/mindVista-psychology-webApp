import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiInstance from "../../instance";
import { savePatientSession } from "../../constants/patientAuthStorage";
import { clearPatientProfileIfEmailMismatch } from "../../constants/patientProfileStorage";

export const OTP_STORAGE_KEY = "mindvistaPatientOtpMeta";

export default function PatientOtpForm({
  email,
  expiresAt: initialExpiresAt,
  onVerified,
  onBack,
}) {
  const [expiresAt, setExpiresAt] = useState(initialExpiresAt);
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    setExpiresAt(initialExpiresAt);
  }, [initialExpiresAt]);

  useEffect(() => {
    if (!email || !expiresAt) return;
    sessionStorage.setItem(
      OTP_STORAGE_KEY,
      JSON.stringify({ email, expiresAt })
    );
  }, [email, expiresAt]);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const end = new Date(expiresAt).getTime();
      setSecondsLeft(Math.max(0, Math.ceil((end - Date.now()) / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await apiInstance.post("/patient/login/verify-otp", {
        email: email.trim(),
        otp: code,
      });
      if (data.success && data.token) {
        sessionStorage.removeItem(OTP_STORAGE_KEY);
        savePatientSession(data.token, data.patient);
        clearPatientProfileIfEmailMismatch(data.patient?.email);
        toast.success("Welcome back");
        onVerified?.();
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Verification failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (!email || secondsLeft > 0) return;
    setResending(true);
    try {
      const { data } = await apiInstance.post("/patient/login/send-otp", {
        email: email.trim(),
      });
      if (data.success && data.expiresAt) {
        setExpiresAt(data.expiresAt);
        toast.success("New code sent");
      } else {
        toast.error(data.message || "Could not resend");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Could not resend"
      );
    } finally {
      setResending(false);
    }
  }, [email, secondsLeft]);

  const canResend = secondsLeft === 0;

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24, textAlign: "center" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111b21", marginBottom: 8 }}>
        Enter code
      </h1>
      <p style={{ color: "#667781", marginBottom: 16, fontSize: 15 }}>
        We sent a 6-digit code to <strong style={{ color: "#111b21" }}>{email}</strong>.
      </p>
      <p
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: secondsLeft > 0 ? "#007bff" : "#dc2626",
          marginBottom: 20,
        }}
      >
        {secondsLeft > 0
          ? `Expires in ${formatTime(secondsLeft)}`
          : "Code expired — resend below"}
      </p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1px solid #e9edef",
            borderRadius: 8,
            fontSize: 22,
            letterSpacing: "0.35em",
            textAlign: "center",
            marginBottom: 12,
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          disabled={
            submitting || otp.replace(/\D/g, "").length !== 6 || secondsLeft === 0
          }
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#25d366",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: submitting ? "wait" : "pointer",
            opacity:
              submitting || otp.replace(/\D/g, "").length !== 6 || secondsLeft === 0
                ? 0.7
                : 1,
            marginBottom: 12,
          }}
        >
          {submitting ? "Verifying…" : "Verify & continue"}
        </button>
      </form>
      <button
        type="button"
        disabled={!canResend || resending}
        onClick={handleResend}
        style={{
          background: "none",
          border: "none",
          color: canResend ? "#007bff" : "#999",
          fontWeight: 600,
          cursor: canResend ? "pointer" : "default",
          marginBottom: 16,
        }}
      >
        {resending ? "Sending…" : "Resend code"}
      </button>
      {onBack && (
        <p style={{ fontSize: 14 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            ← Use a different email or phone
          </button>
          {" · "}
          <Link to="/" style={{ color: "#007bff" }}>
            Home
          </Link>
        </p>
      )}
    </div>
  );
}
