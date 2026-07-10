"use client";

import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";

interface PlaidLinkButtonProps {
  userId: string;
  onSuccessSync: () => void;
}

export default function PlaidLinkButton({ userId, onSuccessSync }: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isExchanging, setIsExchanging] = useState(false);

  // Initialize and retrieve the single-use Link Token on component mount
  useEffect(() => {
    async function initializePlaidLink() {
      try {
        const response = await fetch("/api/plaid/create-link-token", { 
          method: "POST" 
        });
        
        if (!response.ok) throw new Error("Failed to clear token initialization payload");
        
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Plaid initialization sequence failed:", error);
      }
    }
    
    initializePlaidLink();
  }, []);

  // Configure the official hook layout from react-plaid-link
  const { open, ready } = usePlaidLink({
    token: linkToken,
   // ... inside your usePlaidLink configuration block:
onSuccess: async (public_token, metadata) => {
    setIsExchanging(true);
    try {
      const response = await fetch("/api/plaid/exchange-public-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_token,
          user_id: userId,
          institution_name: metadata.institution?.name || "Connected Bank",
        }),
      });
  
      if (response.ok) {
        onSuccessSync();
      } else {
        // READ THE JSON ERROR BODY SENT FROM THE SERVER
        const errorResponse = await response.json();
        console.error("❌ TRUE BACKEND CRASH ERROR:", errorResponse);
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

  return (
    <button
      type="button"
      onClick={() => open()}
      disabled={!ready || isExchanging}
      className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold text-xs px-5 h-11 rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed touch-manipulation select-none flex items-center gap-2 shrink-0"
    >
      {isExchanging ? (
        <>
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Syncing Accounts...</span>
        </>
      ) : (
        <>
          <span>🏦</span> Connect Live Bank Feed
        </>
      )}
    </button>
  );
}