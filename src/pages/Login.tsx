import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { RiGithubFill } from 'react-icons/ri';
import { post } from '../services/ApiService';
import AuthLayout from '../layout/AuthLayout';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/templates';

    useEffect(() => {
        const state = location.state as { oauthError?: string } | null;
        if (state?.oauthError) {
            setError(state.oauthError);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleGithubLogin = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const isMockMode = !clientId || clientId === 'your_github_client_id_placeholder';

        if (isMockMode) {
            navigate('/auth/github?code=mock_code_github');
        } else {
            const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github`);
            window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail || !password) {
            setError('Please enter your email and password.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await post('auth/login', { email: trimmedEmail, password });
            if (res?.data?.success) {
                login(res.data.token, res.data.user);
                navigate(from, { replace: true });
            } else {
                setError(res?.data?.message || 'Invalid credentials');
            }
        } catch (err) {
            if (import.meta.env.DEV) console.error('Login failed:', err);
            const errRes = err as { response?: { data?: { message?: string } } };
            setError(errRes.response?.data?.message || 'Unable to sign in. Check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
        {/* <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans"> */}
            {/* Background Ornaments */}
            {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6D5DF6]/10 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-[#ec4899]/5 rounded-full blur-[100px]" />
            </div> */}

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                <div className="text-center mb-6 sm:mb-8 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl font-black font-display text-[#0F172A] mb-1.5">Welcome Back</h1>
                    <p className="text-xs sm:text-sm text-slate-500">Sign in to continue building your resume</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-xs sm:text-sm font-medium p-3.5 sm:p-4 rounded-xl mb-4 sm:mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
                        <div className="relative">
                            <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Mail className="w-4 h-4 sm:w-5 h-5" />
                            </div>
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#6D5DF6] focus:ring-4 focus:ring-[#6D5DF6]/10 outline-none transition-all text-xs sm:text-sm font-medium"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock className="w-4 h-4 sm:w-5 h-5" />
                            </div>
                            <input 
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#6D5DF6] focus:ring-4 focus:ring-[#6D5DF6]/10 outline-none transition-all text-xs sm:text-sm font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:shadow-[#6D5DF6]/20 transition-all duration-300 mt-2 sm:mt-4"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 h-5 animate-spin mx-auto" /> : (
                            <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                                Sign In <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </span>
                        )}
                    </Button>
                </form>

                <div className="my-5 sm:my-6 md:my-7 flex items-center gap-3">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Or continue with</span>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>

                <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleGithubLogin}
                    disabled={isLoading}
                    className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold border-slate-200 shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
                >
                    <RiGithubFill className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Sign In with GitHub
                </Button>

                <p className="text-center text-xs sm:text-sm text-slate-500 mt-6 sm:mt-8">
                    Don't have an account? <Link to="/signup" className="text-[#6D5DF6] font-bold hover:underline">Create one</Link>
                </p>
            </motion.div>
        {/* </div> */}
        </AuthLayout>
    );
};

export default Login;
