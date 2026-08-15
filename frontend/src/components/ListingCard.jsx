import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

export default function ListingCard({ listing, showTax }) {
    const { _id, title, image, price, location, country, reviews } = listing;

    const basePrice = price || 0;
    const finalPrice = showTax ? Math.round(basePrice * 1.18) : basePrice;

    // Calculate average review rating
    const avgRating = reviews && reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
        : 'New';

    const imageUrl = image?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

    return (
        <Link to={`/listings/${_id}`} className="group flex flex-col cursor-pointer">
            {/* Thumbnail Box */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:shadow-lg transition-all duration-300">
                <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{avgRating}</span>
                </div>
            </div>

            {/* Content Details */}
            <div className="mt-3 flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {title}
                    </h3>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{location}, {country}</span>
                </p>

                <div className="mt-1 flex items-baseline gap-1 text-slate-900 dark:text-slate-100">
                    <span className="font-extrabold text-lg">₹{finalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ night</span>
                    {showTax && <span className="text-[10px] text-rose-500 font-semibold ml-1">+18% GST</span>}
                </div>
            </div>
        </Link>
    );
}

