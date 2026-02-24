"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SiteShell } from "@/components/site-shell";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
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
        <SiteShell>
            <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl shadow-2xl border border-brand-gold/20">
                    <div>
                        <div className="flex justify-center">
                            <span className="h-12 w-12 rounded-full bg-brand-burgundy flex items-center justify-center text-white font-serif text-2xl shadow-lg ring-4 ring-brand-gold/10">
                                S
                            </span>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-serif text-stone-900">
                            Admin <span className="text-brand-gold">Access</span>
                        </h2>
                        <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-stone-500">
                            Secure entrance for SJR Master Craftsmen
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-burgundy mb-2 ml-1">
                                    Craftsman Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none relative block w-full px-4 py-3 border border-stone-200 placeholder-stone-400 text-stone-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                                    placeholder="contact@sanluisai.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-burgundy mb-2 ml-1">
                                    Security Phrase
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none relative block w-full px-4 py-3 border border-stone-200 placeholder-stone-400 text-stone-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-[10px] font-bold uppercase tracking-wider text-center bg-red-50 p-3 rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-xs font-bold uppercase tracking-[0.3em] rounded-full text-white bg-brand-burgundy hover:bg-brand-burgundy-deep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-burgundy transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Verifying..." : "Authorize →"}
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-stone-400 uppercase tracking-widest">
                            Protected by Master-Grade MFA
                        </p>
                    </form>
                </div>
            </div>
        </SiteShell>
    );
}
