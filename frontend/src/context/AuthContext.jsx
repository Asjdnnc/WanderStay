import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('wanderstay_user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const res = await axios.get('/api/auth/current_user');
            if (res.data && res.data.user) {
                setUser(res.data.user);
                localStorage.setItem('wanderstay_user', JSON.stringify(res.data.user));
            } else {
                setUser(null);
                localStorage.removeItem('wanderstay_user');
            }
        } catch (error) {
            // Keep local cached user state if offline/network hiccup, or clear if 401
            if (error.response && error.response.status === 401) {
                setUser(null);
                localStorage.removeItem('wanderstay_user');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post('/api/auth/login', { username, password });
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem('wanderstay_user', JSON.stringify(res.data.user));
                toast.success(res.data.message || 'Logged in successfully!');
                return true;
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(msg);
            return false;
        }
    };

    const signup = async (username, email, password) => {
        try {
            const res = await axios.post('/api/auth/signup', { username, email, password });
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem('wanderstay_user', JSON.stringify(res.data.user));
                toast.success(res.data.message || 'Account created successfully!');
                return true;
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Signup failed.';
            toast.error(msg);
            return false;
        }
    };

    const logout = async () => {
        try {
            const res = await axios.post('/api/auth/logout');
            if (res.data.success) {
                setUser(null);
                localStorage.removeItem('wanderstay_user');
                toast.success('Logged out successfully');
            }
        } catch (error) {
            setUser(null);
            localStorage.removeItem('wanderstay_user');
            toast.success('Logged out');
        }
    };


    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
