import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Search, Globe, User, LogOut, Calendar, PlusCircle, Menu, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onSearch, openAuthModal }) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        } else {
            navigate(`/?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-all">
                        <Compass className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5">
                        Wander<span className="text-rose-500">Stay</span>
                    </span>
                </Link>

                {/* Search Bar */}
                <form 
                    onSubmit={handleSearchSubmit} 
                    className="flex-1 max-w-md hidden md:flex items-center bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 hover:shadow-md focus-within:shadow-md focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-rose-500/50 transition-all"
                >
                    <input
                        type="text"
                        placeholder="Search destinations, hostels..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium"
                    />
                    <button type="submit" className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-smooth shrink-0 cursor-pointer">
                        <Search className="w-3.5 h-3.5" />
                    </button>
                </form>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    
                    <Link 
                        to="/listings/new" 
                        onClick={(e) => {
                            if (!user) {
                                e.preventDefault();
                                openAuthModal('login');
                            }
                        }}
                        className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 px-4 py-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-smooth"
                    >
                        <PlusCircle className="w-4 h-4 text-rose-500" />
                        <span>WanderStay your home</span>
                    </Link>

                    {/* Dark / Light Mode Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-smooth cursor-pointer"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 text-amber-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-slate-700" />
                        )}
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2.5 border border-slate-300 dark:border-slate-700 hover:shadow-md rounded-full py-1.5 px-3.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                        >
                            <Menu className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                {user ? user.username.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                            </div>
                        </button>

                        {dropdownOpen && (
                            <div 
                                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                {user ? (
                                    <>
                                        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                                            <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.username}</p>
                                        </div>

                                        <Link
                                            to="/listings/new"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-smooth"
                                        >
                                            <PlusCircle className="w-4 h-4 text-rose-500" />
                                            <span>Host a Listing</span>
                                        </Link>

                                        <Link
                                            to="/reservations"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-smooth"
                                        >
                                            <Calendar className="w-4 h-4 text-emerald-500" />
                                            <span>My Reservations</span>
                                        </Link>

                                        <hr className="my-1 border-slate-100 dark:border-slate-800" />

                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                logout();
                                            }}
                                            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 font-medium transition-smooth cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Log out</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                openAuthModal('signup');
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-smooth cursor-pointer"
                                        >
                                            Sign up
                                        </button>

                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                openAuthModal('login');
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-smooth cursor-pointer"
                                        >
                                            Log in
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden px-4 pb-3">
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-full py-2 px-4 border border-slate-200 dark:border-slate-800">
                    <input
                        type="text"
                        placeholder="Search places..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none text-slate-800 dark:text-slate-100 text-sm focus:outline-none w-full"
                    />
                    <button type="submit" className="text-rose-500 p-1">
                        <Search className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </header>
    );
}

