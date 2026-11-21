"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ShieldCheck, Mail, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        // Successful login -> Redirect to Admin Dashboard
        window.location.href = data.redirectUrl || "/admin";
      } else {
        setError(data.error || "Invalid admin credentials. Please try again.");
      }
    } catch (err: any) {
      console.error("Login submission error:", err);
      setError("Network or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("admin@hyderabaddelight.com");
    setPassword("dairy@admin2026");
    setError("");
    setAutoFilled(true);
    setTimeout(() => setAutoFilled(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#1E242B] flex flex-col justify-center items-center p-4 font-inter relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#3B82C4]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Return to website link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center text-white/50 text-xs">
        <Link href="/" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to Store
        </Link>
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#E5A93C]">
          Hyderabad Delight Dairy
        </span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border-t-[8px] border-t-[#3B82C4] relative overflow-hidden">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#3B82C4] flex items-center justify-center shadow-lg shadow-[#3B82C4]/25 relative">
            <Lock className="text-white" size={26} />
            <div className="absolute -bottom-1.5 -right-1.5 bg-[#E5A93C] p-1 rounded-md shadow">
              <ShieldCheck size={14} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-playfair font-bold text-black mb-1">
            Admin Portal
          </h2>
          <p className="text-black/50 text-xs font-semibold uppercase tracking-widest">
            Email &amp; Password Sign In
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-black text-black/60 uppercase mb-1.5 tracking-wider">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={16} />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="admin@hyderabaddelight.com"
                className="w-full bg-[#F4F8FC] border-2 border-transparent focus:border-[#3B82C4] focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-black transition-all outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-black text-black/60 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="••••••••••••"
                className="w-full bg-[#F4F8FC] border-2 border-transparent focus:border-[#3B82C4] focus:bg-white rounded-xl py-3.5 pl-11 pr-12 text-sm font-bold text-black transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-[#3B82C4] hover:bg-[#2B6CB0] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#3B82C4]/20 disabled:opacity-50 transition-all active:scale-[0.98] flex justify-center items-center space-x-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="uppercase tracking-widest text-xs font-black">Authenticating...</span>
              </>
            ) : (
              <>
                <span className="uppercase tracking-widest text-xs font-black">Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Helper Card */}
        <div className="mt-6 pt-5 border-t border-black/5">
          <div className="bg-[#FAFBFD] border border-black/10 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="text-[11px] text-black/70">
              <p className="font-extrabold text-black flex items-center gap-1">
                <span>Default Admin Credentials</span>
                {autoFilled && (
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10px]">
                    <CheckCircle2 size={12} /> Auto-filled!
                  </span>
                )}
              </p>
              <p className="font-mono text-[10px] text-black/50 mt-0.5">
                admin@hyderabaddelight.com / dairy@admin2026
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[10px] font-black uppercase tracking-wider text-[#3B82C4] hover:underline px-2.5 py-1 bg-[#3B82C4]/10 rounded-lg hover:bg-[#3B82C4]/20 transition-all flex-shrink-0"
            >
              Fill Credentials
            </button>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-[10px] text-white/40 max-w-xs leading-relaxed uppercase tracking-widest font-bold">
        Protected Administrative Zone • Hyderabad Delight Dairy
      </p>
    </div>
  );
}
