import React from 'react';
import { Compass, Globe, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Compass className="w-6 h-6 text-rose-500" />
                            <span className="font-extrabold text-xl text-white">WanderStay</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Discover unforgettable stays, luxury villas, mountain cabins, and unique experiences around the world.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-3">Support</h4>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#" className="hover:text-rose-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-rose-400 transition-colors">AirCover Protection</a></li>
                            <li><a href="#" className="hover:text-rose-400 transition-colors">Anti-discrimination</a></li>
                            <li><a href="#" className="hover:text-rose-400 transition-colors">Cancellation options</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-3">Hosting</h4>
                        <ul className="space-y-2 text-xs">
                            <li><a href="https://wanderstay-aditya05yt.duckdns.org/listings/new" className="hover:text-rose-400 transition-colors">WanderStay your home</a></li>
                            <li><a href="#" className="hover:text-rose-400 transition-colors">Cover for Hosts</a></li>
                            <li><a href="#" className="hover:text-rose-400 transition-colors">Hosting resources</a></li>
                            <li><a href="#" className="hover:text-rose-400 transition-colors">Community forum</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <span>© {new Date().getFullYear()} WanderStay, Inc. Made with</span>
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline mx-0.5" />
                        <span>for travelers worldwide.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <span>English (IN)</span>
                        </button>
                        <span>₹ INR</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
