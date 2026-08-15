import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const res = await axios.get('/api/auth/current_user');
            if (res.data && res.data.user) {
                setUser(res.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
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
                toast.success('Logged out successfully');
            }
        } catch (error) {
            toast.error('Logout error');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
