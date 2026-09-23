import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Search, Loader2, Bot, Frown } from 'lucide-react';
import ListingCard from '../components/ListingCard';

const EXAMPLES = [
    'Find me a villa in Goa near the beach with WiFi and a pool under ₹4000',
    'I want a cheap property in Manali with parking and good reviews',
    'Find a property suitable for 4 people with a swimming pool',
];

/**
 * AiSearchPage — natural-language RAG search.
 * Sends the query to POST /api/ai/search. The backend performs the vector
 * retrieval + grounded Gemini answer and returns real MongoDB listings, which
 * we render with the existing ListingCard so all displayed data is authoritative.
 */
export default function AiSearchPage() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [listings, setListings] = useState([]);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const reasonFor = (id) => recommendations.find((r) => r.listingId === id)?.reason;

    const runSearch = async (q) => {
        const searchText = (q ?? query).trim();
        if (!searchText) {
            setError('Please enter a search query');
            return;
        }
        setLoading(true);
        setError('');
        setSearched(true);
        try {
            const res = await axios.post('/api/ai/search', { query: searchText });
            if (res.data.success) {
                setAnswer(res.data.answer || '');
                setRecommendations(res.data.recommendations || []);
                setListings(res.data.listings || []);
            } else {
                setError(res.data.message || 'Search failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'AI search failed. Please try again later.');
            setAnswer('');
            setRecommendations([]);
            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        runSearch();
    };

    return (
        <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

                {/* Header */}
                <div className="text-center mb-8">
                    
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                        WanderStay AI Search
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
                        Describe your ideal stay in plain language. Our AI searches only real WanderStay listings — no made-up properties.
                    </p>
                </div>

                {/* Search Box */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 shadow-lg flex items-center gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        maxLength={500}
                        placeholder="Find me a villa in Goa near the beach with WiFi and a pool under ₹4000"
                        className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-rose-500/25 transition-all disabled:opacity-60 cursor-pointer shrink-0"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        <span className="hidden sm:inline">{loading ? 'Searching' : 'Search'}</span>
                    </button>
                </form>

                {/* Example chips */}
                {!searched && (
                    <div className="mt-5 flex flex-wrap gap-2 justify-center">
                        {EXAMPLES.map((ex) => (
                            <button
                                key={ex}
                                onClick={() => { setQuery(ex); runSearch(ex); }}
                                className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3.5 py-1.5 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                            >
                                {ex}
                            </button>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="mt-6 text-center text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4">
                        {error}
                    </div>
                )}

                {/* AI Answer */}
                {answer && (
                    <div className="mt-8 flex gap-3 items-start bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xs animate-in fade-in duration-300">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-rose-500/20">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">WanderStay AI</p>
                            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{answer}</p>
                        </div>
                    </div>
                )}

                {/* Result Cards (real MongoDB listings) */}
                {listings.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {listings.map((listing) => {
                            const reason = reasonFor(listing._id);
                            return (
                                <div key={listing._id} className="flex flex-col gap-2">
                                    <ListingCard listing={listing} />
                                    {reason && (
                                        <p className="text-xs text-slate-600 dark:text-slate-400 bg-rose-50/60 dark:bg-slate-900 border border-rose-100 dark:border-slate-800 rounded-2xl px-3 py-2">
                                            <span className="font-bold text-rose-600 dark:text-rose-400">Why it matches: </span>
                                            {reason}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty state */}
                {searched && !loading && !error && listings.length === 0 && (
                    <div className="mt-10 text-center flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-3">
                            <Frown className="w-7 h-7" />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                            No matching WanderStay properties were found for that request. Try describing your stay differently.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
