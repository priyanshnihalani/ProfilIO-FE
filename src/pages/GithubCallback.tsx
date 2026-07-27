import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { post } from '../services/ApiService';
import { Loader2 } from 'lucide-react';

const GithubCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [statusText, setStatusText] = useState('Connecting to GitHub...');
    const processed = useRef(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        const error = queryParams.get('error');
        const errorDescription = queryParams.get('error_description');

        if (error || errorDescription) {
            navigate('/login', {
                replace: true,
                state: { oauthError: errorDescription || error || 'GitHub authentication was cancelled.' }
            });
            return;
        }

        if (code && !processed.current) {
            processed.current = true;
            setStatusText('Verifying credentials...');
            
            // Exchange code for JWT token
            post('auth/github', { code })
                .then((res) => {
                    if (res?.data?.success) {
                        login(res.data.token, res.data.user);
                        navigate('/templates', { replace: true });
                    } else {
                        navigate('/login', {
                            replace: true,
                            state: { oauthError: res?.data?.message || 'Failed to authenticate with GitHub.' }
                        });
                    }
                })
                .catch((err) => {
                    const errRes = err as { response?: { data?: { message?: string } } };
                    const message = errRes.response?.data?.message || 'A network error occurred. Check your connection.';
                    navigate('/login', {
                        replace: true,
                        state: { oauthError: message }
                    });
                });
        } else if (!code) {
            navigate('/login', { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8F9FC] font-sans">
            <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-premium border border-slate-100 max-w-sm w-full mx-4 text-center">
                <img src="/logo.png" alt="ProfilIO" className="h-10 w-auto object-contain mb-2" />
                <Loader2 className="w-8 h-8 text-[#6D5DF6] animate-spin" />
                <p className="text-sm font-semibold text-slate-700 mt-2">{statusText}</p>
                <p className="text-xs text-slate-400">Please do not refresh this page.</p>
            </div>
        </div>
    );
};

export default GithubCallback;
