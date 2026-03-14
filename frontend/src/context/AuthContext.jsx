import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Bizge navigaciya kerek bolıwı múmkin (avtomat shıǵarıw ushın)
    // Biraq Routerdiń ishinde emesligimiz ushın, bunı Componentte teksergen jaqsı.
    // Házirshe state penen isleymiz.

    useEffect(() => {
        const checkUser = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    // 1. Token waqtı pitken be?
                    if (decoded.exp < currentTime) {
                        logout();
                    } else {
                        setUser(decoded);
                    }
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        // Brauzerdi tolıq tazalaw ushın:
        window.location.href = '/login'; 
    };

    // User Admin be?
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};