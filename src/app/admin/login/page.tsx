"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

/*
 * Date: 2026-02-26
 * Time: 18:14:40 -06:00 (CST)
 * Context/Notes: Updated admin email placeholder to neutral craftsman address aligned with env-driven allowlist gating.
 * Agent Name: Codex
 */

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);

    useEffect(() => {
        setSupabase(createClient());
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            setError("Initializing login...");
            return;
        }
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            window.location.href = "/admin/nexus";
        }
    };

    return (
        <div className="min-h-screen bg-[#eef0eb]">
            <a
                href="#admin-login-panel"
                className="pointer-events-none fixed left-4 top-4 z-[999] -translate-y-24 rounded-full bg-brand-burgundy px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg transition focus:pointer-events-auto focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
            >
                Skip to login
            </a>
            <div className="admin-dashboard-frame flex min-h-screen items-center justify-center px-4 py-8 md:px-6">
                <section
                    id="admin-login-panel"
                    className="w-full max-w-[460px] rounded-[2rem] border border-white/70 bg-[#faf7f2]/94 p-6 shadow-[0_24px_80px_rgba(58,25,16,0.12)] backdrop-blur-xl md:p-8"
                >
                    <div className="text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-burgundy">
                            SJR Nexus
                        </p>
                        <h1 className="mt-3 font-serif text-4xl text-stone-900 md:text-5xl">
                            Secure login
                        </h1>
                        <p className="mt-3 text-sm leading-relaxed text-stone-600">
                            Sign in with an allowlisted admin account.
                        </p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-brand-burgundy">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block min-h-12 w-full rounded-[1.15rem] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
                                    placeholder="craftsman@susiesjewelryrepair.com"
                                />
                            </div>
                            <div>
                                <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-brand-burgundy">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block min-h-12 w-full rounded-[1.15rem] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-[1rem] border border-red-100 bg-red-50 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-burgundy px-5 py-4 text-xs font-bold uppercase tracking-[0.3em] text-white transition-colors hover:bg-brand-burgundy-deep focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Enter Mission Control"}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
