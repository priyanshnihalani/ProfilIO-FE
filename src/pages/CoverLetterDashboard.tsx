import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { coverLetterApi } from '../services/ApiService';
import { RiFileTextLine, RiDeleteBinLine, RiEdit2Line, RiTimeLine } from 'react-icons/ri';
import { Sparkles, ArrowRight } from 'lucide-react';

const CoverLetterDashboard: React.FC = () => {
    const { user, isPremium } = useAuth();
    const navigate = useNavigate();
    const [letters, setLetters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isPremium()) {
            loadCoverLetters();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadCoverLetters = async () => {
        try {
            const res = await coverLetterApi.getAll();
            setLetters(res.data.coverLetters || []);
        } catch (e) {
            console.error("Failed to load cover letters", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this cover letter?")) return;
        try {
            await coverLetterApi.delete(id);
            setLetters(letters.filter(l => l.id !== id));
        } catch (e) {
            console.error("Failed to delete", e);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D5DF6]"></div>
            </div>
        );
    }

    // If user is not premium (FREE and not ADMIN), show locked state
    if (!isPremium()) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 bg-[#F8F7FF] mt-16 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#6D5DF6]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="bg-white/90 backdrop-blur-sm p-12 rounded-[2.25rem] border border-white/60 max-w-xl w-full text-center shadow-[0_25px_50px_-12px_rgba(15,23,42,0.12)]">
                    <div className="w-20 h-20 bg-gradient-to-tr from-[#6D5DF6]/10 to-[#8B7CF8]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <RiFileTextLine className="w-10 h-10 text-[#6D5DF6]" />
                    </div>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 text-xs font-extrabold uppercase tracking-widest mb-6 border border-amber-500/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        Pro Feature
                    </div>

                    <h1 className="text-4xl font-extrabold text-[#0F172A] mb-4 tracking-tight font-display">
                        AI Cover Letter Generator
                    </h1>
                    
                    <p className="text-lg text-[#64748B] mb-10 max-w-md mx-auto leading-relaxed">
                        Create perfectly tailored cover letters in seconds. Our AI analyzes your resume and the target job description to write a professional, highly relevant cover letter that gets you noticed.
                    </p>

                    <Link 
                        to="/pricing"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] rounded-full shadow-lg shadow-[#6D5DF6]/30 hover:shadow-[#6D5DF6]/40 transform hover:-translate-y-1"
                    >
                        Upgrade to Pro
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F7FF] pt-28 md:pt-32 pb-16 relative overflow-hidden text-[#0F172A]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B7CF8]/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-[#6D5DF6]/5 rounded-full blur-[140px] -z-10" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Hero Header */}
                <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-12 text-center mb-10 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] mb-5 shadow-xs">
                        <Sparkles className="w-4 h-4 fill-current" />
                        <span className="text-[10px] tracking-widest uppercase font-extrabold font-display">
                            PROFILLO AI COVER LETTER GENERATOR
                        </span>
                    </div>
                    <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl mb-5 text-[#0F172A] tracking-tight leading-tight">
                        Craft your perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D5DF6] via-[#8B7CF8] to-[#ec4899]">cover letter</span>
                    </h1>
                    <p className="text-base sm:text-lg text-[#64748B] max-w-xl mx-auto leading-relaxed font-light mb-8">
                        Turn your resume and a job description into a tailored, professional cover letter in seconds using advanced AI.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => navigate('/cover-letter/builder/new')}
                            className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full shadow-lg shadow-[#6D5DF6]/30 text-white bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] hover:shadow-[#6D5DF6]/40 transition-all duration-300 transform hover:-translate-y-1 shrink-0 cursor-pointer"
                        >
                            <Sparkles className="mr-2 w-5 h-5" />
                            Create Cover Letter
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                {letters.length === 0 ? (
                    /* How it works feature preview instead of duplicate card */
                    <div className="mt-4 max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/70 text-center shadow-xs hover:shadow-sm transition-all">
                                <div className="w-8 h-8 bg-[#6D5DF6]/10 text-[#6D5DF6] rounded-lg flex items-center justify-center mx-auto mb-3 font-bold font-display text-xs">
                                    01
                                </div>
                                <h4 className="font-bold text-[#0F172A] text-sm mb-1 font-display">Select Your Resume</h4>
                                <p className="text-xs text-[#64748B] leading-relaxed">
                                    Pick from your existing resume profiles or upload a PDF/Word document directly.
                                </p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/70 text-center shadow-xs hover:shadow-sm transition-all">
                                <div className="w-8 h-8 bg-[#6D5DF6]/10 text-[#6D5DF6] rounded-lg flex items-center justify-center mx-auto mb-3 font-bold font-display text-xs">
                                    02
                                </div>
                                <h4 className="font-bold text-[#0F172A] text-sm mb-1 font-display">Add Target Job</h4>
                                <p className="text-xs text-[#64748B] leading-relaxed">
                                    Paste the job title and description so our AI can highlight your matching skills.
                                </p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/70 text-center shadow-xs hover:shadow-sm transition-all">
                                <div className="w-8 h-8 bg-[#6D5DF6]/10 text-[#6D5DF6] rounded-lg flex items-center justify-center mx-auto mb-3 font-bold font-display text-xs">
                                    03
                                </div>
                                <h4 className="font-bold text-[#0F172A] text-sm mb-1 font-display">Export & Download</h4>
                                <p className="text-xs text-[#64748B] leading-relaxed">
                                    Choose a beautiful ATS-friendly template and download high-quality PDFs instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* List View */
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight font-display">Your Saved Cover Letters</h2>
                            <span className="text-xs font-bold text-[#64748B] bg-white px-3 py-1 rounded-full border border-slate-200/80 shadow-xs">
                                {letters.length} {letters.length === 1 ? 'Letter' : 'Letters'}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {letters.map((letter) => (
                            <div key={letter.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col hover:border-[#6D5DF6]/40 shadow-xs hover:shadow-sm transition-all duration-200 group relative">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-base font-bold text-[#0F172A] line-clamp-1 tracking-tight pr-2" title={letter.companyName}>
                                            {letter.companyName}
                                        </h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#F8F7FF] text-[#6D5DF6] uppercase tracking-wider border border-[#6D5DF6]/10 shrink-0">
                                            {letter.templateId}
                                        </span>
                                    </div>
                                    <p className="text-[#64748B] font-medium text-xs mb-4 line-clamp-1">{letter.jobTitle}</p>
                                    
                                    <div className="flex items-center text-[11px] font-medium text-slate-400 mt-auto">
                                        <RiTimeLine className="mr-1.5 w-3.5 h-3.5" />
                                        Updated {new Date(letter.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center gap-2">
                                    <button
                                        onClick={() => navigate(`/cover-letter/builder/${letter.id}`)}
                                        className="flex-1 inline-flex justify-center items-center px-3.5 py-2 border border-slate-200 shadow-xs text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-[#F8F7FF] hover:border-[#6D5DF6]/30 hover:text-[#6D5DF6] transition-all"
                                    >
                                        <RiEdit2Line className="mr-1.5 h-3.5 w-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(letter.id)}
                                        className="inline-flex items-center p-2 border border-slate-200/80 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                                        title="Delete"
                                    >
                                        <RiDeleteBinLine className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoverLetterDashboard;
