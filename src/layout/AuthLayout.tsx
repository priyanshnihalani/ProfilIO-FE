import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Download, ShieldCheck, Sparkles, LayoutDashboard } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  return (
    <div className="min-h-screen w-full flex bg-[#F8F9FC] font-sans overflow-x-hidden">
      
      {/* LEFT SIDE: Showcase Area (Hidden on mobile) */}
      <div className="hidden lg:flex w-[45%] min-w-[420px] flex-col relative bg-gradient-to-br from-[#EEEDFF] via-[#F4F3FF] to-[#E5E3FF] p-8 xl:p-12 justify-between">
        {/* Background decorative elements */}
        <div className="absolute top-10 right-10 grid grid-cols-4 gap-2 opacity-10">
          {[...Array(16)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />)}
        </div>
        <div className="absolute bottom-40 right-20 grid grid-cols-3 gap-2 opacity-10">
          {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />)}
        </div>
        <div className="absolute -left-20 top-1/3 w-[500px] h-[500px] bg-white/40 rounded-full blur-[80px] pointer-events-none" />

        {/* Header & Copy */}
        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.png" alt="ProfilIO" className="sm:10 md:h-12 2xl:h-14 w-auto object-contain object-scale-down cursor-pointer" />
          </div>

          <div className="space-y-4 pt-4">
            <h1 className="text-[clamp(2.25rem,3vw,2.75rem)] leading-[1.1] font-extrabold text-[#0F172A] tracking-tight">
              Build ATS-Friendly<br/>
              Resumes That <span className="text-[#6D5DF6]">Get<br/>You Hired</span>
            </h1>
            <p className="text-slate-600 font-medium text-lg leading-relaxed max-w-md">
              Create professional resumes in minutes, track your applications, and land more interviews.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white shadow-sm">
              <div className="p-1 rounded-md bg-[#6D5DF6]/10 text-[#6D5DF6]"><FileText className="w-4 h-4" /></div>
              <span className="text-xs font-bold text-slate-700">ATS<br/><span className="text-slate-500 font-semibold">Optimized</span></span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white shadow-sm">
              <div className="p-1 rounded-md bg-[#6D5DF6]/10 text-[#6D5DF6]"><ShieldCheck className="w-4 h-4" /></div>
              <span className="text-xs font-bold text-slate-700">Recruiter<br/><span className="text-slate-500 font-semibold">Approved</span></span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white shadow-sm">
              <div className="p-1 rounded-md bg-[#6D5DF6]/10 text-[#6D5DF6]"><Sparkles className="w-4 h-4" /></div>
              <span className="text-xs font-bold text-slate-700">Proven<br/><span className="text-slate-500 font-semibold">Results</span></span>
            </div>
          </div>
        </div>

        {/* Abstract App Mockup Illustration */}
        <div className="relative mt-12 mb-8 flex-1 w-full max-w-[500px] h-[320px]">
          {/* Main App Window */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="absolute left-0 bottom-0 w-[85%] h-[90%] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex"
          >
            {/* Sidebar */}
            <div className="w-14 bg-[#F8F9FC] border-r border-slate-100 flex flex-col items-center py-4 space-y-4">
              <img src="/logo.png" alt="ProfilIO" className="h-6 w-auto object-contain" />
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400"><LayoutDashboard className="w-4 h-4" /></div>
              <div className="w-8 h-8 rounded-lg text-slate-300 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
            </div>
            {/* Editor Area */}
            <div className="flex-1 p-5 flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-bold text-slate-800">Software Engineer</span>
                <span className="text-slate-400 font-bold">+</span>
              </div>
              <div className="space-y-4 flex-1">
                {/* Header */}
                <div>
                  <h3 className="text-lg font-black text-slate-900">John Doe</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Software Engineer</p>
                  <div className="flex gap-3 text-[8px] text-slate-400 mt-1.5">
                    <span>john.doe@email.com</span>
                    <span>+1 (555) 123-4567</span>
                    <span>New York, USA</span>
                  </div>
                </div>
                {/* Section blocks */}
                <div className="space-y-1.5">
                  <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Professional Summary</div>
                  <div className="h-1.5 bg-slate-200 rounded-full w-full" />
                  <div className="h-1.5 bg-slate-200 rounded-full w-[85%]" />
                  <div className="h-1.5 bg-slate-200 rounded-full w-[60%]" />
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Experience</div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6D5DF6] mt-0.5" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-1.5 bg-[#6D5DF6]/30 rounded-full w-[40%]" />
                      <div className="h-1.5 bg-slate-100 rounded-full w-full" />
                      <div className="h-1.5 bg-slate-100 rounded-full w-[90%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating ATS Score Card */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute right-0 top-[10%] w-[160px] bg-white rounded-2xl shadow-xl border border-slate-100 p-4"
          >
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">ATS Score</div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="24" cy="24" r="20" className="stroke-slate-100 fill-none" strokeWidth="4" />
                  <circle cx="24" cy="24" r="20" className="stroke-emerald-500 fill-none" strokeWidth="4" strokeDasharray="125" strokeDashoffset="10" strokeLinecap="round" />
                </svg>
                <div className="absolute text-sm font-black text-emerald-600">92<span className="text-[8px]">%</span></div>
              </div>
              <div className="text-[10px] font-bold text-emerald-600">Excellent</div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-600">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Keywords Match
              </div>
              <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-600">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Formatting
              </div>
              <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-600">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Readability
              </div>
            </div>
          </motion.div>

          {/* Floating Download Button */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute right-8 bottom-0 bg-white rounded-xl shadow-lg border border-slate-100 p-2.5 flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center text-white text-[8px] font-bold">.pdf</div>
            <span className="text-xs font-bold text-slate-700">Resume.pdf</span>
            <div className="pl-2 border-l border-slate-100 text-slate-400"><Download className="w-4 h-4" /></div>
          </motion.div>
        </div>


      </div>

      {/* RIGHT SIDE: Auth Form Area */}
      <div className="w-full lg:w-[55%] flex flex-col relative py-8 px-4 sm:px-6 lg:px-12 items-center justify-center">
        
        {/* Toggle Nav */}
        <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 flex items-center gap-6 sm:gap-12 border-b border-slate-200 pb-2 whitespace-nowrap">
          <Link 
            to="/signup" 
            className={`text-sm font-bold pb-2 relative transition-colors ${!isLogin ? "text-[#6D5DF6]" : "text-slate-400 hover:text-slate-600"}`}
          >
            Create Account
            {!isLogin && <motion.div layoutId="authTab" className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[#6D5DF6]" />}
          </Link>
          <Link 
            to="/login" 
            className={`text-sm font-bold pb-2 relative transition-colors ${isLogin ? "text-[#6D5DF6]" : "text-slate-400 hover:text-slate-600"}`}
          >
            Sign In
            {isLogin && <motion.div layoutId="authTab" className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[#6D5DF6]" />}
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[440px] mt-12 bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-premium border border-slate-100 p-5 sm:p-8 md:p-12">
          {children}
        </div>



      </div>
    </div>
  );
};

export default AuthLayout;
