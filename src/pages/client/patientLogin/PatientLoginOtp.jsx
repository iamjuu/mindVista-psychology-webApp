import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiInstance from "../../../instance";
import { savePatientSession } from "../../../constants/patientAuthStorage";
import { clearPatientProfileIfEmailMismatch } from "../../../constants/patientProfileStorage";
import { MainBackgroundImage } from "../../../assets";

const OTP_STORAGE_KEY = "mindvistaPatientOtpMeta";

export default function PatientLoginOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const fromState = location.state;
    let em = fromState?.email;
    let exp = fromState?.expiresAt;
    if (!em || !exp) {
      try {
        const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          em = parsed.email;
          exp = parsed.expiresAt;
        }
      } catch {
        /* ignore */
      }
    }
    if (!em || !exp) {
      toast.error("Start again from login");
      navigate("/login", { replace: true });
      return;
    }
    setEmail(em);
    setExpiresAt(exp);
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify({ email: em, expiresAt: exp }));
  }, [location.state, navigate]);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const end = new Date(expiresAt).getTime();
      const s = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setSecondsLeft(s);
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
        navigate("/profile", { replace: true });
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
        sessionStorage.setItem(
          OTP_STORAGE_KEY,
          JSON.stringify({ email, expiresAt: data.expiresAt })
        );
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

  if (!email || !expiresAt) {
    return null;
  }

  const canResend = secondsLeft === 0;

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: `url(${MainBackgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <form
          onSubmit={handleVerify}
          className="max-w-md w-full p-8 rounded-2xl space-y-5 bg-white/90 backdrop-blur-md shadow-lg text-gray-800"
        >
          <h1 className="text-2xl font-semibold text-center">Enter code</h1>
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            We sent a 6-digit code to{" "}
            <strong className="text-gray-800">{email}</strong>.
          </p>

          <div
            className="flex justify-center text-base font-mono font-semibold text-blue-800"
            aria-live="polite"
          >
            {secondsLeft > 0 ? (
              <span>Expires in {formatTime(secondsLeft)}</span>
            ) : (
              <span className="text-red-600">Code expired — resend below</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="otp" className="text-sm font-medium">
              Verification code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl tracking-[0.4em] font-semibold"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={
              submitting ||
              otp.replace(/\D/g, "").length !== 6 ||
              secondsLeft === 0
            }
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Verifying…" : "Verify & continue"}
          </button>

          <div className="flex flex-col items-center gap-2 text-sm text-gray-600">
            <button
              type="button"
              disabled={!canResend || resending}
              onClick={handleResend}
              className="text-blue-600 font-medium hover:underline disabled:opacity-40 disabled:no-underline"
            >
              {resending ? "Sending…" : "Resend code"}
            </button>
            {!canResend && (
              <span className="text-xs text-gray-500">
                Resend available after timer reaches 0:00
              </span>
            )}
          </div>

          <p className="text-center text-sm">
            <Link to="/login" className="text-blue-600 hover:underline">
              ← Back to login
            </Link>
            {" · "}
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
