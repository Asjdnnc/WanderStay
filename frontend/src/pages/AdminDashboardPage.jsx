import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    LayoutDashboard, Home, MessageSquare, Calendar, DollarSign, Users,
    Trash2, ExternalLink, Search, ShieldCheck, RefreshCw, ShieldAlert, Star,
    AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Skeleton, { TableRowSkeleton } from '../components/Skeleton';


export default function AdminDashboardPage({ openAuthModal }) {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Data state
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [listings, setListings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [bookings, setBookings] = useState([]);

    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [approvalFilter, setApprovalFilter] = useState('all'); // 'all', 'pending', 'approved'

    useEffect(() => {
        if (!user) {
            openAuthModal('login');
            return;
        }
        fetchAdminData();
    }, [user, activeTab]);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                const res = await axios.get('/api/admin/stats');
                if (res.data.success) {
                    setStats(res.data.stats);
                    setRecentBookings(res.data.recentBookings || []);
                }
            } else if (activeTab === 'listings') {
                const res = await axios.get('/api/admin/listings');
                if (res.data.success) setListings(res.data.listings || []);
            } else if (activeTab === 'reviews') {
                const res = await axios.get('/api/admin/reviews');
                if (res.data.success) setReviews(res.data.reviews || []);
            } else if (activeTab === 'bookings') {
                const res = await axios.get('/api/admin/bookings');
                if (res.data.success) setBookings(res.data.bookings || []);
            }
        } catch (err) {
            console.error('Admin fetch error:', err);
            if (err.response?.status === 403) {
                toast.error('Admin access required');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGrantAdminAccess = async () => {
        try {
            const res = await axios.post('/api/admin/make-me-admin');
            if (res.data.success) {
                toast.success('🎉 Admin privileges granted to your account!');
                setUser({ ...user, isAdmin: true });
                fetchAdminData();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to grant admin status');
        }
    };

    const handleApproveListing = async (id) => {
        try {
            const res = await axios.patch(`/api/admin/listings/${id}/approve`);
            if (res.data.success) {
                toast.success('🎉 Hostel approved and published live!');
                setListings(listings.map(l => l._id === id ? { ...l, isApproved: true } : l));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to approve hostel');
        }
    };


    const handleDeleteListing = async (id) => {
        if (!window.confirm('Admin Action: Are you sure you want to delete this hostel? This will also remove all associated reviews.')) return;
        try {
            const res = await axios.delete(`/api/admin/listings/${id}`);
            if (res.data.success) {
                toast.success('Hostel deleted successfully');
                setListings(listings.filter(l => l._id !== id));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete hostel');
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Admin Action: Are you sure you want to delete this comment?')) return;
        try {
            const res = await axios.delete(`/api/admin/reviews/${id}`);
            if (res.data.success) {
                toast.success('Comment deleted successfully');
                setReviews(reviews.filter(r => r._id !== id));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete comment');
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm('Admin Action: Are you sure you want to cancel this booking?')) return;
        try {
            const res = await axios.delete(`/api/admin/bookings/${id}`);
            if (res.data.success) {
                toast.success('Booking cancelled');
                setBookings(bookings.filter(b => b._id !== id));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (!user) return null;

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen pb-16 transition-colors duration-300">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* Admin Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white p-6 rounded-3xl shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                            <ShieldCheck className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">Admin Portal</h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Full system control to manage hostels, reviews, and bookings
                            </p>
                        </div>
                    </div>
                </div>
                {/* Admin Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                    {[
                        { id: 'overview', label: 'Analytics Overview', icon: LayoutDashboard },
                        { id: 'listings', label: 'Hostels / Listings', icon: Home },
                        { id: 'reviews', label: 'Comments & Reviews', icon: MessageSquare },
                        { id: 'bookings', label: 'Bookings & Reservations', icon: Calendar },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>


                {/* Tab 1: Overview Analytics */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span className="text-xs font-bold uppercase">Total Hostels</span>
                                    <Home className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="text-3xl font-black text-slate-900">{stats?.totalListings || 0}</div>
                                <div className="text-[11px] text-slate-400 font-medium">Active properties listed</div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span className="text-xs font-bold uppercase">Total Bookings</span>
                                    <Calendar className="w-5 h-5 text-rose-500" />
                                </div>
                                <div className="text-3xl font-black text-slate-900">{stats?.totalReservations || 0}</div>
                                <div className="text-[11px] text-slate-400 font-medium">Confirmed reservations</div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span className="text-xs font-bold uppercase">Total Reviews</span>
                                    <MessageSquare className="w-5 h-5 text-amber-500" />
                                </div>
                                <div className="text-3xl font-black text-slate-900">{stats?.totalReviews || 0}</div>
                                <div className="text-[11px] text-slate-400 font-medium">Guest feedback comments</div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span className="text-xs font-bold uppercase">Total Revenue</span>
                                    <DollarSign className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div className="text-3xl font-black text-slate-900">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</div>
                                <div className="text-[11px] text-emerald-600 font-bold">Processed via Razorpay</div>
                            </div>
                        </div>

                        {/* Recent Bookings List */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                            <h3 className="text-lg font-extrabold text-slate-900">Recent Booking Transactions</h3>
                            {recentBookings.length === 0 ? (
                                <p className="text-xs text-slate-400">No bookings recorded yet.</p>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {recentBookings.map((b) => (
                                        <div key={b._id} className="py-3 flex items-center justify-between text-xs">
                                            <div>
                                                {b.listing ? (
                                                    <Link to={`/listings/${b.listing._id}`} className="font-bold text-slate-900 hover:text-rose-600 flex items-center gap-1">
                                                        <span>{b.listing.title}</span>
                                                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                                                    </Link>
                                                ) : (
                                                    <div className="font-bold text-slate-900">Property Stay</div>
                                                )}
                                                <div className="text-slate-500">Booked by {b.author?.username || 'Guest'}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-slate-900">₹{b.price?.toLocaleString('en-IN')}</div>
                                                <div className="text-[10px] text-emerald-600 font-bold">Paid</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab 2: Manage Hostels */}
                {activeTab === 'listings' && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="text-lg font-extrabold text-slate-900">All Registered Hostels ({listings.length})</h3>
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    placeholder="Search by title or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-700">
                                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
                                    <tr>
                                        <th className="p-3">Hostel Name</th>
                                        <th className="p-3">Host</th>
                                        <th className="p-3">Location</th>
                                        <th className="p-3">Price / Night</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {loading ? (
                                        [...Array(5)].map((_, idx) => <TableRowSkeleton key={idx} cols={6} />)
                                    ) : (
                                        listings
                                            .filter(l => l.title?.toLowerCase().includes(searchQuery.toLowerCase()) || l.location?.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((l) => (

                                            <tr key={l._id} className="hover:bg-slate-50/50">
                                                <td className="p-3 font-bold text-slate-900 flex items-center gap-3">
                                                    <img
                                                        src={l.image?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
                                                        alt={l.title}
                                                        className="w-10 h-10 rounded-xl object-cover"
                                                    />
                                                    <Link to={`/listings/${l._id}`} className="line-clamp-1 hover:text-rose-600 transition-colors">
                                                        {l.title}
                                                    </Link>
                                                </td>
                                                <td className="p-3 font-medium text-slate-600">{l.owner?.username || 'Host'}</td>
                                                <td className="p-3 text-slate-500">{l.location}, {l.country}</td>
                                                <td className="p-3 font-black text-slate-900">₹{l.price?.toLocaleString('en-IN')}</td>
                                                <td className="p-3">
                                                    {l.isApproved === false ? (
                                                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                                                            <Clock className="w-3 h-3 text-amber-500" />
                                                            <span>Pending Approval</span>
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                                                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                                                            <span>Approved</span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {l.isApproved === false && (
                                                            <button
                                                                onClick={() => handleApproveListing(l._id)}
                                                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                                                                title="Approve & Publish to Website"
                                                            >
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                                <span>Approve</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => navigate(`/listings/${l._id}`)}
                                                            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-smooth"
                                                            title="View Hostel Details"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteListing(l._id)}
                                                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-smooth"
                                                            title="Delete Hostel"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                )}

                {/* Tab 3: Manage Comments / Reviews */}
                {activeTab === 'reviews' && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="text-lg font-extrabold text-slate-900">All Guest Reviews & Comments ({reviews.length})</h3>
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    placeholder="Search comment or author..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reviews
                                .filter(r => r.comment?.toLowerCase().includes(searchQuery.toLowerCase()) || r.author?.username?.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((r) => (
                                    <div key={r._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                                                        {r.author?.username ? r.author.username.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-900">{r.author?.username || 'Guest'}</div>
                                                        {r.listing ? (
                                                            <Link
                                                                to={`/listings/${r.listing._id}`}
                                                                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 mt-0.5"
                                                            >
                                                                <span>📍 {r.listing.title}</span>
                                                                <ExternalLink className="w-3 h-3 shrink-0" />
                                                            </Link>
                                                        ) : (
                                                            <div className="text-[10px] text-slate-400">Property Stay</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-amber-400">
                                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                    <span className="text-xs font-bold text-slate-800 ml-1">{r.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-3 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                                                "{r.comment}"
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                                            {r.listing ? (
                                                <Link
                                                    to={`/listings/${r.listing._id}`}
                                                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-slate-900/10 cursor-pointer"
                                                >
                                                    <span>See Hotel</span>
                                                    <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                                                </Link>
                                            ) : (
                                                <span className="text-[11px] text-slate-400 italic">Listing unlinked</span>
                                            )}
                                            <button
                                                onClick={() => handleDeleteReview(r._id)}
                                                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-smooth ml-auto cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Delete Comment</span>
                                            </button>
                                        </div>

                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Tab 4: Manage Bookings */}
                {activeTab === 'bookings' && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="text-lg font-extrabold text-slate-900">All User Bookings ({bookings.length})</h3>
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    placeholder="Search by user or hostel..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-700">
                                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
                                    <tr>
                                        <th className="p-3">Hostel</th>
                                        <th className="p-3">Guest User</th>
                                        <th className="p-3">Check-In</th>
                                        <th className="p-3">Check-Out</th>
                                        <th className="p-3">Amount</th>
                                        <th className="p-3">Txn ID</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bookings
                                        .filter(b => b.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || b.author?.username?.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map((b) => (
                                            <tr key={b._id} className="hover:bg-slate-50/50">
                                                <td className="p-3 font-bold text-slate-900">
                                                    {b.listing ? (
                                                        <Link
                                                            to={`/listings/${b.listing._id}`}
                                                            className="hover:text-rose-600 transition-colors flex items-center gap-1.5"
                                                        >
                                                            <span className="line-clamp-1">{b.listing.title}</span>
                                                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500 shrink-0" />
                                                        </Link>
                                                    ) : (
                                                        <span>Property Stay</span>
                                                    )}
                                                </td>
                                                <td className="p-3 font-medium text-slate-600">{b.author?.username || 'Guest'}</td>
                                                <td className="p-3 text-slate-500">{new Date(b.checkIn).toLocaleDateString()}</td>
                                                <td className="p-3 text-slate-500">{new Date(b.checkOut).toLocaleDateString()}</td>
                                                <td className="p-3 font-black text-slate-900">₹{b.price?.toLocaleString('en-IN')}</td>
                                                <td className="p-3 font-mono text-[10px] text-slate-400">{b.razorpayPaymentId || 'Completed'}</td>
                                                <td className="p-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {b.listing && (
                                                            <Link
                                                                to={`/listings/${b.listing._id}`}
                                                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 transition-smooth"
                                                                title="See Hotel Details"
                                                            >
                                                                <span>See Hotel</span>
                                                                <ExternalLink className="w-3 h-3 text-rose-500" />
                                                            </Link>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteBooking(b._id)}
                                                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition-smooth"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

