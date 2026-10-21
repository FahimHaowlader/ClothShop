
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyholeOpen,
  Mail,
  ShieldCheck,
} from "lucide-react";

const BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-2.5 text-xs font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-black hover:text-white active:scale-95 cursor-pointer shadow-sm disabled:pointer-events-none disabled:opacity-60";

const INPUT_CLASS =
  "w-full rounded-xl border border-black/10 bg-neutral-50/30 px-3.5 py-3 text-xs text-black transition-all duration-300 focus:border-black focus:outline-none disabled:opacity-50";

const LABEL_CLASS =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-black/45";

const OTP_LENGTH = 6;

const Login = () => {
  const [step, setStep] = useState("login");

  // Navbar-style scroll behavior
  const [isScrolled, setIsScrolled] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const resetMessages = () => {
    setError("");
    setNotice("");
  };

  const changeStep = (nextStep) => {
    resetMessages();
    setStep(nextStep);
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    try {
      // Connect your login API here.
      await new Promise((resolve) => setTimeout(resolve, 500));

      setError("Connect your login API to authenticate this account.");
    } catch {
      setError("Unable to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Request a password-reset code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    try {
      // Connect your forgot-password API here to send the code.
      await new Promise((resolve) => setTimeout(resolve, 500));

      setOtp(Array(OTP_LENGTH).fill(""));
      setStep("verify");
      setNotice("Enter the 6-digit verification code sent to your email.");

      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setError("Unable to send the verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP input
  const handleOtpChange = (index, value) => {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      setOtp((previous) =>
        previous.map((digit, i) => (i === index ? "" : digit))
      );
      return;
    }

    // Support pasting a complete code into one box.
    if (digits.length > 1) {
      const pastedDigits = digits.slice(0, OTP_LENGTH).split("");
      const nextOtp = Array(OTP_LENGTH).fill("");

      pastedDigits.forEach((digit, i) => {
        nextOtp[i] = digit;
      });

      setOtp(nextOtp);
      setError("");

      const nextIndex = Math.min(pastedDigits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    setOtp((previous) =>
      previous.map((digit, i) => (i === index ? digits : digit))
    );

    setError("");

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (!digits) return;

    e.preventDefault();

    const nextOtp = Array(OTP_LENGTH).fill("");

    digits.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtp(nextOtp);
    setError("");

    inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  // Verify OTP
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    resetMessages();

    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Connect your verify-code API here.
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Demo transition only: the server must validate the code.
      setStep("reset");
      setNotice("");
    } catch {
      setError("The verification code could not be verified.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendCode = async () => {
    resetMessages();
    setIsSubmitting(true);

    try {
      // Connect your resend-code API here.
      await new Promise((resolve) => setTimeout(resolve, 500));

      setOtp(Array(OTP_LENGTH).fill(""));
      setNotice("A new code has been requested. Check your email.");
      inputRefs.current[0]?.focus();
    } catch {
      setError("Unable to resend the code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    resetMessages();

    if (newPassword.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Connect your reset-password API here.
      // Send the verified reset token/code and the new password.
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Demo transition only: persist the new password through your API.
      setStep("success");
    } catch {
      setError("Unable to reset your password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPasswordField = ({
    id,
    label,
    value,
    onChange,
    visible,
    toggleVisibility,
    placeholder,
    autoComplete,
  }) => (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          minLength={id === "password" ? undefined : 8}
          className={`${INPUT_CLASS} pr-11`}
        />

        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 transition-colors hover:text-black"
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

  const renderSubmitButton = (label, loadingLabel) => (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`${BUTTON_CLASS} w-full py-3`}
    >
      {isSubmitting ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight size={14} />
        </>
      )}
    </button>
  );

  const renderMessages = () => (
    <>
      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 text-[11px] leading-relaxed text-red-600"
        >
          <span className="font-bold">!</span>
          <span>{error}</span>
        </p>
      )}

      {notice && (
        <p
          role="status"
          className="text-[11px] leading-relaxed text-black/55"
        >
          {notice}
        </p>
      )}
    </>
  );

  const headerContent = {
    login: {
      eyebrow: "Welcome Back",
      title: "Login to your account.",
      description:
        "Your next favorite look is waiting. Login to continue shopping with BachelorShop.",
    },
    forgot: {
      eyebrow: "Account Recovery",
      title: "Let's get you back in.",
      description:
        "Enter the email address associated with your account and we'll help you reset your password.",
    },
    verify: {
      eyebrow: "Security Check",
      title: "Verify it's you.",
      description:
        "One quick check to keep your account secure. Enter the verification code sent to your email.",
    },
    reset: {
      eyebrow: "Almost There",
      title: "Create a new password.",
      description:
        "Choose a strong password to protect your account and get back to shopping.",
    },
    success: {
      eyebrow: "All Done",
      title: "You're back in control.",
      description:
        "Your password recovery flow is complete. Continue to login to your account.",
    },
  };

  const currentHeader = headerContent[step];

  return (
    <section className="w-full px-5 pb-16 pt-0 font-primary bg-bg-primary sm:px-8 lg:px-12">
      {/* Sticky Brand Header: expands at top, shrinks after scrolling */}
      <header
        className={`sticky top-0 z-50 -mx-5 flex w-auto items-center justify-center  bg-white px-5 backdrop-blur-sm transition-all duration-500 ease-in-out sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 ${
          isScrolled ? "mb-8 py-2 lg:py-4" : "mb-5 py-10"
        }`}
      >
        <Link
          to="/"
          className="font-primary text-2xl font-bold tracking-tight text-gray-900 transition-all duration-500"
        >
          BachelorShop
        </Link>
      </header>

      {/* Page Heading */}
 <div className="mb-10 flex w-full flex-col justify-between gap-5 md:flex-row md:items-end md:gap-10">
  {/* Left Side */}
  <div>
    <div className="mb-3 flex items-center gap-2.5">
      <span className="h-px w-8 bg-black" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
        {currentHeader.eyebrow}
      </span>
    </div>

    <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.055em] text-black">
      {currentHeader.title}
    </h1>
  </div>

  {/* Right Side: Pushed to the far right with md:ml-auto */}
  <p className="max-w-md text-xs leading-relaxed text-black/45 sm:text-sm md:ml-auto md:text-right">
    {currentHeader.description}
  </p>
</div>
      {/* Centered Form */}
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-500 sm:p-9 lg:p-11">
          {/* LOGIN */}
          {step === "login" && (
            <div className="mx-auto w-full max-w-2xl animate-in fade-in duration-500">
              <div className="mb-7 flex items-center gap-3 border-b border-black/10 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <LockKeyholeOpen size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-bold tracking-tight text-black">
                    Login
                  </h2>
                  <p className="mt-1 text-[11px] text-black/45">
                    Access your BachelorShop account
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="loginEmail" className={LABEL_CLASS}>
                    Email Address
                  </label>
                  <input
                    id="loginEmail"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className={INPUT_CLASS}
                  />
                </div>

                {renderPasswordField({
                  id: "password",
                  label: "Password",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  visible: showPassword,
                  toggleVisibility: () => setShowPassword((prev) => !prev),
                  placeholder: "Enter your password",
                  autoComplete: "current-password",
                })}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-[11px] text-black/55">
                    <input
                      type="checkbox"
                      name="remember"
                      className="h-3.5 w-3.5 accent-black"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() => changeStep("forgot")}
                    className="text-[11px] hover:cursor-pointer font-semibold text-black underline-offset-4 transition-colors hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {renderMessages()}
                {renderSubmitButton("Login", "Logging In...")}

                <p className="pt-2 text-center text-xs text-black/45">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-black underline underline-offset-4"
                  >
                    Create Account
                  </Link>
                </p>
              </form>
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {step === "forgot" && (
            <div className="mx-auto w-full max-w-2xl animate-in fade-in duration-500">
              <button
                type="button"
                onClick={() => changeStep("login")}
                className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-black/55 transition-colors hover:text-black hover:cursor-pointer"
              >
                <ArrowLeft size={15} />
                Back to Login
              </button>

              <div className="mb-7 flex items-center gap-3 border-b border-black/10 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <Mail size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-bold tracking-tight text-black">
                    Reset Your Password
                  </h2>
                  <p className="mt-1 text-[11px] text-black/45">
                    We'll send a verification code to your email
                  </p>
                </div>
              </div>

              <form onSubmit={handleRequestCode} className="space-y-5">
                <div>
                  <label htmlFor="recoveryEmail" className={LABEL_CLASS}>
                    Email Address
                  </label>
                  <input
                    id="recoveryEmail"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    autoComplete="email"
                    required
                    className={INPUT_CLASS}
                  />
                </div>

                {renderMessages()}
                {renderSubmitButton(
                  "Send Verification Code",
                  "Sending Code..."
                )}
              </form>
            </div>
          )}

          {/* SIX-DIGIT VERIFICATION */}
          {step === "verify" && (
            <div className="mx-auto w-full max-w-2xl animate-in fade-in slide-in-from-right-3 duration-500">
              <div className="mb-7 flex items-center justify-between gap-3 border-b border-black/10 pb-5">
                <button
                  type="button"
                  onClick={() => changeStep("forgot")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/55 transition-colors hover:text-black hover:cursor-pointer"
                >
                  <ArrowLeft size={15} />
                  <span>Back</span>
                </button>

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                  Step 2 of 3 · Verification
                </span>
              </div>

              <div className="mx-auto max-w-lg py-2 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
                  <ShieldCheck size={25} strokeWidth={1.7} />
                </div>

                <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
                  Verify Your Email
                </h2>

                <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-black/55">
                  We've sent a 6-digit verification code to{" "}
                  <span className="break-all font-semibold text-black">
                    {email}
                  </span>
                  . Enter the code below to continue.
                </p>

                <form
                  onSubmit={handleVerifyCode}
                  className="mt-8 space-y-5"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        aria-label={`Verification digit ${index + 1}`}
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        disabled={isSubmitting}
                        className="h-11 w-10 rounded-xl border border-black/15 bg-neutral-50 text-center text-base font-bold text-black outline-none transition-all duration-300 focus:border-black focus:bg-white focus:ring-1 focus:ring-black/10 disabled:opacity-50 sm:h-14 sm:w-12 sm:text-lg"
                      />
                    ))}
                  </div>

                  {renderMessages()}

                  <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px]">
                    <span className="text-black/45">
                      Didn't receive the code?
                    </span>

                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isSubmitting}
                      className="font-semibold text-black underline-offset-4 transition-colors hover:underline disabled:opacity-50 hover:cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => changeStep("forgot")}
                      disabled={isSubmitting}
                      className={`${BUTTON_CLASS} flex-1`}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`${BUTTON_CLASS} flex-1`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify Code</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* RESET PASSWORD */}
          {step === "reset" && (
            <div className="mx-auto w-full max-w-2xl animate-in fade-in slide-in-from-right-3 duration-500">
              <button
                type="button"
                onClick={() => changeStep("verify")}
                className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-black/55 transition-colors hover:text-black hover:cursor-pointer"
              >
                <ArrowLeft size={15} />
                Back to Verification
              </button>

              <div className="mb-7 flex items-center gap-3 border-b border-black/10 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <KeyRound size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-bold tracking-tight text-black">
                    Create a New Password
                  </h2>
                  <p className="mt-1 text-[11px] text-black/45">
                    Choose a password you haven't used before
                  </p>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                {renderPasswordField({
                  id: "newPassword",
                  label: "New Password",
                  value: newPassword,
                  onChange: (e) => setNewPassword(e.target.value),
                  visible: showNewPassword,
                  toggleVisibility: () =>
                    setShowNewPassword((prev) => !prev),
                  placeholder: "Enter your new password",
                  autoComplete: "new-password",
                })}

                {renderPasswordField({
                  id: "confirmPassword",
                  label: "Confirm New Password",
                  value: confirmPassword,
                  onChange: (e) => setConfirmPassword(e.target.value),
                  visible: showConfirmPassword,
                  toggleVisibility: () =>
                    setShowConfirmPassword((prev) => !prev),
                  placeholder: "Re-enter your new password",
                  autoComplete: "new-password",
                })}

                <p className="text-[10px] leading-relaxed text-black/45">
                  Use at least 8 characters for your new password.
                </p>

                {renderMessages()}
                {renderSubmitButton(
                  "Reset Password",
                  "Resetting Password..."
                )}
              </form>
            </div>
          )}

          {/* SUCCESS */}
          {step === "success" && (
            <div className="mx-auto max-w-lg animate-in fade-in duration-500 py-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-md shadow-black/10">
                <CheckCircle2 size={30} strokeWidth={1.7} />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
                Password Reset Complete
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-black/50">
                Your password reset flow is complete. You can now return to the
                login page.
              </p>

              <button
                type="button"
                onClick={() => {
                  setPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setOtp(Array(OTP_LENGTH).fill(""));
                  changeStep("login");
                }}
                className={`${BUTTON_CLASS} mt-7`}
              >
                Back to Login
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-[10px] leading-relaxed text-black/35">
          By continuing, you agree to BachelorShop's Terms of Service and
          Privacy Policy.
        </p>
      </div>
    </section>
  );
};

export default Login;
