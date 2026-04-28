"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Stethoscope, UserRound, Eye, EyeOff, Shield, Heart } from "lucide-react";
import { useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Role-aware colors
  const isPatient = role === "patient";
  const theme = {
    gradient: isPatient ? "linear-gradient(135deg, #10B981, #06B6D4)" : "linear-gradient(135deg, #1E3A8A, #2563EB)",
    primary: isPatient ? "#10B981" : "#2563EB",
    primaryHover: isPatient ? "#059669" : "#1D4ED8",
    bgTint: isPatient ? "#F0FDF4" : "#EFF6FF",
    shadow: isPatient ? "rgba(16, 185, 129, 0.3)" : "rgba(37, 99, 235, 0.3)",
    orb1: isPatient ? "rgba(16, 185, 129, 0.12)" : "rgba(37, 99, 235, 0.12)",
    orb2: isPatient ? "rgba(6, 182, 212, 0.10)" : "rgba(99, 102, 241, 0.10)",
    ringFocus: isPatient ? "rgba(16, 185, 129, 0.3)" : "rgba(37, 99, 235, 0.3)",
    tabActive: isPatient ? "#065F46" : "#1E3A8A",
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setLoading(true);
          await processGoogleLoginResult(result);
        }
      } catch (err: any) {
        setError("Sign-in cancelled or failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    handleRedirectResult();
  }, []);

  const processGoogleLoginResult = async (result: any) => {
    const storedRole = localStorage.getItem("pendingGoogleRole") || role;
    const payload = {
      name: result.user.displayName || "Google User",
      email: result.user.email,
      password: "google_login_dummy_password", 
      contactNumber: "0000000000",
      role: storedRole,
    };

    // Ensure user exists in backend
    await fetch(`http://localhost:5000/api/auth/${storedRole}/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: result.user.email, password: "google_login_dummy_password", role: storedRole })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Google Login failed");

    localStorage.setItem("user", JSON.stringify({ ...data, role: storedRole }));
    if (result.user.email) localStorage.setItem("userEmail", result.user.email);
    if (data.name) localStorage.setItem("userName", data.name);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.removeItem("pendingGoogleRole");

    if (!data.isProfileCompleted) router.push(`/${storedRole}/setup-profile`);
    else if (storedRole === "patient") router.push("/patient/overview");
    else router.push("/doctor/overview");
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    localStorage.setItem("pendingGoogleRole", role);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      await processGoogleLoginResult(result);
      setLoading(false);
    } catch (err: any) {
      if (
        err.code === "auth/popup-closed-by-user" || 
        err.code === "auth/popup-blocked" || 
        err.message?.includes("Cross-Origin-Opener-Policy")
      ) {
        setError("Popup blocked or closed. Switching to secure redirect...");
        signInWithRedirect(auth, provider);
      } else {
        setError("Sign-in failed. Please try again.");
        setLoading(false);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save user info (includes isProfileCompleted)
      localStorage.setItem("user", JSON.stringify({ ...data, role }));
      if (email) localStorage.setItem("userEmail", email);
      if (data.name) localStorage.setItem("userName", data.name);
      localStorage.setItem("isLoggedIn", "true");

      // 🔑 First-time login → go to profile setup; else go to dashboard
      if (!data.isProfileCompleted) {
        router.push(`/${role}/setup-profile`);
      } else if (role === "patient") {
        router.push("/patient/overview");
      } else {
        router.push("/doctor/overview");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500" style={{ background: theme.bgTint }}>
      {/* Background orbs — color shifts with role */}
      <motion.div
        key={`orb1-${role}`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-3xl pointer-events-none animate-float-slow"
        style={{ background: `radial-gradient(circle, ${theme.orb1} 0%, transparent 70%)` }}
      />
      <motion.div
        key={`orb2-${role}`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.15 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.orb2} 0%, transparent 70%)`, animationDelay: "3s", animation: "float-slow 6s ease-in-out infinite reverse" }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full glass rounded-3xl shadow-2xl overflow-hidden z-10 p-8"
        style={{ boxShadow: `0 25px 60px -12px ${theme.shadow}` }}
      >
        {/* Logo + branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <motion.div
              key={role}
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-3.5 rounded-2xl text-white shadow-xl"
              style={{ background: theme.gradient, boxShadow: `0 8px 25px ${theme.shadow}` }}
            >
              {isPatient ? <Heart size={32} /> : <Stethoscope size={32} />}
            </motion.div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#0F172A" }}>HealthSphere</h1>
          <p className="mt-2 font-medium" style={{ color: "#64748B" }}>Your Health, Centralized.</p>
        </div>

        {/* Role toggle — visually themed */}
        <div className="flex p-1.5 rounded-2xl mb-8" style={{ background: "#F1F5F9" }}>
          {(["patient", "doctor"] as const).map(r => {
            const isActive = role === r;
            const RoleIcon = r === "patient" ? UserRound : Stethoscope;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative"
                style={isActive ? {
                  background: "#FFFFFF",
                  color: theme.tabActive,
                  boxShadow: `0 2px 8px ${theme.shadow}`,
                } : {
                  color: "#94A3B8",
                }}
              >
                <RoleIcon size={16} />
                {r === "patient" ? "Patient" : "Doctor"}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#334155" }}>Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border outline-none transition-all font-medium"
              style={{ borderColor: "#E2E8F0", background: "rgba(255,255,255,0.5)" }}
              onFocus={e => { e.target.style.borderColor = theme.primary; e.target.style.boxShadow = `0 0 0 3px ${theme.ringFocus}`; e.target.style.background = "#FFFFFF"; }}
              onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; e.target.style.background = "rgba(255,255,255,0.5)"; }}
              placeholder="name@example.com"
            />
          </div>
          
          <div className="relative">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#334155" }}>Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border outline-none transition-all font-medium"
                style={{ borderColor: "#E2E8F0", background: "rgba(255,255,255,0.5)" }}
                onFocus={e => { e.target.style.borderColor = theme.primary; e.target.style.boxShadow = `0 0 0 3px ${theme.ringFocus}`; e.target.style.background = "#FFFFFF"; }}
                onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; e.target.style.background = "rgba(255,255,255,0.5)"; }}
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "#94A3B8" }}
                onMouseEnter={e => e.currentTarget.style.color = theme.primary}
                onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm font-medium text-center bg-red-50 rounded-xl py-2 px-3 border border-red-100">
              {error}
            </motion.p>
          )}

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-3.5 rounded-xl transition-all mt-2 disabled:opacity-60"
            style={{ background: theme.gradient, boxShadow: `0 4px 15px ${theme.shadow}` }}
          >
            {loading ? "Signing In..." : `Sign In as ${isPatient ? "Patient" : "Doctor"}`}
          </motion.button>
          
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-slate-50 border font-semibold py-3.5 rounded-xl transition-all mt-2 flex justify-center items-center gap-2 card-hover"
            style={{ borderColor: "#E2E8F0", color: "#334155" }}
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
            Sign in with Google
          </button>
        </form>

        {/* Footer link */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <Shield size={14} style={{ color: "#94A3B8" }}/>
          <p className="text-sm font-medium" style={{ color: "#64748B" }}>
            Don't have an account? <Link href="/register" className="font-semibold transition-colors" style={{ color: theme.primary }}>Register here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
