import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import apiInstance from "../../../instance";
import { savePatientSession } from "../../../constants/patientAuthStorage";
import { clearPatientProfileIfEmailMismatch } from "../../../constants/patientProfileStorage";
import { MainBackgroundImage } from "../../../assets";

export default function PatientLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState(() => location.state?.email || "");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(() => location.state?.phone || "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.phone) {
      setPhone(location.state.phone);
    }
    if (location.state?.fromPayment) {
      toast.success("Log in to message your doctor from your profile.");
    }
    if (location.state?.fromProfileGate && location.state?.hasBooking) {
      toast.success("We found your appointment. Sign in with the email on your booking.");
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (mode === "login") {
      setSubmitting(true);
      try {
        const { data } = await apiInstance.post("/patient/login/send-otp", {
          email: email.trim(),
        });
        if (data.success && data.expiresAt) {
          sessionStorage.setItem(
            "mindvistaPatientOtpMeta",
            JSON.stringify({
              email: email.trim(),
              expiresAt: data.expiresAt,
            })
          );
          toast.success("Check your email for the code");
          navigate("/login/otp", {
            replace: false,
            state: {
              email: email.trim(),
              expiresAt: data.expiresAt,
            },
          });
        } else {
          toast.error(data.message || "Could not send code");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Could not send code"
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await apiInstance.post("/patient/register", {
        email: email.trim(),
        password,
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      if (data.success && data.token) {
        savePatientSession(data.token, data.patient);
        clearPatientProfileIfEmailMismatch(data.patient?.email);
        toast.success("Account created");
        navigate("/profile", { replace: true });
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: `url(${MainBackgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full p-8 rounded-2xl space-y-5 bg-white/90 backdrop-blur-md shadow-lg text-gray-800"
        >
          <h1 className="text-2xl font-semibold text-center">
            {mode === "login" ? "Patient login" : "Create account"}
          </h1>
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            Use the <strong>same email</strong> you used when booking an
            appointment so your history appears here. Login is optional — you can
            still book without an account.
          </p>

          {mode === "register" && (
            <>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  autoComplete="name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  autoComplete="tel"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              autoComplete="email"
            />
          </div>

          {mode === "register" && (
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                autoComplete="new-password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting
              ? "Please wait…"
              : mode === "login"
                ? "Send code"
                : "Create account"}
          </button>

          <p className="text-center text-sm text-gray-600">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  className="text-blue-600 font-medium hover:underline"
                  onClick={() => setMode("register")}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 font-medium hover:underline"
                  onClick={() => setMode("login")}
                >
                  Log in
                </button>
              </>
            )}
          </p>

          <p className="text-center text-sm">
            <Link to="/register" className="text-blue-600 hover:underline">
              Book an appointment
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
