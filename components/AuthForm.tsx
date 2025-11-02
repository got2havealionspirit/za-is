"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "magic") {
        const { error } = await supabaseClient.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href } });
        if (error) throw error;
        setMessage("Magic link sent! Check your inbox.");
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.session) {
          setMessage("Check your inbox to confirm login.");
        } else {
          setMessage("Welcome back!");
        }
      }
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSignUp = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabaseClient.auth.signUp({ email, password });
      if (error) throw error;
      setMessage("Check your inbox to confirm your account.");
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-copper-500/30 bg-black/40 p-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em]">
        <button
          type="button"
          className={`rounded-full px-4 py-1 ${mode === "magic" ? "bg-copper-500 text-background" : "text-foreground/70"}`}
          onClick={() => setMode("magic")}
        >
          Magic Link
        </button>
        <button
          type="button"
          className={`rounded-full px-4 py-1 ${mode === "password" ? "bg-copper-500 text-background" : "text-foreground/70"}`}
          onClick={() => setMode("password")}
        >
          Password
        </button>
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@kitchen.lab"
          className="w-full rounded-xl border border-copper-500/30 bg-black/60 p-3"
        />
        {mode === "password" && (
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Secret spice"
            className="w-full rounded-xl border border-copper-500/30 bg-black/60 p-3"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-copper-500 px-6 py-2 text-sm font-semibold text-background shadow-glow disabled:opacity-60"
        >
          {loading ? "Sending..." : mode === "magic" ? "Send magic link" : "Sign in"}
        </button>
        {mode === "password" && (
          <button
            type="button"
            disabled={loading}
            onClick={handlePasswordSignUp}
            className="w-full rounded-full border border-copper-500 px-6 py-2 text-sm font-semibold text-copper-500 disabled:opacity-60"
          >
            Create account
          </button>
        )}
      </form>
      {message && <p className="mt-4 text-sm text-foreground/70">{message}</p>}
    </div>
  );
}
