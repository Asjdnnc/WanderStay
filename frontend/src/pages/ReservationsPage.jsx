import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Trash2, Frown, Users, Clock, ShieldCheck, ExternalLink, X, Info, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Skeleton, { ReservationCardSkeleton } from '../components/Skeleton';

export default function ReservationsPage({ openAuthModal }) {

    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
            openAuthModal('login');
        } else if (user) {
            fetchReservations();
        }
    }, [user, authLoading]);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/reservations/showReservation');
            if (res.data.success) {
                setReservations(res.data.reservations || []);
            }
        } catch (err) {
            toast.error('Failed to load reservations');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (e, reservationId) => {
        e.stopPropagation(); // Prevent opening modal when clicking cancel
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
        try {
            const res = await axios.delete(`/api/reservations/destroyReservation/${reservationId}`);
            if (res.data.success) {
                toast.success('Reservation cancelled');
                if (selectedReservation?._id === reservationId) {
                    setSelectedReservation(null);
                }
                fetchReservations();
            }
        } catch (err) {
            toast.error('Failed to cancel reservation');
        }
    };

    if (authLoading || loading) {

        return (
            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-1/4" variant="text" />
                        <Skeleton className="h-4 w-1/3" variant="text" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <ReservationCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen pb-16 transition-colors duration-300">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
                        <Calendar className="w-7 h-7 text-rose-500" />
                        <span>My Reservations</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Click on any reservation card to view complete hotel and booking details
                    </p>
                </div>

                {reservations.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                            <Frown className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">No reservations booked yet</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                            You don't have any active trip bookings. Explore our stays and book your dream vacation!
                        </p>
                        <Link
                            to="/"
                            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/20 hover:scale-105 transition-all cursor-pointer"
                        >
                            Explore Stays
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reservations.map((res) => {
                            const listing = res.listing;
                            if (!listing) return null;
                            const imageUrl = listing.image?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

                            return (
                                <div
                                    key={res._id}
                                    onClick={() => setSelectedReservation(res)}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-500 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <img
                                                src={imageUrl}
                                                alt={listing.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                <ShieldCheck className="w-3 h-3" />
                                                <span>Paid & Confirmed</span>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-4">
                                            <div>
                                                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                                    {listing.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                                    <span>{listing.location}, {listing.country}</span>
                                                </p>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-700 dark:text-slate-300">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                                                        <Clock className="w-3.5 h-3.5" /> Check-In:
                                                    </span>
                                                    <span className="font-bold">{new Date(res.checkIn).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                                                        <Clock className="w-3.5 h-3.5" /> Check-Out:
                                                    </span>
                                                    <span className="font-bold">{new Date(res.checkOut).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800">
                                                    <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                                                        <Users className="w-3.5 h-3.5" /> Guests:
                                                    </span>
                                                    <span className="font-bold">{res.guest} {res.guest === 1 ? 'Guest' : 'Guests'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Total Price</div>
                                            <div className="text-lg font-black text-rose-600 dark:text-rose-400">₹{res.price?.toLocaleString('en-IN')}</div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => handleCancelReservation(e, res._id)}
                                                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-smooth"
                                                title="Cancel Booking"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Hotel Details & Booking Modal */}
                {selectedReservation && selectedReservation.listing && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
                            
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedReservation(null)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-smooth cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Hotel Header & Image */}
                            <div>
                                <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                                    <img
                                        src={selectedReservation.listing.image?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
                                        alt={selectedReservation.listing.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {selectedReservation.listing.location}, {selectedReservation.listing.country}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{selectedReservation.listing.title}</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                                    {selectedReservation.listing.description}
                                </p>
                            </div>

                            {/* Booking & Hotel Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Check-In Date</span>
                                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{new Date(selectedReservation.checkIn).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Check-Out Date</span>
                                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{new Date(selectedReservation.checkOut).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Guests</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedReservation.guest} {selectedReservation.guest === 1 ? 'Guest' : 'Guests'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Total Paid</span>
                                    <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">₹{selectedReservation.price?.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {/* Payment Status & Reference Info */}
                            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <div>
                                        <div className="font-bold">Payment Status: Paid</div>
                                        {selectedReservation.razorpayPaymentId && (
                                            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                                                Transaction ID: {selectedReservation.razorpayPaymentId}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-extrabold px-3 py-1 rounded-full text-[10px]">
                                    Razorpay Verified
                                </span>
                            </div>

                            {/* Modal Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={(e) => handleCancelReservation(e, selectedReservation._id)}
                                    className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl transition-smooth cursor-pointer"
                                >
                                    Cancel Booking
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate(`/listings/${selectedReservation.listing._id}`);
                                        setSelectedReservation(null);
                                    }}
                                    className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-extrabold rounded-xl shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Go to Hotel Page</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
