import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');
                
                if (token && userData) {
                    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response.data.success) {
                        setUser(JSON.parse(userData));
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('userId'); 
                        localStorage.removeItem('loggedInUser'); // Clear loggedInUser on invalid token
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userId'); 
                localStorage.removeItem('loggedInUser'); // Clear loggedInUser on error
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (userData, token) => {
        try {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userId', userData._id); 
            localStorage.setItem('loggedInUser', userData.fullName); // Added this line to store the user's name
            
            setUser(userData);
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId'); 
        localStorage.removeItem('loggedInUser'); // Clear loggedInUser on logout
        
        setUser(null);
        
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;