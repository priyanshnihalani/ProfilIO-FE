import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { get } from '../services/ApiService';

export type UserPlan = 'FREE' | 'STARTER' | 'PRO';

export interface User {
    id: string;
    email: string;
    fullName: string;
    planType: UserPlan;
    role?: string;
    resumeDownloads?: number;
    aiImprovements?: number;
    paymentDate?: string;
    membershipEndDate?: string;
    aiDailyLimit?: number;
    resumeProfileLimit?: number;
    weeklyDownloadLimit?: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    isPremium: () => boolean;
    refreshUser: () => Promise<User | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_STORAGE_KEY = 'token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const verifyToken = async () => {
            if (!token) {
                if (!cancelled) setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const res = await get('auth/me');
                const data = res.data;
                
                if (cancelled) return;

                if (data.success && data.user) {
                    setUser(data.user);
                } else {
                    logout();
                }
            } catch (error) {
                if (import.meta.env.DEV) console.error("Auth verification failed:", error);
                if (cancelled) return;
                logout();
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        verifyToken();

        return () => {
            cancelled = true;
        };
    }, [token, logout]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
        setToken(newToken);
        setUser(newUser);
        setIsLoading(false);
    };

    const isPremium = () => {
        if (!user) return false;
        return user.role === 'ADMIN' || user.planType === 'PRO';
    };

    const refreshUser = async (): Promise<User | undefined> => {
        if (!token) return undefined;
        try {
            const res = await get('auth/me');
            const data = res.data;
            if (data.success && data.user) {
                setUser(data.user);
                return data.user;
            }
        } catch (error) {
            console.error("Failed to refresh user:", error);
        }
        return undefined;
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, isPremium, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
