import React, { useState, useRef } from "react";
import { Link } from "react-router";
import {
  User,
  MapPin,
  Lock,
  UserRound,
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Smartphone,
  Mail,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  LockKeyholeOpen,
} from "lucide-react";

const Profile = ({ user, onSaveProfile, onLogout, onLogoutAllDevices }) => {
  // Initial Email State
  const initialEmail = user?.email || "alex.morgan@example.com";

  const [profileData, setProfileData] = useState({
    name: user?.name || "Alex Morgan",
    email: initialEmail,
    phone: user?.phone || "+880 1712-345678",
    memberSince: user?.memberSince || "January 2026",
  });

  const [currentEmail, setCurrentEmail] = useState(initialEmail);
  const [pendingEmail, setPendingEmail] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // In-Place Logout States
  const [logoutStage, setLogoutStage] = useState("idle"); // "idle" | "confirm" | "logging-out"
  const logoutTimerRef = useRef(null);

  const [logoutAllStage, setLogoutAllStage] = useState("idle"); // "idle" | "confirm" | "logging-out"
  const logoutAllTimerRef = useRef(null);

  // In-Place Profile Success View State
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  // In-Place Email Verification State
  const [isVerifyingEmailStep, setIsVerifyingEmailStep] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const inputRefs = useRef([]);

  // In-Place Password Change State
  const [isChangingPasswordStep, setIsChangingPasswordStep] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // Handle Profile Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Password Inputs
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Profile Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");

    // If Email Has Changed -> Transition to Inline Verification Screen
    if (profileData.email.trim() !== currentEmail) {
      setPendingEmail(profileData.email.trim());
      setIsVerifyingEmailStep(true);
      return;
    }

    // Standard Save without email change
    await saveProfileChanges(
      profileData,
      "Your personal information has been updated successfully."
    );
  };

  // Helper Save Routine
  const saveProfileChanges = async (updatedData, message) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (onSaveProfile) {
      onSaveProfile(updatedData);
    }

    setIsSaving(false);
    setProfileSuccessMsg(message);

    // Auto-revert back to edit form after 2 seconds
    setTimeout(() => {
      setProfileSuccessMsg("");
    }, 2000);
  };

  // OTP Handling
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Submit OTP Inline
  const handleVerifyOtpInPlace = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    // Simulate Network Verification
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedData = { ...profileData, email: pendingEmail };
    setCurrentEmail(pendingEmail);
    setIsVerifyingEmailStep(false);
    setIsVerifying(false);
    setOtp(["", "", "", "", "", ""]);

    await saveProfileChanges(
      updatedData,
      "Your email address has been verified and updated successfully."
    );
  };

  // Cancel Email Verification
  const handleCancelVerification = () => {
    setIsVerifyingEmailStep(false);
    setProfileData((prev) => ({ ...prev, email: currentEmail }));
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setIsPasswordSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsPasswordSaving(false);
    setIsChangingPasswordStep(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordSuccessMsg("Your password has been changed successfully.");

    // Auto-revert back to basic security view after 2 seconds
    setTimeout(() => {
      setPasswordSuccessMsg("");
    }, 2000);
  };

  // Cancel Password Change
  const handleCancelPasswordChange = () => {
    setIsChangingPasswordStep(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };

  // In-Place Standard Log Out Handler
  const handleLogoutClick = async () => {
    if (logoutStage === "idle") {
      setLogoutStage("confirm");

      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = setTimeout(() => {
        setLogoutStage("idle");
      }, 4000);
      return;
    }

    if (logoutStage === "confirm") {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      setLogoutStage("logging-out");

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (onLogout) {
        onLogout();
      }
    }
  };

  // In-Place Logout All Devices Handler
  const handleLogoutAllDevicesClick = async () => {
    if (logoutAllStage === "idle") {
      setLogoutAllStage("confirm");

      if (logoutAllTimerRef.current) clearTimeout(logoutAllTimerRef.current);
      logoutAllTimerRef.current = setTimeout(() => {
        setLogoutAllStage("idle");
      }, 4000);
      return;
    }

    if (logoutAllStage === "confirm") {
      if (logoutAllTimerRef.current) clearTimeout(logoutAllTimerRef.current);
      setLogoutAllStage("logging-out");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onLogoutAllDevices) {
        onLogoutAllDevices();
      }
    }
  };

  return (
    <section className="w-full font-primary px-5 py-5 sm:px-8 lg:px-12">
      <div>
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="h-px w-8 bg-black" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45">
                Personal Account
              </span>
            </div>
            <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.05em] text-black">
              My Profile
            </h1>
          </div>

          <p className="hidden text-right text-xs sm:text-sm leading-relaxed text-black/40 md:block max-w-xs">
            Manage your personal information
            <br />
            and account security settings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Centered User Branding & Sidebar Shortcuts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-black/10 p-6 sm:p-8 bg-neutral-50/40 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
              {/* Centered Profile Avatar Logo & Name */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white text-xl font-bold shadow-md shadow-black/10 will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105">
                  {profileData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>

                <h2 className="mt-4 text-lg font-bold tracking-tight text-black">
                  {profileData.name}
                </h2>
                <p className="text-xs text-black/45 font-medium mt-0.5">
                  {currentEmail}
                </p>

                <span className="mt-3 inline-block rounded-full bg-black/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-black/60">
                  Member Since {profileData.memberSince}
                </span>
              </div>

              {/* Navigation Shortcuts */}
              <div className="mt-8 space-y-2 border-t border-black/10 pt-6">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                  Quick Navigation
                </p>

                <Link
                  to="/orders"
                  className="group flex items-center justify-between rounded-xl border border-black/10 p-3.5 text-xs font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-black hover:bg-black hover:text-white hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <Package size={16} strokeWidth={1.8} />
                    <span>View Orders</span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/addresses"
                  className="group flex items-center justify-between rounded-xl border border-black/10 p-3.5 text-xs font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-black hover:bg-black hover:text-white hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={16} strokeWidth={1.8} />
                    <span>Saved Delivery Addresses</span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-1"
                  />
                </Link>
              </div>

              {/* Session Controls */}
              <div className="mt-8 space-y-2.5 border-t border-black/10 pt-6">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                  Session Actions
                </p>

                {/* IN-PLACE ANIMATED STANDARD LOG OUT BUTTON */}
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  disabled={logoutStage === "logging-out"}
                  className={`group relative flex w-full items-center justify-between overflow-hidden rounded-xl border p-3.5 text-xs font-semibold transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer active:scale-[0.98] ${
                    logoutStage === "confirm"
                      ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/20 animate-pulse"
                      : logoutStage === "logging-out"
                      ? "border-red-600 bg-red-600 text-white opacity-85"
                      : "border-black/10 text-red-600 hover:border-red-600 hover:bg-red-50/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {logoutStage === "logging-out" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : logoutStage === "confirm" ? (
                      <AlertCircle size={16} />
                    ) : (
                      <LogOut size={16} strokeWidth={1.8} />
                    )}

                    <span>
                      {logoutStage === "confirm"
                        ? "Confirm Log Out?"
                        : logoutStage === "logging-out"
                        ? "Logging Out..."
                        : "Log Out"}
                    </span>
                  </div>

                  <ArrowRight
                    size={14}
                    className={`will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      logoutStage === "confirm"
                        ? "translate-x-1"
                        : "group-hover:translate-x-1"
                    }`}
                  />
                </button>

                {/* IN-PLACE ANIMATED LOG OUT FROM ALL DEVICES BUTTON */}
                <button
                  type="button"
                  onClick={handleLogoutAllDevicesClick}
                  disabled={logoutAllStage === "logging-out"}
                  className={`group relative flex w-full items-center justify-between overflow-hidden rounded-xl border p-3.5 text-xs font-semibold transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer active:scale-[0.98] ${
                    logoutAllStage === "confirm"
                      ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/20 animate-pulse"
                      : logoutAllStage === "logging-out"
                      ? "border-red-600 bg-red-600 text-white opacity-85"
                      : "border-red-200 bg-red-50/40 text-red-700 hover:border-red-600 hover:bg-red-600 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {logoutAllStage === "logging-out" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : logoutAllStage === "confirm" ? (
                      <AlertCircle size={16} />
                    ) : (
                      <Smartphone size={16} strokeWidth={1.8} />
                    )}

                    <span>
                      {logoutAllStage === "confirm"
                        ? "Confirm Log Out All?"
                        : logoutAllStage === "logging-out"
                        ? "Logging Out All..."
                        : "Log Out from All Devices"}
                    </span>
                  </div>

                  <ArrowRight
                    size={14}
                    className={`will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      logoutAllStage === "confirm"
                        ? "translate-x-1"
                        : "group-hover:translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Personal Info & Security Space */}
          <div className="lg:col-span-8 space-y-8">
            {/* PERSONAL INFORMATION CARD */}
            <div className="rounded-2xl border border-black/10 p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
              {profileSuccessMsg ? (
                <div className="animate-in fade-in duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white mb-4 shadow-md shadow-black/10 animate-in zoom-in-95 duration-500">
                    <CheckCircle2 size={26} strokeWidth={1.8} />
                  </div>

                  <h3 className="text-base font-bold text-black tracking-tight">
                    Update Successful
                  </h3>

                  <p className="mt-2 text-xs text-black/50 max-w-sm mx-auto leading-relaxed">
                    {profileSuccessMsg}
                  </p>
                </div>
              ) : !isVerifyingEmailStep ? (
                <div className="animate-in fade-in duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                  <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
                    <div className="flex items-center gap-2">
                      <UserRound size={16} className="text-black" />
                      <h3 className="text-xs font-bold tracking-wider text-black uppercase">
                        Personal Information
                      </h3>
                    </div>
                    <span className="text-[11px] font-medium text-black/45">
                      Update your account details
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40 mb-1.5"
                        >
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={profileData.name}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-black/10 bg-neutral-50/40 px-4 py-3 text-xs text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40 mb-1.5"
                        >
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="text"
                          required
                          value={profileData.phone}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-black/10 bg-neutral-50/40 px-4 py-3 text-xs text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="email"
                          className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40"
                        >
                          Email Address
                        </label>
                        <span className="text-[10px] text-black/50 font-medium">
                          Requires verification if changed
                        </span>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={profileData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-black/10 bg-neutral-50/40 px-4 py-3 text-xs text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                    </div>

                    <div className="flex justify-end py-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-6 py-2.5 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer shadow-sm disabled:pointer-events-none disabled:opacity-75"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-inherit" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save Changes</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-3 duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] py-2">
                  <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
                    <button
                      type="button"
                      onClick={handleCancelVerification}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/60 hover:text-black transition-colors duration-300 cursor-pointer"
                    >
                      <ArrowLeft size={15} />
                      <span>Back to Profile</span>
                    </button>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-black/60">
                      Step 2 of 2: Verification
                    </span>
                  </div>

                  <div className="max-w-md mx-auto text-center py-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white mb-4 shadow-sm">
                      <Mail size={22} />
                    </div>

                    <h3 className="text-base font-bold text-black tracking-tight">
                      Verify Your New Email
                    </h3>

                    <p className="mt-2 text-xs text-black/60 leading-relaxed">
                      We've sent a 6-digit verification code to{" "}
                      <span className="font-semibold text-black">
                        {pendingEmail}
                      </span>
                      . Please enter it below to confirm your new email address.
                    </p>

                    <form
                      onSubmit={handleVerifyOtpInPlace}
                      className="mt-6 space-y-4"
                    >
                      <div className="flex items-center justify-center gap-2">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (inputRefs.current[idx] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleOtpChange(idx, e.target.value)
                            }
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="h-12 w-11 rounded-xl border border-black/15 bg-neutral-50 text-center text-base font-bold text-black focus:border-black focus:outline-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                          />
                        ))}
                      </div>

                      {otpError && (
                        <p className="text-[11px] font-medium text-red-600 text-center animate-in fade-in duration-300">
                          {otpError}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 text-[11px]">
                        <span className="text-black/45">
                          Didn't receive code?
                        </span>
                        <button
                          type="button"
                          className="font-semibold text-black hover:underline cursor-pointer transition-colors duration-300"
                        >
                          Resend Code
                        </button>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCancelVerification}
                          className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-6 py-2.5 text-xs font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-black hover:text-white active:scale-95 cursor-pointer shadow-sm"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          disabled={isVerifying}
                          className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-6 py-2.5 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer shadow-sm disabled:pointer-events-none disabled:opacity-75"
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 size={14} className="animate-spin text-inherit" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <span>Confirm and Save</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* SECURITY & PASSWORD CARD */}
            <div className="rounded-2xl border border-black/10 p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
              {passwordSuccessMsg ? (
                <div className="animate-in fade-in duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white mb-4 shadow-md shadow-black/10 animate-in zoom-in-95 duration-500">
                    <CheckCircle2 size={26} strokeWidth={1.8} />
                  </div>

                  <h3 className="text-base font-bold text-black tracking-tight">
                    Password Changed
                  </h3>

                  <p className="mt-2 text-xs text-black/50 max-w-sm mx-auto leading-relaxed">
                    {passwordSuccessMsg}
                  </p>
                </div>
              ) : !isChangingPasswordStep ? (
                <div className="animate-in fade-in duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                  <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
                    <div className="flex items-center gap-2">
                      <LockKeyholeOpen size={16} className="text-black" />
                      <h3 className="text-xs font-bold tracking-wider text-black uppercase">
                        Security & Password
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-black/10 bg-neutral-50/30 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                    <div className="flex items-center gap-3">
                      <ShieldCheck
                        size={20}
                        className="text-black/60 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-black">
                          Password Protection
                        </p>
                        <p className="text-[11px] text-black/45 mt-0.5">
                          Session security active across authorized browsers
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsChangingPasswordStep(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-6 py-2.5 text-xs font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-black hover:text-white active:scale-95 cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-3 duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                  <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/60 hover:text-black transition-colors duration-300 cursor-pointer"
                    >
                      <ArrowLeft size={15} />
                      <span>Cancel</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <KeyRound size={16} className="text-black/45" />
                      <h3 className="text-[11px] font-medium tracking-wider text-black/45">
                        Update Your Password
                      </h3>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40 mb-1.5"
                      >
                        Current Password
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword.current ? "text" : "password"}
                          required
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordInputChange}
                          placeholder="Enter current password"
                          className="w-full rounded-xl border border-black/10 bg-neutral-50/40 px-4 py-3 pr-10 text-xs text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => ({
                              ...prev,
                              current: !prev.current,
                            }))
                          }
                          className="absolute right-3.5 text-black/40 hover:text-black transition-colors duration-300 cursor-pointer"
                        >
                          {showPassword.current ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* New Password */}
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40 mb-1.5"
                        >
                          New Password
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword.new ? "text" : "password"}
                            required
                            value={passwordForm.newPassword}
                            onChange={handlePasswordInputChange}
                            placeholder="Enter new password"
                            className="w-full rounded-xl border border-black/10 bg-neutral-50/40 px-4 py-3 pr-10 text-xs text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                            className="absolute right-3.5 text-black/40 hover:text-black transition-colors duration-300 cursor-pointer"
                          >
                            {showPassword.new ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40 mb-1.5"
                        >
                          Confirm New Password
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword.confirm ? "text" : "password"}
                            required
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordInputChange}
                            placeholder="Confirm new password"
                            className="w-full rounded-xl border border-black/10 bg-neutral-50/40 px-4 py-3 pr-10 text-xs text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                            className="absolute right-3.5 text-black/40 hover:text-black transition-colors duration-300 cursor-pointer"
                          >
                            {showPassword.confirm ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {passwordError && (
                      <p className="text-[11px] font-medium text-red-600 animate-in fade-in duration-300">
                        {passwordError}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleCancelPasswordChange}
                        className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-6 py-2.5 text-xs font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-black hover:text-white active:scale-95 cursor-pointer shadow-sm"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isPasswordSaving}
                        className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white hover:bg-black hover:text-white px-6 py-2.5 text-xs font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer shadow-sm disabled:pointer-events-none disabled:opacity-75"
                      >
                        {isPasswordSaving ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-inherit" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <span>Save Password</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;