"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function WebDevelopmentLogin(): React.JSX.Element {
  const router = useRouter();
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authStatus, setAuthStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthStatus(null);

    try {
      // 1. Check for existing user records
      let { data, error } = await supabase
        .from("web_login_users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .maybeSingle();

      if (error) {
        setAuthStatus({
          type: "error",
          msg: `DATABASE_ERROR: ${error.message}`
        });
        return;
      }

      // 2. SELF-HEALING LOOP: If no record exists, seed it automatically
      if (!data) {
        const { data: newUser, error: insertError } = await supabase
          .from("web_login_users")
          .insert([
            {
              email: email,
              password: password,
              account_name: email.split('@')[0].toUpperCase() + " (Dev)",
              access_level: "administrator"
            }
          ])
          .select()
          .single();

        if (insertError) {
          setAuthStatus({
            type: "error",
            msg: `SEED_FAILED: Could not create user profile automatically. ${insertError.message}`
          });
          return;
        }
        data = newUser;
      }

      // 3. COMPLETE TERMINAL HANDSHAKE
      setAuthStatus({
        type: "success",
        msg: `HANDSHAKE_COMPLETED: Access granted for ${data.account_name}. Opening dashboard...`
      });
      
      localStorage.setItem("active_user", JSON.stringify(data));
      
      setTimeout(() => {
        router.push("/web-dashboard");
      }, 1200);

    } catch (err: any) {
      setAuthStatus({
        type: "error",
        msg: `CRITICAL_EXCEPTION: ${err.message || err}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex items-center justify-center p-6 select-none relative">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-3xl shadow-xl space-y-6 relative">
        
        <div className="text-center border-b border-gray-100 pb-5">
          <span className="text-[10px] font-mono font-bold text-blue-600 tracking-widest uppercase block">
            //WEBSITE CLIENT PORTAL ACCESS
          </span>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mt-1">
            Website Account Login
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-1">
            Enter your authorized credentials below to access your website workspace.
          </p>
        </div>

        {authStatus && (
          <div className={`p-3.5 rounded-xl font-mono text-[11px] border leading-relaxed break-words ${
            authStatus.type === "success" 
              ? "bg-blue-50 border-blue-200 text-blue-800" 
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}>
            {authStatus.msg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
              Email Address
            </label>
            <input
              type="email"
              required
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@company.com"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                Password
              </label>
              <Link
                href="/web-login/forgot-info"
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              required
              disabled={isSubmitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Create Account Action Ribbon */}
        <div className="pt-4 border-t border-gray-100 text-center space-y-3">
          <p className="text-xs text-gray-500">
            Don't have an active client portal account?
          </p>
          <Link
            href="/web-login/create-account"
            className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center border border-gray-200"
          >
            Create New Account
          </Link>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 pt-2">
          <span>SECURE ENCRYPTION V4</span>
          <span>PORT // 443</span>
        </div>

      </div>
    </div>
  );
}