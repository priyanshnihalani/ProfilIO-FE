import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { RiMailLine, RiLockPasswordLine, RiUserLine, RiArrowRightLine, RiArrowLeftLine, RiGithubFill, RiEyeOffLine, RiEyeLine } from "react-icons/ri";
import AuthLayout from "../layout/AuthLayout";
import { post } from "../services/ApiService";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

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

    const handleNextStep = () => {
        setError("");
        if (!fullName.trim()) {
            setError("Please enter your full name.");
            return;
        }
        setStep(2);
    };

    const handleCreateAccount = async () => {
        setError("");

        const trimmedName = fullName.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setError("Enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await post("auth/register", { fullName: trimmedName, email: trimmedEmail, password });
            if (res?.data?.success) {
                login(res.data.token, res.data.user);
                navigate("/templates");
            } else {
                setError(res?.data?.message || "Unable to create account.");
            }
        } catch (err) {
            if (import.meta.env.DEV) console.error("Registration failed:", err);
            const errRes = err as { response?: { data?: { message?: string } } };
            setError(errRes.response?.data?.message || "Unable to create account. Check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight font-display">
                    Create Your <span className="text-[#6D5DF6]">ProfilIO</span> Account
                </h1>
                <p className="text-xs sm:text-[13px] text-[#64748B] font-medium mt-1.5 sm:mt-2">Start building your professional resume today</p>
            </div>

            {error && (
                <div className="mb-4 sm:mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-600 animate-in fade-in duration-200">
                    {error}
                </div>
            )}

            <div className="space-y-3.5 sm:space-y-4">
                {step === 1 && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-4.5 sm:h-4.5" />
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                                placeholder="Priyansh Nihalani"
                                className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#6D5DF6] focus:ring-4 focus:ring-[#6D5DF6]/10 outline-none transition-all text-xs sm:text-sm font-medium"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-3.5 sm:space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#6D5DF6] focus:ring-4 focus:ring-[#6D5DF6]/10 outline-none transition-all text-xs sm:text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount()}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-10 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#6D5DF6] focus:ring-4 focus:ring-[#6D5DF6]/10 outline-none transition-all text-xs sm:text-sm font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword
                                        ? <RiEyeLine className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                        : <RiEyeOffLine className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                    }
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium pt-1 pl-1">Must be at least 8 characters.</p>
                        </div>
                    </div>
                )}

                {step === 1 ? (
                    <Button onClick={handleNextStep} variant="purple" className="w-full h-12 sm:h-14 text-xs sm:text-sm font-bold shadow-md rounded-xl sm:rounded-2xl mt-4 sm:mt-6 group bg-[#6D5DF6] hover:bg-[#5C4EE5] flex items-center justify-center gap-1.5">
                        Continue
                        <RiArrowRightLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                ) : (
                    <div className="flex gap-3 mt-4 sm:mt-6">
                        <Button onClick={() => setStep(1)} variant="outline" className="w-1/3 h-12 sm:h-14 text-xs sm:text-sm rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-slate-200 flex items-center justify-center gap-1">
                            <RiArrowLeftLine className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Back
                        </Button>
                        <Button onClick={handleCreateAccount} disabled={isLoading} variant="purple" className="flex-1 h-12 sm:h-14 text-xs sm:text-sm font-bold shadow-md rounded-xl sm:rounded-2xl group bg-[#6D5DF6] hover:bg-[#5C4EE5] disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-1.5">
                            {isLoading ? "Creating..." : "Create Account"}
                            <RiArrowRightLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                )}
            </div>

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
                className="w-full h-12 sm:h-13 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold border-slate-200 shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
            >
                <RiGithubFill className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Sign Up with GitHub
            </Button>

            <p className="text-center text-xs text-[#64748B] font-medium mt-6 sm:mt-8">
                Already have an account?{' '}
                <Link to="/login" className="text-[#6D5DF6] font-bold hover:text-[#8B7CF8] transition-colors">
                    Sign in
                </Link>
            </p>
            <p className="text-center text-[10px] text-slate-400 font-medium mt-4 max-w-xs mx-auto leading-relaxed">
                By signing up, you agree to our{' '}
                <Link to="/terms-and-conditions" className="underline hover:text-slate-500 transition-colors">Terms of Service</Link> and{' '}
                <Link to="/privacy-policy" className="underline hover:text-slate-500 transition-colors">Privacy Policy</Link>.
            </p>
        </AuthLayout>
    );
};

export default Signup;
