import React from 'react';
import { Flame, Bed, Sparkles, Mountain, Castle, Waves, Tent, Trees, Snowflake, Palmtree, Warehouse, LayoutGrid } from 'lucide-react';

const CATEGORIES = [
    { label: 'All', icon: LayoutGrid },
    { label: 'Trending', icon: Flame },
    { label: 'Rooms', icon: Bed },
    { label: 'Iconics', icon: Sparkles },
    { label: 'Mountains', icon: Mountain },
    { label: 'Castles', icon: Castle },
    { label: 'Amazing Pools', icon: Waves },
    { label: 'Camping', icon: Tent },
    { label: 'Farms', icon: Trees },
    { label: 'Arctic', icon: Snowflake },
    { label: 'Beachfront', icon: Palmtree },
    { label: 'Domes', icon: Warehouse },
];

export default function CategoryFilterBar({ selectedCategory, onSelectCategory, showTax, onToggleTax }) {
    return (
        <div className="bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 py-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Horizontal Scrollable Categories */}
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = selectedCategory === cat.label || (!selectedCategory && cat.label === 'All');
                        return (
                            <button
                                key={cat.label}
                                onClick={() => onSelectCategory(cat.label === 'All' ? '' : cat.label)}
                                className={`flex flex-col items-center gap-1.5 shrink-0 transition-smooth group cursor-pointer pb-1 border-b-2 ${
                                    isSelected
                                        ? 'border-rose-500 text-rose-500 dark:text-rose-400 font-bold'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 font-medium'
                                }`}
                            >
                                <Icon className={`w-6 h-6 transition-smooth ${isSelected ? 'scale-110 text-rose-500' : 'group-hover:scale-105'}`} />
                                <span className="text-xs tracking-tight whitespace-nowrap">{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tax Toggle Control */}
                <div className="shrink-0 flex items-center gap-3 border border-slate-200/90 dark:border-slate-800 rounded-2xl py-2.5 px-4 bg-slate-50 dark:bg-slate-900 transition-smooth shadow-2xs">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Display total before taxes</span>
                    <button
                        type="button"
                        onClick={onToggleTax}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            showTax ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-200 shadow-md ring-0 transition duration-200 ease-in-out ${
                                showTax ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>

            </div>
        </div>
    );
}

