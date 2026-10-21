import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyholeOpen,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-2.5 text-xs font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-black hover:text-white active:scale-95 cursor-pointer shadow-sm disabled:pointer-events-none disabled:opacity-60";

const INPUT_CLASS =
  "w-full rounded-xl border border-black/10 bg-neutral-50/30 px-3.5 py-3 text-xs text-black transition-all duration-300 focus:border-black focus:outline-none disabled:opacity-50";

const LABEL_CLASS =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-black/45";

const OTP_LENGTH = 6;

const Register = () => {
  const [step, setStep] = useState("register");
  const [isScrolled, setIsScrolled] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const inputRefs = useRef([]);

  // Sticky brand header behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Focus the first OTP input when the verification screen opens
  useEffect(() => {
    if (step === "verify") {
      const timeout = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [step]);

  const resetMessages = () => {
    setError("");
    setNotice("");
  };

  const changeStep = (nextStep) => {
    resetMessages();
    setStep(nextStep);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setNotice("");
  };

  // Register account and request email verification
  const handleRegister = async (e) => {
    e.preventDefault();
    resetMessages();

    const { name, email, password, confirmPassword } = formData;

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Connect your registration API here.
       *
       * Example:
       * await axios.post("/api/auth/register", {
       *   name: name.trim(),
       *   email: email.trim(),
       *   password,
       * });
       *
       * The backend should create a pending account or initiate
       * verification and send the OTP to the user's email.
       */

      await new Promise((resolve) => setTimeout(resolve, 500));

      setOtp(Array(OTP_LENGTH).fill(""));
      setStep("verify");

      setNotice(
        "Demo mode: connect your registration API to send the verification code."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP input handling
  const handleOtpChange = (index, value) => {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      setOtp((previous) =>
        previous.map((digit, i) => (i === index ? "" : digit))
      );
      setError("");
      return;
    }

    // Support pasting a complete code into any OTP box
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

  // Verify email
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
      /*
       * Connect your verification API here.
       *
       * Example:
       * await axios.post("/api/auth/verify-email", {
       *   email: formData.email,
       *   code,
       * });
       *
       * Only show success after the backend confirms verification.
       */

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Demo transition only; the server must validate the OTP.
      setStep("success");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "The verification code could not be verified."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    resetMessages();
    setIsSubmitting(true);

    try {
      /*
       * Connect your resend-verification API here.
       *
       * Example:
       * await axios.post("/api/auth/resend-verification", {
       *   email: formData.email,
       * });
       */

      await new Promise((resolve) => setTimeout(resolve, 500));

      setOtp(Array(OTP_LENGTH).fill(""));
      setNotice(
        "Demo mode: connect your resend API to send a new verification code."
      );

      inputRefs.current[0]?.focus();
    } catch {
      setError("Unable to resend the code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPasswordField = ({
    id,
    label,
    value,
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
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={8}
          maxLength={128}
          required
          disabled={isSubmitting}
          className={`${INPUT_CLASS} pr-11`}
        />

        <button
          type="button"
          onClick={toggleVisibility}
          disabled={isSubmitting}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 transition-colors hover:text-black disabled:opacity-50"
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
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

  const headerContent = {
  register: {
    eyebrow: "Join BachelorShop",
    title: "Create your account.",
    description: "Join with us for curated drops and a personalized recommendations.",
  },
  verify: {
    eyebrow: "Security Check",
    title: "Verify your email.",
    description: "One quick step. Enter the six-digit verification code sent to your email address.",
  },
  success: {
    eyebrow: "Welcome Aboard",
    title: "You're all set.",
    description: "Registration complete. Get ready to discover your next favorite look with BachelorShop",
  },
};
  const currentHeader = headerContent[step];

  return (
    <section className="w-full bg-bg-primary px-5 pb-16 pt-0 font-primary sm:px-8 lg:px-12">
      {/* Sticky Brand Header */}
      <header
        className={`sticky top-0 z-50 -mx-5 flex w-auto items-center justify-center bg-white/95 px-5 backdrop-blur-sm transition-all duration-500 ease-in-out sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 ${
          isScrolled ? "mb-8 py-2 lg:py-4 shadow-2xl" : "mb-5 py-10 shadow-none"
        }`}
      >
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-gray-900 transition-all duration-500"
        >
          BachelorShop
        </Link>
      </header>

      {/* Page Heading */}
      <div className="mb-10 flex w-full flex-col justify-between gap-5 md:flex-row md:items-end md:gap-10">
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

        <p className="max-w-md text-xs leading-relaxed text-black/45 sm:text-sm md:ml-auto md:text-right">
          {currentHeader.description}
        </p>
      </div>

      {/* Centered Form Container */}
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-500 sm:p-9 lg:p-11">
          {/* REGISTER */}
          {step === "register" && (
            <div className="mx-auto w-full max-w-2xl animate-in fade-in duration-500">
              <div className="mb-7 flex items-center gap-3 border-b border-black/10 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <UserRound size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-bold tracking-tight text-black">
                    Register
                  </h2>
                  <p className="mt-1 text-[11px] text-black/45">
                    Create your BachelorShop account
                  </p>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className={LABEL_CLASS}>
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    minLength={2}
                    maxLength={80}
                    required
                    disabled={isSubmitting}
                    className={INPUT_CLASS}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={LABEL_CLASS}>
                    Email Address
                  </label>

                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      maxLength={254}
                      required
                      disabled={isSubmitting}
                      className={`${INPUT_CLASS} pr-10`}
                    />

                    <Mail
                      size={15}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-black/35"
                    />
                  </div>
                </div>

                {/* Password */}
                {renderPasswordField({
                  id: "password",
                  label: "Password",
                  value: formData.password,
                  visible: showPassword,
                  toggleVisibility: () =>
                    setShowPassword((previous) => !previous),
                  placeholder: "Create a password",
                  autoComplete: "new-password",
                })}

                {/* Confirm Password */}
                {renderPasswordField({
                  id: "confirmPassword",
                  label: "Confirm Password",
                  value: formData.confirmPassword,
                  visible: showConfirmPassword,
                  toggleVisibility: () =>
                    setShowConfirmPassword((previous) => !previous),
                  placeholder: "Re-enter your password",
                  autoComplete: "new-password",
                })}

                <p className="text-[10px] leading-relaxed text-black/45">
                  Use at least 8 characters for your password and make sure
                  both password fields match.
                </p>

                {renderMessages()}

                {renderSubmitButton(
                  "Create Account",
                  "Creating Account..."
                )}

                <p className="pt-2 text-center text-xs text-black/45">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-black underline underline-offset-4 transition-colors hover:text-black/60"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          )}

          {/* VERIFY EMAIL */}
          {step === "verify" && (
            <div className="mx-auto w-full max-w-2xl animate-in fade-in slide-in-from-right-3 duration-500">
              <div className="mb-7 flex items-center justify-between gap-3 border-b border-black/10 pb-5">
                <button
                  type="button"
                  onClick={() => changeStep("register")}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/55 transition-colors hover:text-black disabled:opacity-50 hover:cursor-pointer"
                >
                  <ArrowLeft size={15} />
                  <span>Back</span>
                </button>

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                  Step 2 of 2 · Verification
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
                  We've sent a six-digit verification code to{" "}
                  <span className="break-all font-semibold text-black">
                    {formData.email}
                  </span>
                  . Enter the code below to verify your account.
                </p>

                <form
                  onSubmit={handleVerifyCode}
                  className="mt-8 space-y-5"
                >
                  {/* OTP Inputs */}
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
                        autoComplete={
                          index === 0 ? "one-time-code" : "off"
                        }
                        aria-label={`Verification digit ${index + 1}`}
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        disabled={isSubmitting}
                        required
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
                      onClick={() => changeStep("register")}
                      disabled={isSubmitting}
                      className={`${BUTTON_CLASS} flex-1`}
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`${BUTTON_CLASS} flex-1`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify Email</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* REGISTRATION SUCCESS */}
          {step === "success" && (
            <div className="mx-auto max-w-lg animate-in fade-in duration-500 py-5 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-md shadow-black/10">
                <CheckCircle2 size={30} strokeWidth={1.7} />
              </div>

              <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">
                Account Created
              </span>

              <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
                Welcome to BachelorShop!
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-black/50">
                Welcome,{" "}
                <span className="font-semibold text-black">
                  {formData.name.trim()}
                </span>
                . Your registration flow is complete. You're ready to explore
                your next favorite look.
              </p>

              <div className="mx-auto mt-7 flex max-w-sm items-center gap-3 rounded-xl border border-black/10 bg-neutral-50/50 p-4 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black shadow-sm">
                  <Mail size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/40">
                    Registered Email
                  </p>

                  <p className="mt-1 break-all text-xs font-medium text-black">
                    {formData.email}
                  </p>
                </div>
              </div>

              <Link
                to="/login"
                className={`${BUTTON_CLASS} mt-7 w-full py-3 sm:w-auto`}
              >
                <span>Continue to Login</span>
                <ArrowRight size={14} />
              </Link>

              <p className="mt-5 text-[10px] leading-relaxed text-black/35">
                Thank you for choosing BachelorShop.
              </p>
            </div>
          )}
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-[10px] leading-relaxed text-black/35">
          By creating an account, you agree to BachelorShop&apos;s{" "}
          <Link
            to="/terms"
            className="underline underline-offset-2 transition-colors hover:text-black/70"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-2 transition-colors hover:text-black/70"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default Register;