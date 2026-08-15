import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Star, MapPin, Share2, Heart, ShieldCheck, User, Calendar, Users, Edit, Trash2, CheckCircle, AlertTriangle, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Map from '../components/Map';
import Skeleton from '../components/Skeleton';


const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function ListingDetailPage({ openAuthModal }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    // Reservation & Availability state
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [reserving, setReserving] = useState(false);
    const [availability, setAvailability] = useState({ checked: false, isAvailable: true, message: '' });

    // Review state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        fetchListingDetail();
    }, [id]);

    useEffect(() => {
        if (checkIn && checkOut) {
            checkDateAvailability();
        } else {
            setAvailability({ checked: false, isAvailable: true, message: '' });
        }
    }, [checkIn, checkOut]);

    const fetchListingDetail = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/listings/${id}`);
            if (res.data.success) {
                setListing(res.data.listing);
            }
        } catch (err) {
            toast.error('Listing not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const checkDateAvailability = async () => {
        try {
            const res = await axios.post('/api/reservations/check-availability', {
                listingId: id,
                checkin: checkIn,
                checkout: checkOut
            });
            if (res.data) {
                setAvailability({
                    checked: true,
                    isAvailable: res.data.available,
                    message: res.data.message
                });
            }
        } catch (err) {
            setAvailability({
                checked: true,
                isAvailable: false,
                message: err.response?.data?.message || 'Date check failed'
            });
        }
    };

    const handleDeleteListing = async () => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            const res = await axios.delete(`/api/listings/${id}`);
            if (res.data.success) {
                toast.success('Listing deleted successfully');
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete listing');
        }
    };

    // Calculate nights & price
    const calculateNights = () => {
        if (!checkIn || !checkOut) return 1;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };

    const nights = calculateNights();
    const pricePerNight = listing?.price || 0;
    const baseTotal = pricePerNight * nights;
    const serviceFee = Math.round(baseTotal * 0.12);
    const finalPrice = baseTotal + serviceFee;

    const handleCreateReservation = async (e) => {
        e.preventDefault();
        if (!user) {
            openAuthModal('login');
            return;
        }
        if (!checkIn || !checkOut) {
            toast.error('Please select both Check-In and Check-Out dates');
            return;
        }

        if (availability.checked && !availability.isAvailable) {
            toast.error(availability.message || 'Selected dates are unavailable.');
            return;
        }

        setReserving(true);
        try {
            // Load Razorpay Script
            const sdkLoaded = await loadRazorpayScript();
            if (!sdkLoaded) {
                toast.error('Failed to load Razorpay SDK. Please check your network connection.');
                setReserving(false);
                return;
            }

            // Create Razorpay Order
            const orderRes = await axios.post('/api/reservations/create-razorpay-order', {
                listingId: id,
                checkin: checkIn,
                checkout: checkOut,
                guests,
                finalPrice
            });

            if (!orderRes.data.success) {
                toast.error(orderRes.data.message || 'Failed to create payment order');
                setReserving(false);
                return;
            }

            const { orderId, amount, currency, keyId } = orderRes.data;

            // Initialize Razorpay Options
            const options = {
                key: keyId,
                amount: amount,
                currency: currency || 'INR',
                name: 'WanderStay',
                description: `Reservation for ${listing.title}`,
                order_id: orderId.startsWith('order_test_') ? undefined : orderId,
                handler: async function (response) {

                    try {
                        const verifyRes = await axios.post('/api/reservations/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id || orderId,
                            razorpay_payment_id: response.razorpay_payment_id || `pay_test_${Date.now()}`,
                            razorpay_signature: response.razorpay_signature || 'test_signature',
                            listingId: id,
                            checkin: checkIn,
                            checkout: checkOut,
                            guests,
                            finalPrice
                        });

                        if (verifyRes.data.success) {
                            toast.success('🎉 Payment Verified & Reservation Confirmed!');
                            navigate('/reservations');
                        } else {
                            toast.error(verifyRes.data.message || 'Payment verification failed.');
                        }
                    } catch (err) {
                        toast.error(err.response?.data?.message || 'Payment verification failed');
                    } finally {
                        setReserving(false);
                    }
                },
                prefill: {
                    name: user.username,
                    email: user.email || 'guest@wanderstay.com'
                },
                theme: {
                    color: '#fe385c'
                },
                modal: {
                    ondismiss: function () {
                        toast('Payment cancelled', { icon: '⚠️' });
                        setReserving(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error(`Payment failed: ${response.error.description}`);
                setReserving(false);
            });
            rzp.open();

        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking process failed');
            setReserving(false);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!user) {
            openAuthModal('login');
            return;
        }
        if (!comment.trim()) {
            toast.error('Please write a review comment');
            return;
        }

        setSubmittingReview(true);
        try {
            const res = await axios.post(`/api/listings/${id}/reviews`, {
                review: { rating, comment }
            });
            if (res.data.success) {
                toast.success('Review published!');
                setComment('');
                setRating(5);
                fetchListingDetail();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const res = await axios.delete(`/api/listings/${id}/reviews/${reviewId}`);
            if (res.data.success) {
                toast.success('Review deleted');
                fetchListingDetail();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete review');
        }
    };

    if (loading) {

        return (
            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Header Skeleton */}
                    <div className="space-y-3">
                        <Skeleton className="h-9 w-2/5" variant="text" />
                        <Skeleton className="h-4 w-1/4" variant="text" />
                    </div>

                    {/* Hero Image Skeleton */}
                    <Skeleton className="aspect-16/9 md:aspect-21/9 w-full rounded-3xl" />

                    {/* Grid Layout Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
                                <div className="space-y-2 w-1/2">
                                    <Skeleton className="h-6 w-3/4" variant="text" />
                                    <Skeleton className="h-4 w-1/2" variant="text" />
                                </div>
                                <Skeleton className="w-12 h-12" variant="circle" />
                            </div>

                            <div className="space-y-3">
                                <Skeleton className="h-6 w-1/4" variant="text" />
                                <Skeleton className="h-24 w-full rounded-2xl" />
                            </div>

                            <div className="space-y-3">
                                <Skeleton className="h-6 w-1/4" variant="text" />
                                <Skeleton className="h-64 w-full rounded-3xl" />
                            </div>
                        </div>

                        {/* Booking Card Skeleton */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
                                <div className="flex justify-between">
                                    <Skeleton className="h-8 w-1/3" variant="text" />
                                    <Skeleton className="h-6 w-1/4" variant="text" />
                                </div>
                                <Skeleton className="h-44 w-full rounded-2xl" />
                                <Skeleton className="h-12 w-full rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    if (!listing) return null;

    const isOwner = user && listing.owner && (user._id === listing.owner._id || user._id === listing.owner);
    const imageUrl = listing.image?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

    const handleShare = async () => {

        const shareData = {
            title: listing.title,
            text: `Check out ${listing.title} on WanderStay!`,
            url: window.location.href,
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                // Native share closed/cancelled, fallback to clipboard if needed
            }
        }
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('🔗 Listing link copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen pb-16 transition-colors duration-300">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Title & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{listing.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2">
                            <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span>{listing.reviews?.length > 0 ? (listing.reviews.reduce((a, r) => a + (r.rating || 5), 0) / listing.reviews.length).toFixed(1) : 'New'}</span>
                                <span className="text-slate-400">({listing.reviews?.length || 0} reviews)</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-rose-500" />
                                <span>{listing.location}, {listing.country}</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isOwner && (
                            <>
                                <Link
                                    to={`/listings/${id}/edit`}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition-smooth"
                                >
                                    <Edit className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Edit</span>
                                </Link>
                                <button
                                    onClick={handleDeleteListing}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/80 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 shadow-2xs transition-smooth cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-smooth cursor-pointer"
                        >
                            <Share2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Share</span>
                        </button>
                    </div>
                </div>


                {/* Hero Image Banner */}
                <div className="relative aspect-16/9 md:aspect-21/9 w-full overflow-hidden rounded-3xl shadow-lg mb-10 bg-slate-200 dark:bg-slate-800">
                    <img
                        src={imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />
                    {listing.categories && listing.categories.length > 0 && (
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {listing.categories.map((c, idx) => (
                                <span key={idx} className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                                    {c}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Description, Host Info, Amenities, Map, Reviews */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Host Information */}
                        <div className="flex items-center justify-between pb-8 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    Hosted by {listing.owner?.username || 'WanderStay Host'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Superhost • Experienced & highly rated</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
                                {listing.owner?.username ? listing.owner.username.charAt(0).toUpperCase() : <User />}
                            </div>
                        </div>

                        {/* Highlight Perks */}
                        <div className="space-y-4 pb-8 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-start gap-4">
                                <ShieldCheck className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Self Check-in</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Check yourself in with the smart lock system.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Great Location</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">95% of recent guests gave the location a 5-star rating.</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pb-8 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-3">About this space</h3>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {listing.description}
                            </p>
                        </div>

                        {/* Map Section */}
                        <div className="pb-8 border-b border-slate-200 dark:border-slate-800 space-y-4">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Where you'll be</h3>
                            <Map geometry={listing.geometry} location={`${listing.location}, ${listing.country}`} />
                        </div>

                        {/* Reviews Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                                    {listing.reviews?.length > 0 ? (listing.reviews.reduce((a, r) => a + (r.rating || 5), 0) / listing.reviews.length).toFixed(1) : 'No reviews yet'}
                                </h3>
                                <span className="text-slate-400 text-sm">({listing.reviews?.length || 0} reviews)</span>
                            </div>

                            {/* Write Review Form */}
                            <form onSubmit={handleAddReview} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Leave a Review</h4>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Rating</label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                            >
                                                <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Comment</label>
                                    <textarea
                                        rows="3"
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience staying here..."
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-smooth shadow-sm cursor-pointer"
                                >
                                    {submittingReview ? 'Posting...' : 'Submit Review'}
                                </button>
                            </form>

                            {/* Existing Reviews Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                {listing.reviews?.map((r) => (
                                    <div key={r._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs">
                                                        {r.author?.username ? r.author.username.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{r.author?.username || 'Guest'}</span>
                                                </div>
                                                <div className="flex items-center text-amber-400">
                                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">{r.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">{r.comment}</p>
                                        </div>

                                        {user && (user._id === r.author?._id || user._id === r.author) && (
                                            <button
                                                onClick={() => handleDeleteReview(r._id)}
                                                className="text-[11px] font-bold text-rose-500 hover:underline self-end cursor-pointer"
                                            >
                                                Delete Review
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Reservation Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">

                            <div className="flex items-baseline justify-between">
                                <div>
                                    <span className="text-2xl font-black text-slate-900 dark:text-slate-100">₹{pricePerNight.toLocaleString('en-IN')}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium"> / night</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span>{listing.reviews?.length > 0 ? (listing.reviews.reduce((a, r) => a + (r.rating || 5), 0) / listing.reviews.length).toFixed(1) : 'New'}</span>
                                </div>
                            </div>

                            {/* Booking Inputs */}
                            <form onSubmit={handleCreateReservation} className="space-y-4">
                                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
                                    <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800">
                                        <div className="p-3 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                            <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Check-In</label>
                                            <input
                                                type="date"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                value={checkIn}
                                                onChange={(e) => setCheckIn(e.target.value)}
                                                className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                                            />
                                        </div>
                                        <div className="p-3 bg-slate-50 dark:bg-slate-950">
                                            <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Check-Out</label>
                                            <input
                                                type="date"
                                                required
                                                min={checkIn || new Date().toISOString().split('T')[0]}
                                                value={checkOut}
                                                onChange={(e) => setCheckOut(e.target.value)}
                                                className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-950">
                                        <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Guests</label>
                                        <select
                                            value={guests}
                                            onChange={(e) => setGuests(Number(e.target.value))}
                                            className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                                                <option key={g} value={g} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">{g} {g === 1 ? 'Guest' : 'Guests'}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>


                                {/* Real-time Availability Feedback Badge */}
                                {availability.checked && (
                                    <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border ${availability.isAvailable
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>
                                        {availability.isAvailable ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Dates are available for booking!</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                                                <span>{availability.message || 'Already booked for these dates.'}</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={reserving || (availability.checked && !availability.isAvailable)}
                                    className={`w-full py-3.5 text-white font-extrabold rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer ${availability.checked && !availability.isAvailable
                                        ? 'bg-slate-300 shadow-none cursor-not-allowed text-slate-500'
                                        : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-500/25'
                                        }`}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    <span>{reserving ? 'Processing Payment...' : 'Pay & Book with Razorpay'}</span>
                                </button>
                            </form>

                            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
                                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Secured by Razorpay Test Mode</span>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                                <div className="flex justify-between">
                                    <span>₹{pricePerNight.toLocaleString('en-IN')} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
                                    <span>₹{baseTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>WanderStay service fee</span>
                                    <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-3 border-t border-slate-200">
                                    <span>Total Payable</span>
                                    <span>₹{finalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}

