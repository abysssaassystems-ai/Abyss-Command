"use client";

import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Landmark, Loader2, AlertCircle } from "lucide-react";

interface PlaidLinkButtonProps {
  userId: string;
  onSuccessSync: () => void;
}

export default function PlaidLinkButton({ userId, onSuccessSync }: PlaidLinkButtonProps): React.JSX.Element {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isExchanging, setIsExchanging] = useState<boolean>(false);
  const [tenantEmail, setTenantEmail] = useState<string>("");
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.email) {
          setTenantEmail(parsed.email);
        } else {
          setTenantEmail("anonymous_isolated");
        }
      } catch (err) {
        console.error("PLAID_AUTH_PARSE_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    } else {
      setTenantEmail("unauthenticated_session");
    }
    setAuthInitialized(true);
  }, []);

  // Initialize and retrieve the single-use Link Token once tenancy scope is verified
  useEffect(() => {
    if (!authInitialized || !tenantEmail) return;

    async function initializePlaidLink() {
      try {
        const response = await fetch("/api/plaid/create-link-token", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantEmail,
            userId
          })
        });
        
        if (!response.ok) throw new Error("Failed secure link token initialization payload");
        
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Plaid isolation initialization sequence failed:", error);
      }
    }
    
    initializePlaidLink();
  }, [authInitialized, tenantEmail, userId]);

  // Configure the official hook layout from react-plaid-link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      setIsExchanging(true);
      try {
        const response = await fetch("/api/plaid/exchange-public-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            public_token,
            user_id: userId,
            tenantEmail,
            institution_name: metadata.institution?.name || "Connected Bank",
          }),
        });
    
        if (response.ok) {
          onSuccessSync();
        } else {
          const errorResponse = await response.json();
          console.error("❌ TENANT ENFORCEMENT PLAID EXCHANGE FAILURE:", errorResponse);
        }
      } catch (error) {
        console.error("Fatal exception during network token exchange process:", error);
      } finally {
        setIsExchanging(false);
      }
    },
    onExit: (error, metadata) => {
      if (error) {
        console.warn("User exited the Plaid link interface prematurely:", error);
      }
    }
  });

  const isInteractionDisabled = !ready || isExchanging || !authInitialized || tenantEmail === "unauthenticated_session";

  return (
    <button
      type="button"
      onClick={() => open()}
      disabled={isInteractionDisabled}
      className={`h-11 px-5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all select-none touch-manipulation flex items-center justify-center gap-2 shrink-0 cursor-pointer border shadow-2xs active:scale-98 disabled:scale-100 disabled:cursor-not-allowed ${
        isInteractionDisabled
          ? "bg-gray-100 border-gray-200 text-gray-400"
          : "bg-blue-600 border-blue-700 text-white hover:bg-blue-700 hover:border-blue-800 shadow-blue-600/10"
      }`}
    >
      {isExchanging ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current stroke-[2.5]" />
          <span>Syncing Workspace...</span>
        </>
      ) : tenantEmail === "unauthenticated_session" ? (
        <>
          <AlertCircle className="w-4 h-4 text-red-500 stroke-[2.5]" />
          <span>Session Locked</span>
        </>
      ) : (
        <>
          <Landmark className="w-4 h-4 text-current stroke-[2.5]" />
          <span>Connect Live Bank Feed</span>
        </>
      )}
    </button>
  );
}