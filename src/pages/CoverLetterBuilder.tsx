import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient, coverLetterApi, API_BASE_URL } from '../services/ApiService';
import Header from '../components/Header';
import Notification from '../components/Notification';
import ClassicCoverLetter from '../templates/coverLetters/ClassicCoverLetter';
import ModernCoverLetter from '../templates/coverLetters/ModernCoverLetter';
import MinimalCoverLetter from '../templates/coverLetters/MinimalCoverLetter';
import templateStyles from '../templates/TemplateStyles.css?raw';
import { RiArrowLeftLine, RiCheckLine, RiMagicLine, RiDownloadLine, RiFileTextLine } from 'react-icons/ri';

const TEMPLATES = {
    classic: ClassicCoverLetter,
    modern: ModernCoverLetter,
    minimal: MinimalCoverLetter,
};

const CoverLetterBuilder: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, refreshUser, isPremium } = useAuth();
    const previewRef = useRef<HTMLDivElement>(null);

    const [step, setStep] = useState(1);
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const [formData, setFormData] = useState<any>({
        fullName: '',
        resumeProfileId: '',
        jobTitle: '',
        companyName: '',
        jobDescription: '',
        hiringManagerName: '',
        companyLocation: '',
        tone: 'Professional',
        instructions: '',
        content: '',
        templateId: 'classic'
    });

    const [resumeData, setResumeData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isParsing, setIsParsing] = useState(false);
    const thumbContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
    const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        if (step !== 4) return;
        const updateThumbScales = () => {
            const RESUME_WIDTH = 794;
            thumbContainerRefs.current.forEach((card) => {
                if (card) {
                    const cardW = card.clientWidth;
                    const scale = cardW / RESUME_WIDTH;
                    const thumbWrap = card.querySelector('.thumb-wrap') as HTMLElement;
                    if (thumbWrap) {
                        thumbWrap.style.transform = `scale(${scale})`;
                        thumbWrap.style.transformOrigin = 'top left';
                    }
                }
            });
        };
        // small timeout to ensure DOM is rendered and sized
        setTimeout(updateThumbScales, 10);
        window.addEventListener('resize', updateThumbScales);
        return () => window.removeEventListener('resize', updateThumbScales);
    }, [step]);

    const loadData = async () => {
        setLoading(true);
        try {
            const resumeRes = await apiClient.get('/resumes');
            setResumes(resumeRes.data.resumeProfiles || []);

            if (id && id !== 'new') {
                const clRes = await coverLetterApi.getById(id);
                const cl = clRes.data.coverLetter;
                setFormData({
                    resumeProfileId: cl.resumeProfileId || '',
                    jobTitle: cl.jobTitle || '',
                    companyName: cl.companyName || '',
                    jobDescription: cl.jobDescription || '',
                    hiringManagerName: cl.hiringManagerName || '',
                    companyLocation: cl.companyLocation || '',
                    tone: cl.tone || 'Professional',
                    instructions: '',
                    content: cl.content || '',
                    templateId: cl.templateId || 'classic',
                    fullName: cl.fullName || ''
                });
                if (cl.resumeProfileId) {
                    const profile = resumeRes.data.resumeProfiles.find((r: any) => r.id === cl.resumeProfileId);
                    if (profile) setResumeData(profile.data);
                } else if (cl.resumeData) {
                    setResumeData(cl.resumeData);
                }
                setStep(3);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectResume = (profileId: string) => {
        const profile = resumes.find(r => r.id === profileId);
        setFormData((prev: any) => ({ ...prev, resumeProfileId: profileId, fullName: profile?.data?.fullName || '' }));
        setResumeData(profile?.data || null);
        setStep(2);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        if (file.name.endsWith('.json')) {
            try {
                const text = await file.text();
                const raw = JSON.parse(text);
                
                let inferredTitle = raw.targetRole || '';
                if (!inferredTitle && raw.experience) {
                    const firstLine = raw.experience.trim().split('\n')[0] || '';
                    const firstTitle = firstLine.split('|')[0]?.trim();
                    if (firstTitle) inferredTitle = firstTitle;
                }

                setResumeData(raw);
                setFormData((prev: any) => ({ 
                    ...prev, 
                    resumeProfileId: '',
                    fullName: prev.fullName || raw.fullName || '',
                    jobTitle: prev.jobTitle || inferredTitle,
                    jobDescription: prev.jobDescription || raw.summary || ''
                }));
                setStep(2);
            } catch (error) {
                console.error(error);
                showNotification('error', 'Invalid JSON');
            } finally {
                setIsParsing(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
            return;
        }

        const formDataData = new FormData();
        formDataData.append("resume", file);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/resume/parse`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formDataData,
            });
            const data = await response.json();
            if (data.success && data.data) {
                const parsed = data.data;
                
                let inferredTitle = parsed.targetRole || '';
                if (!inferredTitle && parsed.experience) {
                    const firstLine = parsed.experience.trim().split('\n')[0] || '';
                    const firstTitle = firstLine.split('|')[0]?.trim();
                    if (firstTitle) inferredTitle = firstTitle;
                }

                setResumeData(parsed);
                setFormData((prev: any) => ({ 
                    ...prev, 
                    resumeProfileId: '',
                    fullName: prev.fullName || parsed.fullName || '',
                    jobTitle: prev.jobTitle || inferredTitle,
                    jobDescription: prev.jobDescription || parsed.summary || ''
                }));
                setStep(2);
            } else {
                showNotification('error', data.message || 'Failed to extract resume data.');
            }
        } catch (error) {
            console.error(error);
            showNotification('error', 'Failed to parse file.');
        } finally {
            setIsParsing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleGenerate = async () => {
        if ((user?.aiImprovements || 0) >= ((user as any)?.aiImprovementsLimit || 5) && !isPremium()) {
            showNotification('error', 'AI limit reached for today.');
            return;
        }
        setGenerating(true);
        try {
            const payload = { ...formData };
            if (!payload.resumeProfileId) {
                payload.resumeData = resumeData;
            }
            const res = await coverLetterApi.generate(payload);
            if (res.data.success) {
                setFormData((prev: any) => ({ ...prev, content: res.data.content }));
                setStep(3);
                await refreshUser();
            }
        } catch (e: any) {
            showNotification('error', e.response?.data?.message || 'Failed to generate');
        } finally {
            setGenerating(false);
        }
    };

    const handleRefine = async (instruction: string) => {
        if ((user?.aiImprovements || 0) >= ((user as any)?.aiImprovementsLimit || 5) && !isPremium()) {
            showNotification('error', 'AI limit reached for today.');
            return;
        }
        setGenerating(true);
        try {
            const res = await coverLetterApi.regenerate({
                currentContent: formData.content,
                instruction
            });
            if (res.data.success) {
                setFormData((prev: any) => ({ ...prev, content: res.data.content }));
                await refreshUser();
            }
        } catch (e: any) {
            showNotification('error', e.response?.data?.message || 'Failed to refine');
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async (redirect = false) => {
        setSaving(true);
        try {
            const res = await coverLetterApi.save({
                id: id === 'new' ? undefined : id,
                ...formData
            });
            if (redirect) navigate('/cover-letter');
            else if (id === 'new') navigate(`/cover-letter/builder/${res.data.coverLetter.id}`, { replace: true });
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        if (!previewRef.current || downloading) return;
        setDownloading(true);
        try {
            const clone = previewRef.current.cloneNode(true) as HTMLElement;
            const html = clone.innerHTML;
            const filename = `${formData.fullName?.replace(/\s+/g, '_') || resumeData?.fullName?.replace(/\s+/g, '_') || 'Cover_Letter'}_${formData.companyName.replace(/\s+/g, '_')}`;
            
            const blob = await coverLetterApi.downloadPdf(html, templateStyles, filename);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            showNotification('error', 'Download failed');
        } finally {
            setDownloading(false);
        }
    };

    const steps = [
        { id: 1, name: 'Resume' },
        { id: 2, name: 'Job Details' },
        { id: 3, name: 'Edit' },
        { id: 4, name: 'Design' }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#F7F8FC]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B63E8]"></div>
            </div>
        );
    }

    const TemplateComponent = TEMPLATES[formData.templateId as keyof typeof TEMPLATES] || ClassicCoverLetter;
    const aiLimit = (user as any)?.aiImprovementsLimit || 5;
    const aiRemaining = Math.max(0, aiLimit - (user?.aiImprovements || 0));

    return (
        <>
            <Notification notification={notification} />
            <Header />
            <div className="flex flex-col h-screen overflow-hidden bg-white pt-16 md:pt-20 font-sans">
                {/* Top Bar */}
            <div className="flex-none h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 shadow-sm z-20 shrink-0">
                <div className="flex items-center gap-4 w-1/3">
                    <button onClick={() => navigate('/cover-letter')} className="text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center p-2 -ml-2 rounded-lg hover:bg-slate-50">
                        <RiArrowLeftLine className="h-5 w-5" />
                    </button>
                    <span className="font-semibold text-slate-900 hidden sm:block">Cover Letter Builder</span>
                </div>
                
                <div className="flex-1 flex justify-center w-1/3">
                    <div className="flex items-center gap-2 sm:gap-6">
                        {steps.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <button 
                                    onClick={() => s.id <= step ? setStep(s.id) : null}
                                    className={`flex items-center text-xs font-semibold uppercase tracking-wider transition-colors ${
                                        step === s.id ? 'text-[#6B63E8]' : 
                                        s.id < step ? 'text-slate-900 cursor-pointer hover:text-[#6B63E8]' : 'text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-[10px] ${
                                        step === s.id ? 'bg-[#6B63E8]/10 text-[#6B63E8]' : 
                                        s.id < step ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {s.id < step ? <RiCheckLine /> : s.id}
                                    </span>
                                    <span className="hidden lg:inline">{s.name}</span>
                                </button>
                                {i < steps.length - 1 && <div className="hidden sm:block w-8 h-px bg-slate-200"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 w-1/3">
                    {isPremium() && (
                        <div className="hidden md:flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                            <RiMagicLine className="text-[#6B63E8] mr-1.5" />
                            AI: {aiRemaining}/{aiLimit}
                        </div>
                    )}
                    {step >= 3 && (
                        <button 
                            onClick={handleDownload} 
                            disabled={downloading}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-all bg-[#6B63E8] rounded-lg hover:bg-[#5a52d5] shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {downloading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <RiDownloadLine className="mr-1.5 h-4 w-4" />
                                    Download
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Builder / Controls (approx 40%) */}
                <div className="w-full lg:w-[40%] flex flex-col h-full bg-white border-r border-slate-200 z-10 overflow-y-auto">
                    <div className="p-6 lg:p-10 max-w-2xl mx-auto w-full">
                        
                        {/* Step 1: Select Resume */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Select a Resume</h2>
                                <p className="text-slate-500 mb-8">We'll use this resume's details to write your tailored cover letter.</p>
                                
                                {resumes.length === 0 && !resumeData ? (
                                    <div className="text-center p-8 border border-slate-200 rounded-xl bg-slate-50">
                                        <p className="text-slate-600 font-medium mb-2">No resume found</p>
                                        <p className="text-slate-500 text-sm mb-4">You'll need a resume before Profillo can create a tailored cover letter.</p>
                                        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx,.json" onChange={handleFileUpload} />
                                        <button onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-[#6B63E8]" disabled={isParsing}>
                                            {isParsing ? "Extracting..." : "Upload Resume \u2192"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* If we have a local uploaded resume but no db resumes */}
                                        {resumeData && !formData.resumeProfileId && resumes.length === 0 && (
                                            <div 
                                                className="p-5 border border-[#6B63E8] bg-[#6B63E8]/5 shadow-sm rounded-xl cursor-pointer transition-all flex items-center justify-between"
                                            >
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg mb-1">Uploaded Resume</h3>
                                                    <p className="text-sm text-slate-500">{resumeData.targetRole || 'Ready to use'}</p>
                                                </div>
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#6B63E8] text-white">
                                                    <RiCheckLine className="w-4 h-4" />
                                                </div>
                                            </div>
                                        )}
                                        {resumes.map(r => {
                                            const isSelected = formData.resumeProfileId === r.id;
                                            return (
                                                <div 
                                                    key={r.id} 
                                                    onClick={() => handleSelectResume(r.id)}
                                                    className={`p-5 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                                                        isSelected 
                                                            ? 'border-[#6B63E8] bg-[#6B63E8]/5 shadow-sm' 
                                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                                    }`}
                                                >
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 text-lg mb-1">{r.name}</h3>
                                                        <p className="text-sm text-slate-500">{r.data?.targetRole || 'No target role specified'}</p>
                                                        <p className="text-xs text-slate-400 mt-3">Updated {new Date(r.updatedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#6B63E8] text-white' : 'border-2 border-slate-200'}`}>
                                                        {isSelected && <RiCheckLine className="w-4 h-4" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Job Details */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Details</h2>
                                <p className="text-slate-500 mb-8">Tell us about the role you're applying for.</p>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name *</label>
                                            <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6B63E8]/20 focus:border-[#6B63E8] outline-none transition-all text-sm" 
                                                value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="e.g. John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title *</label>
                                            <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6B63E8]/20 focus:border-[#6B63E8] outline-none transition-all text-sm" 
                                                value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} placeholder="e.g. Frontend Developer" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
                                            <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6B63E8]/20 focus:border-[#6B63E8] outline-none transition-all text-sm" 
                                                value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="e.g. Google" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Hiring Manager <span className="text-slate-400 font-normal">(Optional)</span></label>
                                            <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6B63E8]/20 focus:border-[#6B63E8] outline-none transition-all text-sm" 
                                                value={formData.hiringManagerName} onChange={e => setFormData({...formData, hiringManagerName: e.target.value})} placeholder="e.g. Jane Doe or Hiring Team" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <label className="block text-sm font-semibold text-slate-700">Job Description *</label>
                                        </div>
                                        <textarea className="w-full px-4 py-3 border border-slate-200 rounded-xl h-48 focus:ring-2 focus:ring-[#6B63E8]/20 focus:border-[#6B63E8] outline-none transition-all resize-none text-sm leading-relaxed" 
                                            placeholder="Paste the job description here..."
                                            value={formData.jobDescription} onChange={e => setFormData({...formData, jobDescription: e.target.value})} />
                                        <p className="text-xs text-slate-500 mt-2">Profillo uses the job description to tailor your cover letter perfectly to the role.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Tone</label>
                                        <div className="flex gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                            {['Professional', 'Confident', 'Concise'].map(tone => (
                                                <button 
                                                    key={tone}
                                                    onClick={() => setFormData({...formData, tone})}
                                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                                                        formData.tone === tone ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                                >
                                                    {formData.tone === tone && <RiCheckLine className="inline-block mr-1 text-[#6B63E8]" />}
                                                    {tone}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="pt-6">
                                        {(!formData.resumeProfileId && !resumeData) && (
                                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs mb-3 text-center">
                                                No resume data found for this draft. Please go back to Step 1 and re-upload your resume.
                                            </div>
                                        )}
                                        <button 
                                            onClick={handleGenerate} 
                                            disabled={generating || !formData.jobTitle || !formData.companyName || !formData.jobDescription || (!formData.resumeProfileId && !resumeData)}
                                            className="w-full bg-[#6B63E8] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#5a52d5] disabled:opacity-50 transition-all flex justify-center items-center shadow-sm hover:shadow-md"
                                        >
                                            {generating ? 'Generating...' : (
                                                <><RiMagicLine className="mr-2" /> ✨ Generate Cover Letter</>
                                            )}
                                        </button>
                                        {isPremium() && (
                                            <p className="text-center text-xs text-slate-500 mt-3">
                                                Uses 1 AI improvement • {aiRemaining}/{aiLimit} remaining today
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Editor */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full min-h-[500px]">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Content</h2>
                                        <p className="text-slate-500 text-sm mt-1">Make any final manual adjustments below.</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <button onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                                            &larr; Back
                                        </button>
                                        <button onClick={() => setStep(4)} className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-bold text-white bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer">
                                            Choose Design &rarr;
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#6B63E8]/20 focus-within:border-[#6B63E8] transition-all bg-white shadow-sm">
                                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex gap-2 items-center overflow-x-auto">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">AI Actions:</span>
                                        <button onClick={() => handleRefine("Make it more concise.")} disabled={generating} className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 disabled:opacity-50">Make Concise</button>
                                        <button onClick={() => handleRefine("Make it more professional.")} disabled={generating} className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 disabled:opacity-50">More Professional</button>
                                        <button onClick={() => handleRefine("Make it more confident.")} disabled={generating} className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 disabled:opacity-50">More Confident</button>
                                    </div>
                                    <textarea 
                                        className="w-full flex-1 p-5 outline-none resize-none text-sm text-slate-700 leading-loose" 
                                        value={formData.content} 
                                        onChange={e => setFormData({...formData, content: e.target.value})} 
                                        spellCheck="false"
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-xs text-slate-400">Manual edits are always free.</p>
                                    <button onClick={() => handleSave(false)} disabled={saving} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                                        {saving ? 'Saving...' : 'Save Draft'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Design */}
                        {step === 4 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Design</h2>
                                        <p className="text-slate-500">Choose a template for your cover letter.</p>
                                    </div>
                                    <button onClick={() => setStep(3)} className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                                        &larr; Back
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.keys(TEMPLATES).map((tmpl, index) => {
                                        const isSelected = formData.templateId === tmpl;
                                        const PreviewComponent = TEMPLATES[tmpl as keyof typeof TEMPLATES];
                                        return (
                                            <div 
                                                key={tmpl}
                                                onClick={() => setFormData({...formData, templateId: tmpl})}
                                                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all group ${
                                                    isSelected ? 'border-[#6B63E8] shadow-md ring-2 ring-[#6B63E8]/20' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                                }`}
                                            >
                                                {/* Actual thumbnail preview */}
                                                <div 
                                                    ref={(el: HTMLDivElement | null) => { thumbContainerRefs.current[index] = el; }}
                                                    className="aspect-[794/1122] bg-white border-b border-slate-200 overflow-hidden relative"
                                                >
                                                    <div 
                                                        className="absolute top-0 left-0 pointer-events-none thumb-wrap bg-white"
                                                        style={{ width: '794px', height: '1122px', transformOrigin: 'top left' }}
                                                    >
                                                        <PreviewComponent 
                                                            data={{ ...resumeData, fullName: formData.fullName || resumeData?.fullName }}
                                                            jobTitle={formData.jobTitle || "Software Engineer"}
                                                            companyName={formData.companyName || "Acme Corp"}
                                                            hiringManagerName={formData.hiringManagerName || "Hiring Manager"}
                                                            content={formData.content || "Dear Hiring Manager,\n\nI am thrilled to apply for this position. I believe my skills and background make me a great fit for your team. I look forward to the opportunity to discuss how I can contribute to your goals.\n\nSincerely,\nApplicant"}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white text-center flex justify-between items-center px-4">
                                                    <span className="font-semibold text-slate-900 capitalize text-sm">{tmpl}</span>
                                                    {isSelected && <RiCheckLine className="text-[#6B63E8]" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Right Panel: Workspace / Preview (approx 60%) */}
                <div className="hidden lg:flex flex-col w-[60%] h-full bg-[#F7F8FC] overflow-y-auto">
                    
                    {/* Preview Toolbar */}
                    <div className="flex justify-between items-center px-8 py-4 sticky top-0 bg-[#F7F8FC]/90 backdrop-blur z-10">
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Live Preview</span>
                    </div>

                    <div className="flex-1 flex justify-center items-start p-8 pb-20 min-h-max">
                        {formData.content ? (
                            <div className="bg-white shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-slate-100 rounded w-full max-w-[210mm] min-h-[297mm] transition-all duration-300 overflow-hidden" ref={previewRef}>
                                <TemplateComponent 
                                    data={{ ...resumeData, fullName: formData.fullName || resumeData?.fullName }}
                                    jobTitle={formData.jobTitle}
                                    companyName={formData.companyName}
                                    hiringManagerName={formData.hiringManagerName}
                                    content={formData.content}
                                />
                            </div>
                        ) : (
                            <div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-sm border border-slate-200 rounded flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                                    <RiFileTextLine className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Your cover letter will appear here</h3>
                                <p className="text-slate-500 max-w-sm text-sm">
                                    Select a resume, add the job details, and generate your tailored cover letter to preview it.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default CoverLetterBuilder;
