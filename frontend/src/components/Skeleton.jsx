import React from 'react';

export default function Skeleton({ className = '', variant = 'rectangular' }) {
    const baseClasses = "animate-pulse bg-slate-200 dark:bg-slate-800 transition-colors duration-300";
    
    let shapeClass = "rounded-2xl";
    if (variant === 'circle') shapeClass = "rounded-full";
    if (variant === 'text') shapeClass = "rounded-md";

    return (
        <div className={`${baseClasses} ${shapeClass} ${className}`} />
    );
}

// Preset Skeletons for standard layouts
export function CardSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            <Skeleton className="aspect-4/3 w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4" variant="text" />
            <Skeleton className="h-3.5 w-1/2" variant="text" />
            <Skeleton className="h-4 w-1/3 mt-1" variant="text" />
        </div>
    );
}

export function ReservationCardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4 shadow-2xs">
            <Skeleton className="aspect-16/9 w-full rounded-2xl" />
            <Skeleton className="h-5 w-2/3" variant="text" />
            <Skeleton className="h-3.5 w-1/2" variant="text" />
            <div className="space-y-2 pt-2">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
            </div>
        </div>
    );
}

export function TableRowSkeleton({ cols = 5 }) {
    return (
        <tr className="border-b border-slate-100 dark:border-slate-800/80">
            {[...Array(cols)].map((_, i) => (
                <td key={i} className="p-3">
                    <Skeleton className="h-4 w-full" variant="text" />
                </td>
            ))}
        </tr>
    );
}
