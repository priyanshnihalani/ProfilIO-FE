import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2, AlertTriangle, Search, RefreshCw,
    Zap, ArrowLeft, ShieldCheck, FileText, Target,
    User, Eye, Ban
} from 'lucide-react';
import type { AtsAnalysisResult } from '../../services/AtsService';
import { Button } from '../ui/button';

interface AtsDashboardProps {
    analysis: AtsAnalysisResult | null;
    isLoading: boolean;
    isImproving: boolean;
    onAnalyze: (jobDescription: string, selectedKeywords?: string[]) => void;
    onImprove: (selectedKeywords?: string[]) => void;
    onBack: () => void;
    onAddKeywords: (keywords: string[]) => void;
}

// Maps dimension keys → human label + icon + weight
const DIMENSION_META: Record<string, { label: string; icon: React.ReactNode; weight: number }> = {
    keywordRelevance:    { label: 'Keyword Relevance',    icon: <Search className="w-4 h-4" />,      weight: 22 },
    formatParsability:   { label: 'Format Parsability',   icon: <FileText className="w-4 h-4" />,    weight: 18 },
    impactLanguage:      { label: 'Impact Language',      icon: <Zap className="w-4 h-4" />,         weight: 15 },
    sectionCompleteness: { label: 'Section Completeness', icon: <CheckCircle2 className="w-4 h-4" />,weight: 12 },
    roleAlignment:       { label: 'Role Alignment',       icon: <Target className="w-4 h-4" />,      weight: 12 },
    contactInfo:         { label: 'Contact Info',         icon: <User className="w-4 h-4" />,        weight: 8  },
    readability:         { label: 'Readability',          icon: <Eye className="w-4 h-4" />,         weight: 7  },
    atsAntiPatterns:     { label: 'ATS Anti-Patterns',    icon: <Ban className="w-4 h-4" />,         weight: 6  },
};


export const AtsDashboard: React.FC<AtsDashboardProps> = ({
    analysis, isLoading, onAnalyze, onBack, onAddKeywords,
}) => {
    const [jobDescription, setJobDescription] = useState('');
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

    React.useEffect(() => {
        if (analysis?.details?.keyword?.missing_keywords) {
            const missing = analysis.details.keyword.missing_keywords;
            setSelectedKeywords((prev) => prev.filter((kw) => missing.includes(kw)));
        }
    }, [analysis]);

    const handleToggleKeyword = (kw: string) => {
        let updated: string[];
        if (selectedKeywords.includes(kw)) {
            updated = selectedKeywords.filter((k) => k !== kw);
        } else {
            updated = [...selectedKeywords, kw];
        }
        setSelectedKeywords(updated);
        onAnalyze(jobDescription, updated);
    };

    const handleAddKeywordsClick = () => {
        onAddKeywords(selectedKeywords);
        setSelectedKeywords([]);
    };

    const scoreColor = (score: number) =>
        score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500';

    const barColor = (score: number) =>
        score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';

    const renderScoreRing = (score: number) => (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                    <motion.circle
                        cx="50" cy="50" r="45" fill="none"
                        stroke="currentColor" strokeWidth="10" strokeLinecap="round"
                        className={scoreColor(score)}
                        initial={{ strokeDasharray: '0 283' }}
                        animate={{ strokeDasharray: `${(score / 100) * 283} 283` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className={`text-4xl font-extrabold font-display ${scoreColor(score)}`}>{score}</span>
                    <span className="text-xs font-semibold text-slate-400">/ 100</span>
                </div>
            </div>
            <h3 className="mt-4 font-bold text-slate-700">Overall ATS Score</h3>
            {analysis?.tier && (
                <p className="text-xs text-slate-500 text-center mt-1 max-w-[160px] leading-relaxed">
                    {analysis.tier}
                </p>
            )}
        </div>
    );

    const renderDimensionBar = (key: string, score: number) => {
        const meta = DIMENSION_META[key];
        if (!meta) return null;
        return (
            <div key={key} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <span className="text-slate-400">{meta.icon}</span>
                        {meta.label}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className={`font-bold ${scoreColor(score)}`}>{score}</span>
                        <span className="text-slate-300 text-xs">/ 100</span>
                        <span className="text-[10px] text-slate-400 w-8 text-right">{meta.weight}%</span>
                    </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full rounded-full ${barColor(score)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.9, delay: 0.1 }}
                    />
                </div>
            </div>
        );
    };

    // Safe accessors — all fields are optional so old data won't crash
    const missingKeywords  = analysis?.details?.keyword?.missing_keywords ?? [];
    const matchedKeywords  = analysis?.details?.keyword?.matched_keywords  ?? [];
    const weakPhrases      = analysis?.details?.impact?.weak_phrases_found ?? [];
    const missingSections  = analysis?.details?.completeness?.missing_sections ?? [];
    const alignmentGaps    = analysis?.details?.alignment?.alignment_gaps    ?? [];
    const alignmentStrengths = analysis?.details?.alignment?.alignment_strengths ?? [];
    const quantified       = analysis?.details?.impact?.quantified_bullet_count ?? 0;
    const totalBullets     = analysis?.details?.impact?.total_bullet_count     ?? 0;

    return (
        <div className="flex flex-col gap-6 font-sans">

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-black font-display text-slate-800">ATS Analysis</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        8-dimension scoring that mirrors how MAANG ATS systems evaluate resumes.
                    </p>
                </div>
                <Button variant="outline" onClick={onBack} className="rounded-xl border-slate-200">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Builder
                </Button>
            </div>

            {/* JD Input */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-1">Target Job Description <span className="text-slate-400 font-normal">(optional)</span></h3>
                <p className="text-sm text-slate-500 mb-4">
                    Paste a JD to get tailored keyword gap analysis and role alignment scoring.
                </p>
                <textarea
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6D5DF6]/20 focus:border-[#6D5DF6] outline-none text-sm resize-none mb-4 font-sans"
                    placeholder="Paste job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
                <Button
                    variant="purple"
                    onClick={() => onAnalyze(jobDescription)}
                    disabled={isLoading}
                    className="w-full h-11"
                >
                    {isLoading
                        ? <><RefreshCw className="w-4 h-4 animate-spin mr-2" />Analyzing Resume...</>
                        : <><Search className="w-4 h-4 mr-2" />Run ATS Scan</>
                    }
                </Button>
            </div>

            {analysis && (
                <div className="flex flex-col gap-6">

                    {/* Score ring + dimension bars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            {renderScoreRing(analysis.overallScore)}
                        </div>
                        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center gap-4">
                            <h3 className="font-bold text-slate-800">Score Breakdown</h3>
                            <div className="flex flex-col gap-4">
                                {Object.entries(analysis.dimensionScores).map(([key, score]) =>
                                    renderDimensionBar(key, score as number)
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Prioritized Recommendations */}
                    {/* {recommendations.length > 0 && (
                        <div className="bg-gradient-to-br from-[#6D5DF6]/5 to-pink-500/5 p-6 rounded-3xl border border-[#6D5DF6]/10">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 bg-[#6D5DF6]/10 rounded-lg text-[#6D5DF6]">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Prioritized Fixes</h3>
                                    <p className="text-xs text-slate-500">Sorted by impact on your ATS score</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {recommendations.map((rec, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${PRIORITY_STYLES[rec.priority] ?? PRIORITY_STYLES.low}`}>
                                                {rec.priority}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">{rec.dimension}</span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700 mb-1">{rec.issue}</p>
                                        <p className="text-xs text-slate-500 border-l-2 border-slate-200 pl-3">{rec.fix}</p>
                                        {rec.impact && (
                                            <p className="text-[11px] text-[#6D5DF6] mt-2 font-medium">↑ {rec.impact}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="purple"
                                className="mt-6 shadow-md shadow-[#6D5DF6]/20 w-full"
                                onClick={() => onImprove(selectedKeywords)}
                                disabled={isImproving || isLoading}
                            >
                                {isImproving
                                    ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Improving Resume...</>
                                    : <><Zap className="w-4 h-4 mr-2" />Auto-Improve with AI</>
                                }
                            </Button>
                        </div>
                    )} */}

                    {/* Keywords */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Keyword Analysis
                        </h3>

                        {missingKeywords.length > 0 ? (
                            <>
                                <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">
                                    Missing keywords (Select to indicate you know these skills)
                                </p>
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {missingKeywords.map((kw, i) => {
                                        const isSelected = selectedKeywords.includes(kw);
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => handleToggleKeyword(kw)}
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-all flex items-center gap-1.5 ${
                                                    isSelected
                                                        ? "bg-[#6D5DF6] text-white border-[#6D5DF6] hover:bg-[#5b4ee4]"
                                                        : "bg-red-50/50 text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => {}} // handled by click on button
                                                    className="rounded border-red-300 text-red-600 focus:ring-red-500 h-3 w-3 cursor-pointer"
                                                />
                                                {kw}
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedKeywords.length > 0 && (
                                    <Button
                                        variant="purple"
                                        className="mb-6 w-full text-xs font-bold py-2 px-4 rounded-xl"
                                        onClick={handleAddKeywordsClick}
                                    >
                                        Add Selected Keywords to Resume ({selectedKeywords.length})
                                    </Button>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-slate-500 mb-4">No major missing keywords detected.</p>
                        )}

                        {matchedKeywords.length > 0 && (
                            <>
                                <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">Matched keywords</p>
                                <div className="flex flex-wrap gap-2">
                                    {matchedKeywords.map((kw, i) => (
                                        <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-100">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Impact Language */}
                    {(weakPhrases.length > 0 || totalBullets > 0) && (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-[#6D5DF6]" />
                                Impact Language
                            </h3>

                            {totalBullets > 0 && (
                                <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                                    <div className="text-center">
                                        <div className={`text-2xl font-black ${scoreColor(Math.round((quantified / totalBullets) * 100))}`}>
                                            {quantified}/{totalBullets}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">bullets quantified</div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {Math.round((quantified / totalBullets) * 100)}% of your bullets contain measurable metrics.
                                        Aim for 50%+ to pass modern ATS filters.
                                    </p>
                                </div>
                            )}

                            {weakPhrases.length > 0 && (
                                <>
                                    <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Weak phrases to remove</p>
                                    <div className="flex flex-wrap gap-2">
                                        {weakPhrases.map((phrase, i) => (
                                            <span key={i} className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full border border-amber-100">
                                                {phrase}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    {/* Role Alignment */}
                    {(alignmentStrengths.length > 0 || alignmentGaps.length > 0) && (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                Role Alignment
                            </h3>
                            {analysis.details?.alignment?.inferred_seniority_level && (
                                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-[#6D5DF6]/8 rounded-full">
                                    <span className="text-xs font-bold text-[#6D5DF6]">
                                        Resume reads as: {analysis.details.alignment.inferred_seniority_level}
                                    </span>
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {alignmentStrengths.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2">Strengths</p>
                                        <ul className="space-y-1.5">
                                            {alignmentStrengths.map((s, i) => (
                                                <li key={i} className="flex gap-2 text-xs text-slate-600">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {alignmentGaps.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2">Gaps</p>
                                        <ul className="space-y-1.5">
                                            {alignmentGaps.map((g, i) => (
                                                <li key={i} className="flex gap-2 text-xs text-slate-600">
                                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                                                    {g}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Missing Sections */}
                    {missingSections.length > 0 && (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-red-500" />
                                Missing Sections
                            </h3>
                            <p className="text-xs text-slate-500 mb-3">
                                Each missing section is a null field in the ATS database — recruiters filtering by section will miss you.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {missingSections.map((sec, i) => (
                                    <span key={i} className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">
                                        {sec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}

            {/* Disclaimer */}
            <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100/80 text-left">
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                    <strong>Disclaimer:</strong> This ATS score is an estimated evaluation based on common ATS parsing, formatting, and keyword optimization practices. Actual scores may differ across employers and ATS platforms.
                </p>
            </div>
        </div>
    );
};