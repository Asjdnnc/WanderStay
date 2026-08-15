import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ListingsIndexPage from './pages/ListingsIndexPage';
import ListingDetailPage from './pages/ListingDetailPage';
import ListingFormPage from './pages/ListingFormPage';
import ReservationsPage from './pages/ReservationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');
    const [searchKeyword, setSearchKeyword] = useState('');

    const openAuthModal = (mode = 'login') => {
        setAuthModalMode(mode);
        setAuthModalOpen(true);
    };

    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-rose-500 selection:text-white transition-colors duration-300">
                        <Toaster position="top-center" reverseOrder={false} />

                        <Navbar
                            onSearch={(term) => setSearchKeyword(term)}
                            openAuthModal={openAuthModal}
                        />

                        <div className="flex-1 flex flex-col">
                            <Routes>
                                <Route path="/" element={<ListingsIndexPage searchKeyword={searchKeyword} />} />
                                <Route path="/listings/new" element={<ListingFormPage openAuthModal={openAuthModal} />} />
                                <Route path="/listings/:id" element={<ListingDetailPage openAuthModal={openAuthModal} />} />
                                <Route path="/listings/:id/edit" element={<ListingFormPage openAuthModal={openAuthModal} />} />
                                <Route path="/reservations" element={<ReservationsPage openAuthModal={openAuthModal} />} />
                                <Route path="/admin" element={<AdminDashboardPage openAuthModal={openAuthModal} />} />
                                <Route path="*" element={<ListingsIndexPage searchKeyword={searchKeyword} />} />
                            </Routes>
                        </div>

                        <Footer />

                        <AuthModal
                            isOpen={authModalOpen}
                            onClose={() => setAuthModalOpen(false)}
                            initialMode={authModalMode}
                        />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}


