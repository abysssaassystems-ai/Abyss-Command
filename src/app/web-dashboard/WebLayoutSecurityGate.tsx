"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";

export default function WebLayoutSecurityGate({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const enforceStructuralPerimeter = async () => {
      try {
        // 1. VALIDATE SESSION: Intercept anonymous requests before DOM tree allocation
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.replace("/web-login");
          return;
        }

        // 2. ENFORCE SPECIFIC CLIENT TENANCY: Cross-reference UUID profile matching
        const { data: profile, error: profileError } = await supabase
          .from("web_login_users")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          // Cross-tenant breach detected (e.g. app consumer jumping boundaries into web development architecture)
          await supabase.auth.signOut();
          router.replace("/web-login");
          return;
        }

        // Perimeter handshake complete
        setIsAuthorized(true);
      } catch (err) {
        router.replace("/web-login");
      } finally {
        setIsLoading(false);
      }
    };

    enforceStructuralPerimeter();

    // 3. EVENT LOOP SUBSCRIPTION: Instantly wipe out layout shell if remote session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setIsAuthorized(false);
        router.replace("/web-login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // 4. PREVENT SCAFFOLDING FLASH: Show structural void rather than leaking unauthenticated layout layers
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#4B5563] text-[#F9FAFB] items-center justify-center font-mono text-[11px] tracking-widest uppercase select-none">
        <div className="text-center space-y-2">
          <div className="animate-pulse font-bold text-[#00F2FE]">// INITIALIZING INFRASTRUCTURE MATRIX //</div>
          <div className="text-gray-400">Verifying Workspace Clearance...</div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <div className="min-h-screen bg-[#4B5563]" />;
  }

  return <>{children}</>;
}