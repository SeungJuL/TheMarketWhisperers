import React, { createContext, useState, useEffect } from 'react';
import { login, logout, checkSession } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const validateSession = async () => {
            const sessionUser = await checkSession();
            setUser(sessionUser);
        };
        validateSession();
    }, []);

    const handleLogin = async (credentials) => {
        const userData = await login(credentials);
        setUser(userData);
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
