import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, ThumbsUp, ThumbsDown, Loader2, AlertTriangle } from 'lucide-react';

/**
 * AiReviewSummary
 * Fetches an AI-generated, structured summary of a listing's reviews from the
 * backend (POST /api/ai/review-summary/:listingId). The Gemini key stays on the
 * server — the frontend only ever sees the summarized JSON.
 */
export default function AiReviewSummary({ listingId, reviewCount = 0 }) {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);

    const fetchSummary = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`/api/ai/review-summary/${listingId}`);
            if (res.data.success) {
                setSummary(res.data.summary);
                setLoaded(true);
            } else {
                setError(res.data.message || 'Could not generate summary');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Could not generate the review summary.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-rose-50 to-white dark:from-slate-900 dark:to-slate-900 border border-rose-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xs">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">AI Review Summary</h3>
                </div>

                {!loaded && (
                    <button
                        onClick={fetchSummary}
                        disabled={loading || reviewCount === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        <span>{loading ? 'Summarizing...' : 'Generate Summary'}</span>
                    </button>
                )}
            </div>

            {reviewCount === 0 && !loaded && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    No reviews yet — once guests leave reviews, you can generate an AI summary here.
                </p>
            )}

            {error && (
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-3">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {summary && (
                <div className="mt-4 space-y-5 animate-in fade-in duration-300">
                    {summary.insufficient ? (
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{summary.summary}</p>
                    ) : (
                        <>
                            <div>
                                <h4 className="text-xs uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400 mb-1">Overall</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">"{summary.summary}"</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {summary.positivePoints?.length > 0 && (
                                    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 p-4">
                                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                                            <ThumbsUp className="w-4 h-4" /> What guests liked
                                        </h4>
                                        <ul className="space-y-1.5">
                                            {summary.positivePoints.map((p, i) => (
                                                <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex gap-2">
                                                    <span className="text-emerald-500">•</span>
                                                    <span>{p}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {summary.negativePoints?.length > 0 && (
                                    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-amber-100 dark:border-amber-900/40 p-4">
                                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-500 mb-2">
                                            <ThumbsDown className="w-4 h-4" /> Common complaints
                                        </h4>
                                        <ul className="space-y-1.5">
                                            {summary.negativePoints.map((p, i) => (
                                                <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex gap-2">
                                                    <span className="text-amber-500">•</span>
                                                    <span>{p}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Generated by AI from guest reviews. May contain inaccuracies.</p>
                </div>
            )}
        </div>
    );
}
