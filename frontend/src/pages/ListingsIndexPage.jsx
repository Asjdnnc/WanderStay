import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CategoryFilterBar from '../components/CategoryFilterBar';
import ListingCard from '../components/ListingCard';
import { CardSkeleton } from '../components/Skeleton';
import { Frown, Sparkles } from 'lucide-react';


export default function ListingsIndexPage({ searchKeyword }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showTax, setShowTax] = useState(false);
    const [searchParams] = useSearchParams();

    const query = searchKeyword || searchParams.get('query') || '';

    useEffect(() => {
        fetchListings();
    }, [selectedCategory, query]);

    const fetchListings = async () => {
        setLoading(true);
        try {
            let url = '/api/listings';
            if (query) {
                url = `/api/listings/search?query=${encodeURIComponent(query)}`;
            } else if (selectedCategory) {
                url = `/api/listings/filter?category=${encodeURIComponent(selectedCategory)}`;
            }
            const res = await axios.get(url);
            if (res.data.success) {
                setListings(res.data.listings || res.data.results || []);
            }
        } catch (err) {
            console.error('Error fetching listings:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Filter Bar */}
            <CategoryFilterBar
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                showTax={showTax}
                onToggleTax={() => setShowTax(!showTax)}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {query && (
                    <div className="mb-6 flex items-center gap-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                        <Sparkles className="w-5 h-5 text-rose-500" />
                        <span className="text-sm font-medium">Search results for:</span>
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">"{query}"</span>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="ml-auto text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : listings.length === 0 ? (

                    <div className="text-center py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 my-8 shadow-xs">
                        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500 mb-4">
                            <Frown className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">No listings found</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                            We couldn't find any stays matching your filters or search keywords. Try clearing filters or searching for another location.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedCategory('');
                                window.location.href = '/';
                            }}
                            className="mt-6 px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-smooth shadow-sm cursor-pointer"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {listings.map((listing) => (
                            <ListingCard key={listing._id} listing={listing} showTax={showTax} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

