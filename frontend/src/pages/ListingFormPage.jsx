import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, Home, MapPin, IndianRupee , Image as ImageIcon, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';


const CATEGORIES_LIST = [
    'Rooms', 'Trending', 'Iconics', 'Mountains', 'Castles',
    'Amazing Pools', 'Camping', 'Farms', 'Arctic', 'Beachfront', 'Domes'
];

export default function ListingFormPage({ openAuthModal }) {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [country, setCountry] = useState('');
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            openAuthModal('login');
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (isEdit) {
            fetchListingToEdit();
        }
    }, [id]);

    const fetchListingToEdit = async () => {
        try {
            const res = await axios.get(`/api/listings/${id}`);
            if (res.data.success) {
                const l = res.data.listing;
                setTitle(l.title || '');
                setDescription(l.description || '');
                setPrice(l.price || '');
                setLocation(l.location || '');
                setCountry(l.country || '');
                setCategories(l.categories || []);
                setImagePreview(l.image?.url || '');
            }
        } catch (err) {
            toast.error('Failed to load listing for edit');
        }
    };

    const handleCategoryToggle = (cat) => {
        setCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description || !price || !location || !country) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            const listingPayload = {
                title,
                description,
                price: Number(price),
                location,
                country,
                categories
            };

            formData.append('listing', JSON.stringify(listingPayload));
            if (imageFile) {
                formData.append('listing[image]', imageFile);
            }

            let res;
            if (isEdit) {
                res = await axios.put(`/api/listings/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await axios.post('/api/listings', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (res.data.success) {
                if (isEdit) {
                    toast.success('Listing updated!');
                    navigate(`/listings/${id}`);
                } else {
                    toast.success('📋 Your stay has been submitted for admin approval!', { duration: 6000 });
                    navigate('/');
                }
            }

        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-10 transition-colors duration-300">
            <main className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10 space-y-8">
                    
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                            {isEdit ? 'Edit Your Listing' : 'Host a New Listing'}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {isEdit ? 'Update details, pricing, and photos for your property' : 'Share your space with millions of travelers on WanderStay'}
                        </p>
                    </div>

                    {isEdit && loading ? (
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-full rounded-xl" />
                            <Skeleton className="h-28 w-full rounded-xl" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-10 w-full rounded-xl" />
                            </div>
                            <Skeleton className="h-40 w-full rounded-2xl" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                        
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                            <div className="relative">
                                <Home className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Luxury Beach Villa in Goa"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                            <textarea
                                rows="4"
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what makes your stay special..."
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                            ></textarea>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Price per Night (₹)</label>
                            <div className="relative">
                                <IndianRupee className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="1200"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                />
                            </div>
                        </div>

                        {/* Location & Country */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City / Location</label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                                    <input
                                        type="text"
                                        required
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Manali"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Country</label>
                                <input
                                    type="text"
                                    required
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder="e.g. India"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                />
                            </div>
                        </div>

                        {/* Categories Selection */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5 text-rose-500" />
                                <span>Select Categories</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES_LIST.map((cat) => {
                                    const isSelected = categories.includes(cat);
                                    return (
                                        <button
                                            type="button"
                                            key={cat}
                                            onClick={() => handleCategoryToggle(cat)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-rose-500 text-white shadow-xs'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Image Upload Box */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Listing Image</label>
                            
                            {imagePreview && (
                                <div className="mb-4 aspect-16/9 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative group">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}

                            <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/50">
                                <Upload className="w-8 h-8 text-rose-500 mb-2" />
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Click to upload photo</span>
                                <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG or WEBP up to 10MB</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-smooth cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-md shadow-rose-500/20 text-xs transition-all cursor-pointer"
                            >
                                {loading ? 'Saving...' : (isEdit ? 'Update Listing' : 'Request for Approval')}
                            </button>
                        </div>

                    </form>
                    )}


                </div>
            </main>
        </div>
    );
}
