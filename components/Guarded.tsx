"use client";

import { ReactNode, useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Guarded({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-lg">Checking your pantry...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
        <h2 className="text-2xl font-display">Members only kitchen</h2>
        <p className="text-sm text-foreground/70">
          Sign in to upload your culinary beats. We use magic links or email + password.
        </p>
        <Link
          href="/"
          className="rounded-full bg-copper-500 px-6 py-2 text-sm font-semibold text-background shadow-glow"
        >
          Go back home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
