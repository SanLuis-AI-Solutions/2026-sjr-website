import { SiteShell } from "@/components/site-shell";
import { BLOG_POSTS } from "@/lib/blog";
import { supabaseGet } from "@/lib/supabase/server";
import { SUPPORTED_SOCIAL_PLATFORMS, SocialPlatform } from "@/lib/automation/social-dispatcher";
import Link from "next/link";

export const dynamic = "force-dynamic";

type SharedSlugRow = {
    slug: string;
    platform: SocialPlatform;
    status: string;
    shared_at: string;
};

type ReviewStatusRow = {
    id: string;
    customer_key: string;
    channel: string;
    status: string;
    last_sent_at: string | null;
    created_at: string;
};

async function getSharedSlugs(): Promise<SharedSlugRow[]> {
    try {
        const rows = await supabaseGet("shared_slugs", "?select=slug,platform,status,shared_at");
        return Array.isArray(rows) ? rows : [];
    } catch {
        return [];
    }
}

async function getReviewStatuses(): Promise<ReviewStatusRow[]> {
    try {
        const rows = await supabaseGet("review_request_status", "?select=id,customer_key,channel,status,last_sent_at,created_at&order=created_at.desc&limit=20");
        return Array.isArray(rows) ? rows : [];
    } catch {
        return [];
    }
}

export default async function NexusPage() {
    const [shared, reviews] = await Promise.all([
        getSharedSlugs(),
        getReviewStatuses(),
    ]);

    const apiStatus = {
        gbp: !!process.env.NEXUS_GBP_ACCESS_TOKEN,
        meta: !!process.env.NEXUS_META_ACCESS_TOKEN,
        pinterest: !!process.env.NEXUS_PINTEREST_ACCESS_TOKEN,
        linkedin: !!process.env.NEXUS_LINKEDIN_ACCESS_TOKEN,
        x: !!process.env.NEXUS_X_ACCESS_TOKEN,
    };

    return (
        <SiteShell>
            <section className="min-h-screen bg-[#faf7f2] py-10 md:py-14 selection:bg-brand-gold selection:text-white">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-burgundy">
                                Command Center
                            </p>
                            <h1 className="mt-2 font-serif text-4xl text-stone-900 md:text-5xl">
                                Content <span className="text-brand-gold">Nexus</span>
                            </h1>
                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-600">
                                Orchestrating SJR&apos;s digital presence across social platforms and automated review cycles.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-brand-gold/20 bg-white/50 p-4 backdrop-blur-md">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">System Pulse</span>
                                <span className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                    </span>
                                    Operational
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Grid Layer 1: Status & Connectivity */}
                    <div className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                        <div className="glass-card flex flex-col justify-between rounded-3xl p-6 transition-all hover:border-brand-gold/40">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-burgundy">API Connectivity</span>
                            <div className="mt-8 flex flex-wrap gap-3">
                                {Object.entries(apiStatus).map(([name, active]) => (
                                    <div key={name} className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 shadow-sm">
                                        <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card col-span-2 flex flex-col justify-between rounded-3xl p-6 transition-all hover:border-brand-gold/40">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-burgundy">Sync Performance</span>
                            <div className="mt-8 grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-serif text-stone-900">{shared.length}</p>
                                    <p className="mt-1 text-[9px] uppercase tracking-widest text-stone-500">Total Shares</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-serif text-stone-900">{reviews.filter(r => r.status === 'reviewed').length}</p>
                                    <p className="mt-1 text-[9px] uppercase tracking-widest text-stone-500">Reviews Gained</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-serif text-stone-900">{Math.round((shared.length / (BLOG_POSTS.length * 4)) * 100)}%</p>
                                    <p className="mt-1 text-[9px] uppercase tracking-widest text-stone-500">Portfolio Reach</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card flex flex-col justify-between rounded-3xl p-6 transition-all hover:border-brand-gold/40">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-burgundy">Review Trickle</span>
                            <div className="mt-8 flex items-baseline gap-2">
                                <span className="text-3xl font-serif text-stone-900">{reviews.filter(r => r.status === 'queued').length}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">In Queue</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Dispatch Table */}
                    <div className="mt-8 md:mt-12 bg-white rounded-2xl md:rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
                        <div className="border-b border-stone-100 bg-stone-50/50 px-4 md:px-8 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="font-serif text-xl text-stone-900">Portfolio Synchronization</h3>
                            <button className="micro-interaction rounded-full bg-brand-burgundy px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                                Manual Sync All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-stone-50 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                                        <th className="px-8 py-5">Article</th>
                                        <th className="px-8 py-5">Google</th>
                                        <th className="px-8 py-5">Meta</th>
                                        <th className="px-8 py-5">Pinterest</th>
                                        <th className="px-8 py-5">LinkedIn</th>
                                        <th className="px-8 py-5">X</th>
                                        <th className="px-8 py-5">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-50">
                                    {BLOG_POSTS.map((post) => {
                                        const postShares = shared.filter(s => s.slug === post.slug);
                                        return (
                                            <tr key={post.slug} className="group hover:bg-stone-50/40 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-14 overflow-hidden rounded-lg bg-stone-200">
                                                            <img src={post.image} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-stone-900">{post.title}</p>
                                                            <p className="mt-1 text-[10px] text-stone-500 uppercase tracking-widest">{post.publishedAt}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                {SUPPORTED_SOCIAL_PLATFORMS.map(platform => {
                                                    const s = postShares.find(ps => ps.platform === platform);
                                                    const isLive = s?.status === 'shared';
                                                    return (
                                                        <td key={platform} className="px-8 py-6">
                                                            <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${isLive ? 'bg-brand-gold/10 text-brand-gold' : 'bg-stone-100 text-stone-400'}`}>
                                                                <span className={`h-1 w-1 rounded-full ${isLive ? 'bg-brand-gold' : 'bg-stone-300'}`} />
                                                                {isLive ? 'Live' : 'Pending'}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                                <td className="px-8 py-6">
                                                    <button className="text-brand-burgundy hover:text-brand-gold transition-colors">
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Review Stream View */}
                    <div className="mt-8 md:mt-12 grid gap-6 md:gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="bg-stone-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold/80">Automated Pipeline</span>
                                <h3 className="mt-2 font-serif text-3xl">Review <span className="text-brand-gold">Cycle</span></h3>

                                <div className="mt-10 space-y-10">
                                    {reviews.length === 0 ? (
                                        <p className="text-stone-500 italic">No review activities in the past 30 days.</p>
                                    ) : (
                                        reviews.map((r, i) => (
                                            <div key={r.id} className="relative flex items-center gap-6 group">
                                                {i !== reviews.length - 1 && (
                                                    <div className="absolute left-[13px] top-8 bottom-0 w-[1px] bg-stone-700/50" />
                                                )}
                                                <div className={`relative z-10 h-7 w-7 rounded-full border-2 border-stone-800 bg-stone-900 flex items-center justify-center transition-all group-hover:border-brand-gold ${r.status === 'reviewed' ? 'border-brand-gold bg-brand-gold/10' : ''}`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${r.status === 'reviewed' ? 'bg-brand-gold' : 'bg-stone-500'}`} />
                                                </div>
                                                <div className="flex-1 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-stone-100">{r.customer_key}</p>
                                                        <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">{r.channel} • {r.status}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] uppercase tracking-widest text-stone-500">{r.last_sent_at ? new Date(r.last_sent_at).toLocaleDateString() : 'Queued'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <div className="glass-card rounded-3xl p-8">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-burgundy">Integration Guide</span>
                                <p className="mt-4 text-xs leading-relaxed text-stone-600">
                                    New blog posts are automatically prepared for sync. To force a re-sync or manually trigger a specific platform, use the action icons in the table.
                                </p>
                                <div className="mt-6 space-y-3">
                                    <Link href="/admin/inbox" className="block text-xs font-bold uppercase tracking-widest text-brand-burgundy hover:text-brand-gold transition-colors">
                                        Manage Inbox →
                                    </Link>
                                    <Link href="#" className="block text-xs font-bold uppercase tracking-widest text-stone-400 cursor-not-allowed">
                                        API Settings (Locked)
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </SiteShell>
    );
}
