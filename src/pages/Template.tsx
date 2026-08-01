import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Briefcase,
    GraduationCap,
    Award,
    Globe,
    Star,
    Layers,
    ShieldCheck,
    FileText,
    BookOpen,
    Sparkles,
    Download,
    ArrowRight,
    Upload,
    Search,
    CheckCircle,
    Lock,
    Crown,
    MessageSquare,
    Send,
    Gem,
    MoreHorizontal
} from 'lucide-react';
import MinimalClean from '../templates/MinimalClean';
import ModernProfessional from '../templates/ModernProfessional';
import ElegantCompact from '../templates/ElegantCompact';
import TheMonolith from '../templates/TheMonolith';
import WelcomeScreen from '../components/WelcomeScreen';
import TheCurator from '../templates/TheCurator';
import TheHorizon from '../templates/TheHorizon';
import ClassicProfessional from '../templates/ClassicProfessional';
import NavySidebar from '../templates/NavySidebar';
import SharpExecutive from '../templates/SharpExecutive';
import TraditionalSerif from '../templates/TraditionalSerif';
import ModernTeal from '../templates/ModernTeal';
import ImpactBold from '../templates/ImpactBold';
import ElegantSidebar from '../templates/ElegantSidebar';
import ModernBanner from '../templates/ModernBanner';
import TechMinimalist from '../templates/TechMinimalist';
import type { ResumeData, ResumeEducation, ResumeExperience, ResumeProject } from '../types/resume';
import { defaultResumeData } from '../types/resume';
import { API_BASE_URL, post, downloadPdf as fetchPdf } from '../services/ApiService';
import { analyzeResumeForAts } from '../services/AtsService';
import type { AtsAnalysisResult } from '../services/AtsService';
import { AtsDashboard } from '../components/ats/AtsDashboard';
import { ResumeDocument, ResumePage, useResumePagination } from '../components/ats/PaginationEngine';
import templateStyles from '../templates/TemplateStyles.css?raw';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown-menu';
import Notification from '../components/Notification';

type TemplateId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

type BuilderForm = {
    // Personal
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    // Professional
    targetRole: string;
    summary: string;
    // Core sections
    experience: string;
    education: string;
    skills: string;
    // Extended sections
    projects: string;
    certifications: string;
    languages: string;
    awards: string;
    volunteerWork: string;
    publications: string;
    // ATS
    jobDescription: string;
};

type TemplateConfig = {
    id: TemplateId;
    name: string;
    badge: string;
    desc: string;
    atsScore: number;
    bestFor: string[];
    render: (data?: ResumeData, props?: Record<string, any>) => React.ReactElement;
};

const templates: TemplateConfig[] = [
    {
        id: 1,
        render: (data, props) => <MinimalClean data={data} {...props} />,
        name: 'Developer ATS',
        badge: 'ATS Optimized',
        atsScore: 98,
        bestFor: ['Developers', 'Students'],
        desc: 'Single column, serif typography. Maximum readability for applicant tracking systems.',
    },
    {
        id: 2,
        render: (data, props) => <ModernProfessional data={data} {...props} />,
        name: 'Startup ATS',
        badge: 'Two Column',
        atsScore: 94,
        bestFor: ['Startup', 'Developers'],
        desc: 'Sidebar layout with navy accent. Confident and polished for competitive tech roles.',
    },
    {
        id: 3,
        render: (data, props) => <ElegantCompact data={data} {...props} />,
        name: 'Executive Pro',
        badge: 'Compact',
        atsScore: 92,
        bestFor: ['Executive', 'Leadership'],
        desc: 'Classic serif with warm gold accents. Refined and distinctive for creative professionals.',
    },
    {
        id: 4,
        render: (data, props) => <TheMonolith data={data} {...props} />,
        name: 'Bold Leader',
        badge: 'Bold Centered',
        atsScore: 88,
        bestFor: ['Leadership', 'Career Switch'],
        desc: 'Bold, centered, authoritative.',
    },
    {
        id: 5,
        render: (data, props) => <TheCurator data={data} {...props} />,
        name: 'Creative Tech',
        badge: 'Two Column',
        atsScore: 85,
        bestFor: ['Startup', 'Students'],
        desc: 'Refined, multi-column, editorial.',
    },
    {
        id: 6,
        render: (data, props) => <TheHorizon data={data} {...props} />,
        name: 'Modern Vision',
        badge: 'Wide Header',
        atsScore: 89,
        bestFor: ['Career Switch', 'Executive'],
        desc: 'Sleek, wide, contemporary.',
    },
    {
        id: 7,
        render: (data, props) => <ClassicProfessional data={data} {...props} />,
        name: 'Classic Serif',
        badge: 'Classic Serif',
        atsScore: 96,
        bestFor: ['Executive', 'Students'],
        desc: 'Clean centered serif layout with fine dividers, inspired by classic professional resumes.',
    },
    {
        id: 8,
        render: (data, props) => <NavySidebar data={data} {...props} />,
        name: 'Navy Sidebar',
        badge: 'Two Column',
        atsScore: 95,
        bestFor: ['Developers', 'Startup'],
        desc: 'Dual-column layout featuring a professional dark navy sidebar and readable main content.',
    },
    {
        id: 9,
        render: (data, props) => <SharpExecutive data={data} {...props} />,
        name: 'Sharp Executive',
        badge: 'Modern Bold',
        atsScore: 97,
        bestFor: ['Leadership', 'Executive'],
        desc: 'Highly authoritative modern layout featuring distinct left accent bars and clean blue colors.',
    },
    {
        id: 10,
        render: (data, props) => <TraditionalSerif data={data} {...props} />,
        name: 'Harvard Classic',
        badge: 'Harvard Classic',
        atsScore: 99,
        bestFor: ['Leadership', 'Students'],
        desc: 'The gold standard traditional single-column format, optimized for absolute maximum ATS pass rate.',
    },
    {
        id: 11,
        render: (data, props) => <ModernTeal data={data} {...props} />,
        name: 'Modern Teal',
        badge: 'Two Column',
        atsScore: 94,
        bestFor: ['Startup', 'Career Switch'],
        desc: 'Clean slate sidebar with elegant teal accents, presenting a visually engaging balance of style and data.',
    },
    {
        id: 12,
        render: (data, props) => <ImpactBold data={data} {...props} />,
        name: 'Impact Bold',
        badge: 'Dark Header',
        atsScore: 93,
        bestFor: ['Executive', 'Leadership'],
        desc: 'Polished layout with a dark header block that instantly creates a memorable first impression.',
    },
    {
        id: 13,
        render: (data, props) => <ElegantSidebar data={data} {...props} />,
        name: 'Premium Sidebar',
        badge: 'Premium Sidebar',
        atsScore: 96,
        bestFor: ['Executive', 'Leadership'],
        desc: 'Elegant dual-column layout with a prominent left sidebar for contact, education and skills.',
    },
    {
        id: 14,
        render: (data, props) => <ModernBanner data={data} {...props} />,
        name: 'Outlined Banner',
        badge: 'Outlined Banner',
        atsScore: 95,
        bestFor: ['Career Switch', 'Students'],
        desc: 'Clean single-column template with a soft blue header banner and outlined core competency capsules.',
    },
    {
        id: 15,
        render: (data, props) => <TechMinimalist data={data} {...props} />,
        name: 'Tech Minimalist',
        badge: 'Tech Minimalist',
        atsScore: 98,
        bestFor: ['Developers', 'Startup'],
        desc: 'High-readability technical layout featuring a thick header separator and detailed sidebar columns.',
    },
];

const premiumTemplateIds = new Set<TemplateId>([3, 6, 7, 8, 9, 11, 12, 13, 14, 15]);
const isTemplatePremium = (id: TemplateId) => premiumTemplateIds.has(id);

const starterForm: BuilderForm = {
    fullName: 'Alexandra Chen',
    email: 'alexandra.chen@email.com',
    phone: '+1 (415) 555-0182',
    location: 'San Francisco, CA',
    website: '',
    linkedin: 'linkedin.com/in/alexchen',
    github: '',
    targetRole: 'Senior Product Manager',
    summary: 'Results-driven Senior Product Manager with 7+ years of experience leading cross-functional teams and delivering data-informed product strategies. Proven track record of driving significant ARR growth and improving customer retention through structured experimentation and roadmap execution.',
    experience:
        'Senior Product Manager | Stripe | San Francisco, CA | Jan 2021 - Present\n- Led billing product improvements that contributed to $28M increase in ARR\n- Managed cross-functional team of 12 engineers, 3 designers, and 2 data analysts\n- Reduced customer churn by 18% through improved onboarding\n\nProduct Manager | Salesforce | San Francisco, CA | Jun 2018 - Dec 2020\n- Owned end-to-end roadmap for CRM analytics module used by 50,000+ customers\n- Shipped 3 major feature releases, increasing daily active usage by 34%',
    education: 'B.S. Computer Science, Minor in Business | University of California, Berkeley | 2012 - 2016 | GPA 3.8',
    skills: 'Product Strategy, Agile / Scrum, SQL, User Research, A/B Testing, Figma, Python, JIRA, Analytics, Roadmapping',
    projects: 'Customer Insights Dashboard | Analytics platform | Built executive dashboard that unified product, support, and revenue signals\nMobile Onboarding Redesign | UX initiative | Reduced drop-off by 22% through redesigned first-run experience',
    certifications: 'Certified Scrum Product Owner (CSPO) | Scrum Alliance | 2020\nGoogle Analytics Certified | Google | 2021',
    languages: 'English (Native), Mandarin (Professional)',
    awards: 'Product Leader of the Year | Stripe | 2022\nTop 30 Under 30 Product Managers | Product School | 2019',
    volunteerWork: '',
    publications: '',
    jobDescription: '',
};

const splitLines = (value: string) => (value || '').split('\n').map((item) => item.trim()).filter(Boolean);

// isAiPreamble — detects AI narrative lines that should not be treated as data.
// AI models sometimes prefix output with "Here is the improved section:" etc.
const isAiPreamble = (item: string): boolean => {
    if (!item) return false;
    const lower = item.toLowerCase();
    if (lower.endsWith(':')) return true;
    if (lower.startsWith('here ') || lower.startsWith('below ') || lower.startsWith('the following')) return true;
    if (lower.includes('improved') && (lower.includes('section') || lower.includes('skills') || lower.includes('education'))) return true;
    if (lower.startsWith('sure') || lower.startsWith('certainly') || lower.startsWith('of course')) return true;
    if (lower.includes('final version') || lower.includes('ats compatible') || lower.includes('ats-compatible')) return true;
    if (lower.startsWith('however') || lower.startsWith('additionally') || lower.startsWith('note:') || lower.startsWith('note ')) return true;
    if (lower.includes('without markdown') || lower.includes('more readable') || lower.includes('to make it')) return true;
    return false;
};

// stripAiNarrative — removes full preamble/narrative sentences from a multi-line
// AI response before any splitting. Handles cases where the AI wraps the actual
// data in explanatory prose (e.g. "Here is the final version:\n<data>\nHowever...").
const stripAiNarrative = (value: string): string => {
    if (!value) return value;
    return value
        .split('\n')
        .filter(line => !isAiPreamble(line.trim()))
        .join('\n');
};

// splitComma handles both comma-separated AND newline-separated values.
// AI models occasionally return skills/languages as newline lists instead of
// comma-separated, which would produce a single giant entry. We normalize
// newlines → commas before splitting so both formats parse correctly.
// Also guards against null/undefined values coming back from the AI.
// Additionally, AI models sometimes prefix output with narrative preamble —
// we strip those lines before splitting, then filter per-item as a second pass.
const splitComma = (value: string) => {
    if (!value) return [];
    // Strip narrative lines first (before comma-splitting corrupts them)
    const cleaned = stripAiNarrative(value);
    // If the AI returned multiple comma-separated lines (e.g. repeated the list),
    // pick the line with the most commas — that's the actual skills list.
    const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
    const bestLine = lines.length > 1
        ? lines.reduce((a, b) => (b.split(',').length > a.split(',').length ? b : a))
        : (lines[0] ?? '');
    // If even the best line has no commas but the original had newline-delimited items, join all
    const normalized = bestLine.includes(',') ? bestLine : lines.join(',');
    return normalized
        .split(',')
        .map((item) => item.replace(/[\u00A0\u200B\u2060\uFEFF]/g, ' ').trim()) // strip non-breaking/zero-width spaces
        .filter(Boolean)
        .filter((item) =>
            /[a-zA-Z0-9]/.test(item) &&   // must contain at least one alphanumeric character
            !isAiPreamble(item) &&
            item.length <= 60
        );
};

const parseExperience = (value: string): ResumeExperience[] => {
    const trimmed = value.trim();
    if (!trimmed) return [];

    let rawBlocks: string[];
    if (/\n\s*\n/.test(trimmed)) {
        rawBlocks = trimmed.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    } else {
        // No blank lines — split whenever we hit a line containing '|' that is not a bullet
        const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
        rawBlocks = [];
        let current: string[] = [];
        for (const line of lines) {
            const isHeader = line.includes('|') && !/^[-*•]/.test(line);
            if (isHeader && current.length > 0) {
                rawBlocks.push(current.join('\n'));
                current = [];
            }
            current.push(line);
        }
        if (current.length > 0) rawBlocks.push(current.join('\n'));
    }

    return rawBlocks.map((block) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        const parts = (lines[0] || '').split('|').map((item) => item.trim());
        // Collapse any AI-injected newlines inside field values (e.g. "DevOps\nEngineer" → "DevOps Engineer")
        const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
        const title = clean(parts[0] || '');
        const company = clean(parts[1] || '');
        const location = clean(parts[2] || '');
        const dates = clean(parts[3] || '');
        const bullets = lines.slice(1).map((line) => line.replace(/^[-*•o▪▫◦■\u2022\u2023\u25E6\u2043]\s*/, '')).filter(Boolean);
        return { title, company, location, dates, bullets };
    });
};

const parseEducation = (value: string): ResumeEducation[] => {
    return splitLines(value)
        .filter((line) => !isAiPreamble(line)) // strip AI narrative lines
        .map((line) => {
            const parts = line.split('|').map((item) => item.trim());
            const degree = parts[0] || '';
            const school = parts[1] || '';
            const dates = parts[2] || '';
            const details = parts[3] || '';
            return { degree, school, dates, details };
        })
        .filter((edu) => edu.degree && edu.school); // require at least degree + school
};

const parseProjects = (value: string): ResumeProject[] => {
    const trimmed = value.trim();
    if (!trimmed) return [];

    let rawBlocks: string[];

    if (/\n\s*\n/.test(trimmed)) {
        // Strategy 1 (preferred): blank-line separated blocks
        rawBlocks = trimmed.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    } else {
        // Strategy 2 & 3 for single-newline text:
        // Split when we encounter a non-bullet "header" line.
        // A header line is either: (a) contains '|', or (b) is short (≤80 chars)
        // AND the PREVIOUS line was a bullet or description (not another header).
        const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
        rawBlocks = [];
        let current: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isBulletLine = /^[-*•]/.test(line);
            const hasPipe = line.includes('|') && !isBulletLine;
            // Short title heuristic: non-bullet, ≤80 chars, AND either:
            //   - next line exists AND is a bullet/description (not a header itself)
            //   - OR line has a pipe
            const nextLine = lines[i + 1] || '';
            const nextIsBullet = /^[-*•]/.test(nextLine);
            const isShortTitle = !isBulletLine && line.length <= 80 && current.length > 0 &&
                (hasPipe || nextIsBullet || nextLine.length > 80);

            if ((hasPipe || isShortTitle) && current.length > 0) {
                rawBlocks.push(current.join('\n'));
                current = [];
            }
            current.push(line);
        }
        if (current.length > 0) rawBlocks.push(current.join('\n'));
    }

    return rawBlocks.map((block) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        // Line 0 is the header: "Name | meta" or just "Name"
        const firstLine = lines[0] || '';
        const pipeIdx = firstLine.indexOf('|');
        let name: string;
        let meta: string;

        if (pipeIdx !== -1) {
            name = firstLine.slice(0, pipeIdx).trim();
            meta = firstLine.slice(pipeIdx + 1).trim();
        } else {
            name = firstLine.trim();
            meta = '';
        }

        // All remaining lines become bullets (strip leading bullet markers)
        const bullets = lines.slice(1)
            .map(line => line.replace(/^[-*•o▪▫◦■\u2022\u2023\u25E6\u2043]\s*/, '').trim())
            .filter(Boolean);

        return { name, meta, bullets };
    }).filter(p => p.name);
};



const parseAwards = (value: string): { name: string; meta: string; bullets: string[] }[] => {
    const trimmed = (value || '').trim();
    if (!trimmed) return [];

    let rawBlocks: string[];
    if (/\n\s*\n/.test(trimmed)) {
        rawBlocks = trimmed.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
    } else {
        // No blank lines — split whenever we hit a line containing '|' that is not a bullet
        const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
        rawBlocks = [];
        let current: string[] = [];
        for (const line of lines) {
            const isHeader = line.includes('|') && !/^[-*•]/.test(line);
            if (isHeader && current.length > 0) {
                rawBlocks.push(current.join('\n'));
                current = [];
            }
            current.push(line);
        }
        if (current.length > 0) rawBlocks.push(current.join('\n'));
    }

    return rawBlocks.map((block) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        const [name = 'Award', meta = ''] = (lines[0] || '').split('|').map((item) => item.trim());
        const bullets = lines.slice(1).map((line) => line.replace(/^[-*•o▪▫◦■\u2022\u2023\u25E6\u2043]\s*/, '')).filter(Boolean);
        return { name, meta, bullets };
    }).filter((a) => a.name && a.name !== 'Award'); // don't emit placeholder-only entries
};

/**
 * safeMergeForm — merges AI-returned form fields into the current form,
 * keeping the original value whenever AI returns null, undefined, or empty string.
 * This prevents AI from accidentally blanking out sections it didn't improve.
 */
const safeMergeForm = (current: BuilderForm, aiReturned: BuilderForm): BuilderForm => {
    const merged = { ...current };
    const keys = Object.keys(aiReturned) as (keyof BuilderForm)[];
    for (const key of keys) {
        const newVal = aiReturned[key];
        // Only accept the AI value if it's a non-empty string
        if (typeof newVal === 'string' && newVal.trim()) {
            (merged as any)[key] = newVal;
        }
        // Otherwise: keep current[key] — AI returned empty/null, preserve original
    }
    return merged;
};

const buildResumeData = (form: BuilderForm): ResumeData => {
    const links: string[] = [
        form.linkedin,
        form.github,
        form.website,
    ].filter(Boolean);

    const skills = splitComma(form.skills);
    const experience = parseExperience(form.experience);
    const certifications = splitLines(form.certifications).map((line) => {
        const parts = line.split('|').map((s) => s.trim());
        return parts[0] + (parts[1] ? ` — ${parts[1]}` : '') + (parts[2] ? ` (${parts[2]})` : '');
    }).filter(Boolean); // guard: don't include empty certification strings
    const languages = splitComma(form.languages);
    const awards = parseAwards(form.awards);

    const extraProjects: ResumeProject[] = [];
    if (form.volunteerWork.trim()) {
        splitLines(form.volunteerWork).forEach((line) => {
            const [name = 'Volunteer', meta = '', ...rest] = line.split('|').map((s) => s.trim());
            extraProjects.push({ name, meta: `Volunteer — ${meta}`, bullets: rest.filter(Boolean) });
        });
    }
    if (form.publications.trim()) {
        splitLines(form.publications).forEach((line) => {
            const [name = 'Publication', meta = ''] = line.split('|').map((s) => s.trim());
            extraProjects.push({ name, meta: `Publication — ${meta}`, bullets: [] });
        });
    }

    return {
        fullName: form.fullName.trim() || '',
        headline: form.targetRole.trim() || '',
        email: form.email.trim() || '',
        phone: form.phone.trim() || '',
        location: form.location.trim() || '',
        links,
        summary: form.summary.trim() || '',
        skills: form.skills.trim() ? skills : [],
        experience: form.experience.trim() ? experience : [],
        education: form.education.trim() ? parseEducation(form.education) : [],
        certifications,
        projects: [...(form.projects.trim() ? parseProjects(form.projects) : []), ...extraProjects],
        languages: form.languages?.trim() ? languages : [],
        awards,
        atsScore: 0,
    };
};

export const resumeToText = (data: ResumeData) => [
    data.fullName,
    data.headline,
    [data.email, data.phone, data.location, ...data.links].filter(Boolean).join(' | '),
    '',
    'SUMMARY',
    data.summary,
    '',
    'SKILLS',
    data.skills.join(', '),
    '',
    'EXPERIENCE',
    ...data.experience.flatMap((job) => [
        `${job.title} | ${job.company} | ${job.location} | ${job.dates}`,
        ...job.bullets.map((bullet) => `- ${bullet}`),
        '',
    ]),
    'EDUCATION',
    ...data.education.map((edu) => `${edu.degree} | ${edu.school} | ${edu.dates}${edu.details ? ` | ${edu.details}` : ''}`),
    '',
    data.certifications.length ? 'CERTIFICATIONS' : '',
    ...data.certifications.map((c) => `- ${c}`),
    '',
    data.projects.length ? 'PROJECTS' : '',
    ...data.projects.flatMap((project) => [`${project.name} | ${project.meta}`, ...project.bullets.map((bullet) => `- ${bullet}`), '']),
    data.languages.length ? 'LANGUAGES' : '',
    data.languages.length ? data.languages.join(', ') : '',
    '',
    data.awards.length ? 'AWARDS' : '',
    ...data.awards.map((a) => `${a.name}${a.meta ? ` — ${a.meta}` : ''}`),
].filter((line, index, lines) => line !== '' || lines[index - 1] !== '').join('\n');

const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};



const parseFormFromJson = (raw: unknown): BuilderForm => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        throw new Error('Invalid JSON structure: expected an object.');
    }
    const keys: (keyof BuilderForm)[] = [
        'fullName', 'email', 'phone', 'location', 'website', 'linkedin', 'github',
        'targetRole', 'summary', 'experience', 'education', 'skills',
        'projects', 'certifications', 'languages', 'awards', 'volunteerWork',
        'publications', 'jobDescription',
    ];
    const result = { ...starterForm };
    for (const key of keys) {
        const val = (raw as Record<string, string>)[key];
        if (typeof val === 'string') (result as Record<string, string>)[key] = val;
    }
    return result;
};

type SectionProps = {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    onImprove?: () => void;
    isImproving?: boolean;
    showImproveButton?: boolean;
};

const Section: React.FC<SectionProps> = ({
    title,
    icon,
    children,
    defaultOpen = true,
    onImprove,
    isImproving = false,
    showImproveButton = true,
}) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="mb-4 overflow-hidden rounded-[1.75rem] border border-[#f1f5f9] bg-white shadow-glass">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-[#FAFAFC] px-5 py-4">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex flex-1 items-center gap-3 text-left cursor-pointer outline-none"
                >
                    <span className="text-[#6D5DF6] shrink-0">{icon}</span>
                    <span className="font-bold text-sm text-[#0F172A] font-sans">
                        {title}
                    </span>
                    <span
                        className={`ml-auto text-[#64748B] transition-transform duration-250 ${open ? "rotate-180" : ""
                            }`}
                    >
                        ▾
                    </span>
                </button>

                {showImproveButton && (
                    <button
                        type="button"
                        disabled={isImproving}
                        onClick={onImprove}
                        className={`
                            shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer font-sans
                            ${isImproving
                                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                : "bg-[#6D5DF6]/8 text-[#6D5DF6] border border-[#6D5DF6]/12 hover:bg-[#6D5DF6] hover:text-white"
                            }
                        `}
                    >
                        {isImproving ? "Improving..." : "✨ Improve"}
                    </button>
                )}
            </div>

            {/* Content */}
            {open && (
                <div className="space-y-4 bg-white px-5 py-5 text-left">
                    {children}
                </div>
            )}
        </div>
    );
};

const Label: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
    <div className="mb-2 text-left">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] font-display">{children}</label>
        {hint && <p className="text-[11px] text-slate-400 font-light mt-0.5 leading-relaxed">{hint}</p>}
    </div>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className = "", ...props }, ref) => (
        <input
            ref={ref}
            {...props}
            className={`w-full bg-[#FAFAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#bbb8b2] focus:outline-none focus:ring-2 focus:ring-[#6D5DF6] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans ${className}`}
        />
    )
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className = "", ...props }, ref) => (
        <textarea
            ref={ref}
            {...props}
            className={`w-full bg-[#FAFAFC] border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-[#0F172A] placeholder-[#bbb8b2] focus:outline-none focus:ring-2 focus:ring-[#6D5DF6] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans resize-none leading-relaxed overflow-hidden ${className}`}
        />
    )
);
Textarea.displayName = "Textarea";


const TemplateGallery: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isPremium, refreshUser } = useAuth();
    const [selectedId, setSelectedId] = useState<TemplateId | null>(location.state?.selectedTemplateId || null);
    const [form, setForm] = useState<BuilderForm>(starterForm);
    const [totalPages, setTotalPages] = useState(1);
    const [previewScale, setPreviewScale] = useState(1);
    const previewParentRef = useRef<HTMLDivElement>(null);
    const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
    const thumbContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const resumeRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [improvingSection, setImprovingSection] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [parsingStatus, setParsingStatus] = useState("");
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [notification, setNotification] = useState<{
        type: "success" | "error" | "info";
        message: string;
    } | null>(null);
    const [mobileEditorView, setMobileEditorView] = useState<'form' | 'preview'>('form');
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [feedbackForm, setFeedbackForm] = useState({
        name: user?.fullName || '',
        email: user?.email || '',
        rating: '5',
        message: '',
    });


    // ATS States
    const [showAtsDashboard, setShowAtsDashboard] = useState(false);
    const [atsAnalysisData, setAtsAnalysisData] = useState<AtsAnalysisResult | null>(null);
    const [isAnalyzingAts, setIsAnalyzingAts] = useState(false);
    const [isImprovingAts, setIsImprovingAts] = useState(false);
    const activeTemplate = templates.find((template) => template.id === selectedId);
    const isTwoColumnTemplate = selectedId === 2 || selectedId === 3 || selectedId === 5 || selectedId === 8 || selectedId === 11 || selectedId === 13 || selectedId === 15;
    const pagination = useResumePagination(resumeData, selectedId || 1, isTwoColumnTemplate, {
        sidebarMode: isTwoColumnTemplate ? 'repeat' : 'first-page-only',
        showContinuationLabels: true,
        debugPagination: false,
        marginTop: selectedId === 14 ? 8 : 48,
        marginBottom: selectedId === 14 ? 8 : 48,
    });

    // Automatically sync form changes to resumeData in real-time (debounced to prevent typing lag)
    useEffect(() => {
        const timer = setTimeout(() => {
            setResumeData(buildResumeData(form));
        }, 400); // 400ms debounce
        return () => clearTimeout(timer);
    }, [form]);

    const runAtsScan = async (jobDescription: string = "", overrideData?: ResumeData, selectedKeywords: string[] = []) => {
        // Use overrideData if provided (e.g. right after an AI improvement),
        // otherwise use the current resumeData which is already kept in sync.
        // Do NOT rebuild from form here — that triggers an unnecessary
        // pagination remeasure mid-scan, causing template layout inconsistencies.
        const dataToAnalyze = overrideData ?? resumeData;
        setIsAnalyzingAts(true);
        try {
            const result = await analyzeResumeForAts(
                dataToAnalyze,
                jobDescription,
                form.targetRole || "",
                isTwoColumnTemplate,
                selectedKeywords
            );
            setAtsAnalysisData(result);
        } catch (error) {
            showNotification('error', 'ATS scan failed. Please try again.');
        } finally {
            setIsAnalyzingAts(false);
        }
    };

    const handleAddKeywords = async (keywords: string[]) => {
        if (keywords.length === 0) return;
        const currentSkills = form.skills.trim();
        const newSkills = currentSkills
            ? `${currentSkills}, ${keywords.join(', ')}`
            : keywords.join(', ');
        
        const updatedForm = { ...form, skills: newSkills };
        setForm(updatedForm);

        // Build and sync resumeData immediately to bypass the 400ms debounce
        const freshData = buildResumeData(updatedForm);
        setResumeData(freshData);

        // Re-scan with empty selected keywords since they are now matched keywords in the resume
        await runAtsScan(form.jobDescription || "", freshData, []);
        showNotification('success', `Added ${keywords.length} keyword(s) to your skills section!`);
    };

    const handleAutoImprove = async (selectedKeywords: string[] = []) => {
        if (!atsAnalysisData) return;
        setIsImprovingAts(true);

        try {
            const response = await post("resume/score-and-improve", {
                form,
                jobDescription: form.jobDescription,
                selectedMissingKeywords: selectedKeywords,
            });
            const data = response.data;

            if (data.success) {
                // Safe-merge: only overwrite fields the AI actually improved with
                // non-empty content. Never let AI blank out languages, education, etc.
                const mergedForm = safeMergeForm(form, data.data.improvedForm);
                setForm(mergedForm);
                const newResumeData = buildResumeData(mergedForm);
                setResumeData(newResumeData);
                
                // Run full ATS scan again to recalculate and refresh dashboard scores
                await runAtsScan(form.jobDescription || "", newResumeData, selectedKeywords);

                showNotification(
                    "success",
                    `AI Auto-Improve Successful! Improved: ${data.data.sectionsImproved.join(", ")}`
                );
            } else {
                showNotification("error", data.message || "Auto-improve failed.");
            }
        } catch (error) {
            showNotification("error", "An error occurred while improving.");
        } finally {
            setIsImprovingAts(false);
        }
    };

    const [selectedCategory, setSelectedCategory] = useState<string>('All Templates');
    const [searchRole, setSearchRole] = useState('');

    const filteredTemplates = templates.filter(tpl => {
        const matchesCategory = selectedCategory === 'All Templates' || (tpl.bestFor && tpl.bestFor.includes(selectedCategory));
        const searchLower = (searchRole || '').toLowerCase();
        const matchesSearch = !searchRole ||
            (tpl.name && tpl.name.toLowerCase().includes(searchLower)) ||
            (tpl.desc && tpl.desc.toLowerCase().includes(searchLower)) ||
            (tpl.bestFor && tpl.bestFor.some(bf => bf && bf.toLowerCase().includes(searchLower)));

        return matchesCategory && matchesSearch;
    });

    const showNotification = (
        type: "success" | "error" | "info",
        message: string
    ) => {
        setNotification({ type, message });

        setTimeout(() => {
            setNotification(null);
        }, 4000);
    };

    useEffect(() => {
        setFeedbackForm((current) => ({
            ...current,
            name: current.name || user?.fullName || '',
            email: current.email || user?.email || '',
        }));
    }, [user?.email, user?.fullName]);

    const submitFeedback = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!feedbackForm.message.trim()) {
            showNotification('error', 'Please enter your feedback.');
            return;
        }

        setIsSubmittingFeedback(true);
        try {
            const response = await post('feedback', {
                ...feedbackForm,
                page: window.location.pathname,
            });

            if (response.data?.success) {
                showNotification('success', 'Thanks for the feedback.');
                setFeedbackOpen(false);
                setFeedbackForm((current) => ({ ...current, message: '', rating: '5' }));
            } else {
                showNotification('error', response.data?.message || 'Failed to send feedback.');
            }
        } catch (error) {
            showNotification('error', (error as any)?.response?.data?.message || 'Failed to send feedback.');
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    useEffect(() => {
        const handleBlur = () => {
            const activeElement = document.activeElement as HTMLElement;
            if (activeElement?.matches('[contenteditable="true"]')) {
                activeElement.blur();
            }
        }
        window.addEventListener('blur', handleBlur);
        return () => window.removeEventListener('blur', handleBlur);
    }, [])

    useEffect(() => {
        if (selectedId !== null) return;
        const RESUME_WIDTH = 794; // A4 page width in px
        const calibrateThumbs = () => {
            thumbContainerRefs.current.forEach(card => {
                if (!card) return;
                const cardW = card.offsetWidth;
                if (!cardW) return;
                const scale = cardW / RESUME_WIDTH;
                const thumbWrap = card.querySelector('.thumb-wrap') as HTMLElement;
                if (thumbWrap) {
                    thumbWrap.style.transform = `scale(${scale})`;
                    thumbWrap.style.transformOrigin = 'top left';
                }
            });
        };
        // Run immediately, then after paint and a short delay to ensure DOM is ready
        requestAnimationFrame(() => {
            calibrateThumbs();
            setTimeout(calibrateThumbs, 200);
        });
        window.addEventListener('resize', calibrateThumbs);
        return () => window.removeEventListener('resize', calibrateThumbs);
    }, [selectedId, selectedCategory, searchRole]);

    useEffect(() => {
        setTotalPages(Math.max(1, pagination.pages.length));
    }, [pagination.pages.length]);

    useEffect(() => {
        const handleResize = () => {
            const parent = previewParentRef.current;
            if (!parent) return;
            const parentWidth = parent.offsetWidth;
            if (!parentWidth) return;
            if (parentWidth < 794) {
                setPreviewScale(parentWidth / 794);
            } else {
                setPreviewScale(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const timer = setTimeout(handleResize, 150);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, [resumeData, selectedId, totalPages, mobileEditorView]);

    const canUsePremiumTemplates = isPremium();

    const openTemplate = (templateId: TemplateId) => {
        if (isTemplatePremium(templateId) && !canUsePremiumTemplates) {
            navigate('/pricing');
            return;
        }

        setSelectedId(templateId);
        window.scrollTo(0, 0);
    };

    const set = (field: keyof BuilderForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((cur) => ({ ...cur, [field]: e.target.value }));

    const downloadPdf = async () => {
        const element = resumeRef.current;
        if (!element) return;

        const filename = `${resumeData.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

        setIsDownloadingPdf(true);
        try {
            const clone = element.cloneNode(true) as HTMLElement;
            clone.querySelectorAll('.visual-page-break').forEach((el) => el.remove());
            
            // Clean up individual resume pages for printing
            clone.querySelectorAll('.resume-page').forEach((el) => {
                const pageEl = el as HTMLElement;
                pageEl.style.boxShadow = 'none';
                pageEl.style.border = 'none';
                
                // Remove debug pagination overlay if present
                pageEl.querySelectorAll('div').forEach((child) => {
                    const childEl = child as HTMLElement;
                    if (childEl.textContent?.includes('DEBUG:')) {
                        childEl.remove();
                    }
                });
            });
            clone.style.transform = 'none';
            clone.style.boxShadow = 'none';
            clone.style.border = '0';

            const blob = await fetchPdf(clone.outerHTML, templateStyles, filename);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(url);
            
            showNotification('success', 'Resume PDF generated and downloaded successfully!');
            refreshUser();
        } catch (err) {
            console.error('Failed to generate PDF:', err);
            showNotification('error', (err as Error)?.message || 'Failed to generate PDF. Make sure the backend server is running on port 5000.');
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    const fillTemplate = () => {
        setResumeData(buildResumeData(form));
        setMobileEditorView('preview');
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.name.endsWith('.json')) {
            setIsParsing(true);
            try {
                const text = await file.text();
                const raw = JSON.parse(text);
                const restored = parseFormFromJson(raw);
                setForm(restored);
                setResumeData(buildResumeData(restored));
            } catch (error) {
                console.error('Error importing JSON resume data:', error);
                showNotification('error', 'Failed to import resume data. Please ensure the file is a valid resume JSON exported from this app.');
            } finally {
                setIsParsing(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
            return;
        }

        setIsParsing(true);
        setParsingStatus("Extracting text from resume…");
        const formData = new FormData();
        formData.append("resume", file);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/resume/parse`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });
            const data = await response.json();
            if (data.success && data.data) {
                const parsed = data.data;
                // If targetRole is missing, infer it from the first experience title
                if (!parsed.targetRole?.trim() && parsed.experience?.trim()) {
                    const firstLine = parsed.experience.trim().split('\n')[0] || '';
                    const firstTitle = firstLine.split('|')[0]?.trim();
                    if (firstTitle) parsed.targetRole = firstTitle;
                }
                const updatedForm = { ...form, ...parsed };
                setForm(updatedForm);
                setResumeData(buildResumeData(updatedForm));
                if (data.extractionMethod === 'ocr') {
                    showNotification('success', 'Image-based PDF detected — text was extracted using OCR.');
                }
            } else {
                showNotification('error', data.message || "Failed to parse resume");
            }
        } catch (error) {
            console.error("Error parsing resume:", error);
            showNotification('error', "An error occurred while uploading the resume.");
        } finally {
            setIsParsing(false);
            setParsingStatus("");
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const improveSection = async (section: keyof BuilderForm) => {
        try {
            console.log("AI improve clicked for:", section);
            setImprovingSection(section);

            const response = await post(
                "resume/improve-section",
                {
                    form,
                    section,
                }
            );

            if (response?.data?.success) {
                const aiContent = response.data.content;
                // Safe-merge: only apply AI content if it's non-empty
                const updatedForm = aiContent?.trim()
                    ? { ...form, [section]: aiContent }
                    : form; // AI returned empty — keep original
                setForm(updatedForm);
                setResumeData(buildResumeData(updatedForm));
            }
            console.log(response);
        } catch (error) {
            console.error(`Failed to improve ${section}`, error);
            showNotification('error', (error as any)?.response?.data?.message || `Failed to improve ${section}.`);
        } finally {
            setImprovingSection("");
        }
    };

    const FeedbackModal = (
        <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogContent className="mx-4 max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Send feedback</DialogTitle>
                    <DialogDescription>
                        Tell us what worked, what broke, or what would make ProfilIO better.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitFeedback} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <Label>Name</Label>
                            <Input
                                placeholder="Your name"
                                value={feedbackForm.name}
                                onChange={(event) => setFeedbackForm((current) => ({ ...current, name: event.target.value }))}
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                placeholder="you@email.com"
                                value={feedbackForm.email}
                                onChange={(event) => setFeedbackForm((current) => ({ ...current, email: event.target.value }))}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Rating</Label>
                        <select
                            value={feedbackForm.rating}
                            onChange={(event) => setFeedbackForm((current) => ({ ...current, rating: event.target.value }))}
                            className="w-full bg-[#FAFAFC] border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6D5DF6] focus:border-transparent transition-all font-sans"
                        >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Okay</option>
                            <option value="2">2 - Needs work</option>
                            <option value="1">1 - Poor</option>
                        </select>
                    </div>

                    <div>
                        <Label>Feedback</Label>
                        <Textarea
                            rows={5}
                            placeholder="Share the issue, idea, or improvement..."
                            value={feedbackForm.message}
                            onChange={(event) => setFeedbackForm((current) => ({ ...current, message: event.target.value }))}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            variant="purple"
                            className="w-full sm:w-auto"
                            disabled={isSubmittingFeedback}
                        >
                            <Send className="h-4 w-4" />
                            {isSubmittingFeedback ? 'Sending...' : 'Send Feedback'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );

    if (activeTemplate) {
        return (
            <>
                <Notification notification={notification} />
                {FeedbackModal}
                {isDownloadingPdf && <WelcomeScreen />}
                
                <div className="bg-[#FAFAFC] min-h-screen pt-16 md:pt-20 pb-16 text-[#0F172A] font-sans">
                    {/* Sticky glass toolbar */}
                <div className="bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-sm print:hidden sticky top-0 z-40">
                    {/* LEFT: Navigation & Identity */}
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={() => setSelectedId(null)}
                            className="text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Back to Gallery"
                        >
                            <span className="text-lg leading-none">←</span>
                        </button>
                        <span className="font-display font-extrabold text-[15px] text-[#0F172A] truncate max-w-[120px] md:max-w-none">
                            {activeTemplate.name} <span className="text-slate-400 font-medium hidden sm:inline">Builder</span>
                        </span>
                    </div>

                    {/* CENTER: AI & Edit Controls */}
                    <div className="hidden md:flex items-center justify-center gap-2 flex-1 px-4">
                        <Button
                            variant="outline"
                            className="bg-[#6D5DF6]/5 border-transparent text-[#6D5DF6] hover:bg-[#6D5DF6]/15 hover:border-[#6D5DF6]/20 cursor-pointer h-9 px-4 text-[13px] font-bold rounded-xl transition-all shadow-none"
                            onClick={fillTemplate}
                        >
                            ✨ Fix Resume
                        </Button>

                        {user && (
                            <div className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-slate-50 text-[12px] font-bold text-slate-500 border border-slate-200" title="AI improvements used today">
                                <Sparkles className="w-3.5 h-3.5 text-[#6D5DF6]" />
                                AI {user.aiImprovements || 0}/{user.aiDailyLimit || 5}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Export & More */}
                    <div className="flex items-center gap-2 shrink-0">
                        <input
                            type="file"
                            accept=".pdf,.docx,.json"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <button className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer outline-none">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="right" className="w-56 font-sans">
                                {/* Mobile only elements in dropdown */}
                                <div className="md:hidden">
                                    <DropdownMenuItem onClick={fillTemplate} className="text-[#6D5DF6] font-medium">
                                        <Sparkles className="w-4 h-4 mr-2" /> Fix Resume
                                    </DropdownMenuItem>
                                    <div className="h-px bg-slate-100 my-1 mx-2" />
                                </div>
                                
                                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="w-4 h-4 mr-2 text-slate-400" />
                                    {isParsing ? (parsingStatus || "Extracting...") : "Upload Resume"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => downloadFile(`${resumeData.fullName.replace(/\s+/g, '_')}_Resume.txt`, resumeToText(resumeData), 'text/plain')}>
                                    <FileText className="w-4 h-4 mr-2 text-slate-400" />
                                    Download TXT
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFeedbackOpen(true)}>
                                    <MessageSquare className="w-4 h-4 mr-2 text-slate-400" />
                                    Send Feedback
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="purple"
                            className="h-9 px-4 text-[13px] font-bold rounded-xl shadow-md bg-[#6D5DF6] hover:bg-[#5b51d8] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-white border-0 transition-all cursor-pointer"
                            onClick={downloadPdf}
                            disabled={isDownloadingPdf}
                        >
                            {isDownloadingPdf ? (
                                "Generating..."
                            ) : (
                                <>
                                    <Download className="w-3.5 h-3.5 mr-1.5" />
                                    Download PDF
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {!showAtsDashboard && (
                        <div className="xl:hidden max-w-[1480px] mx-auto px-3 sm:px-5 md:px-8 pt-5 print:hidden">
                            <div className="grid grid-cols-2 rounded-2xl border border-slate-200 bg-white p-1 shadow-glass">
                                <button
                                    type="button"
                                    onClick={() => setMobileEditorView('form')}
                                    className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${mobileEditorView === 'form' ? 'bg-[#6D5DF6] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Form
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMobileEditorView('preview')}
                                    className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${mobileEditorView === 'preview' ? 'bg-[#6D5DF6] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Preview
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="max-w-[1480px] mx-auto px-3 sm:px-5 md:px-8 pt-6 md:pt-8 pb-8 grid grid-cols-1 xl:grid-cols-[minmax(360px,480px)_minmax(0,1fr)] gap-6 md:gap-8 print:block print:p-0 items-stretch">
                        {showAtsDashboard ? (
                            <div className="col-span-1 xl:col-span-2">
                                <AtsDashboard
                                    analysis={atsAnalysisData}
                                    isLoading={isAnalyzingAts}
                                    isImproving={isImprovingAts}
                                    onAnalyze={(jobDescription, selectedKeywords = []) => {
                                        setForm(prev => ({ ...prev, jobDescription }));
                                        const freshForm = { ...form, jobDescription };
                                        const freshData = buildResumeData(freshForm);
                                        setResumeData(freshData);
                                        runAtsScan(jobDescription, freshData, selectedKeywords);
                                    }}
                                    onImprove={handleAutoImprove}
                                    onBack={() => setShowAtsDashboard(false)}
                                    onAddKeywords={handleAddKeywords}
                                />
                            </div>
                        ) : (
                            <>
                                {/* ── FORM PANEL ── */}
                                <div className={`print:hidden flex-col xl:sticky xl:top-20 xl:max-h-[calc(100vh-80px)] xl:overflow-y-auto ${mobileEditorView === 'form' ? 'flex' : 'hidden'} xl:flex`}>
                                    <div className="flex-grow space-y-4 pb-4 premium-scroll xl:overflow-y-auto">
                                    {/* ATS score + header */}
                                    <div className="bg-white border border-[#f1f5f9] rounded-3xl p-6 shadow-glass flex items-center justify-between gap-4 mb-4">
                                        <div className="text-left">
                                            <div className="text-[#6D5DF6] text-[10px] tracking-widest font-extrabold uppercase mb-1 font-display">Resume Builder</div>
                                            <h2 className="font-display font-extrabold text-2xl text-[#0F172A]">Fill your details</h2>
                                            <p className="text-xs text-[#64748B] mt-1 font-light">All fields optional — fill what applies to you.</p>
                                        </div>
                                        <div
                                            className="text-center min-w-[80px] bg-slate-50 border border-slate-100 rounded-2xl p-3 shadow-xs cursor-pointer hover:bg-[#6D5DF6]/5 transition-colors"
                                            onClick={() => {
                                                // Sync resumeData from form before scanning so the
                                                // score reflects the latest form input even if the
                                                // user hasn't clicked "Update Resume" yet.
                                                const freshData = buildResumeData(form);
                                                setResumeData(freshData);
                                                setShowAtsDashboard(true);
                                                runAtsScan('', freshData);
                                            }}
                                            title="Click to run full ATS analysis"
                                        >
                                            <div className={`text-3xl font-black font-display ${atsAnalysisData ? (
                                                atsAnalysisData.overallScore >= 80 ? 'text-emerald-500' :
                                                    atsAnalysisData.overallScore >= 60 ? 'text-amber-500' : 'text-red-500'
                                            ) : 'text-[#6D5DF6]'
                                                }`}>
                                                {atsAnalysisData ? atsAnalysisData.overallScore : '—'}
                                            </div>
                                            <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400">ATS Score</div>
                                        </div>
                                    </div>

                                    {/* Personal Information */}
                                    <Section title="Personal Information" icon={<User className="w-4.5 h-4.5" />} defaultOpen>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div className="col-span-2">
                                                <Label>Full Name</Label>
                                                <Input placeholder="Jane Smith" value={form.fullName} onChange={set('fullName')} />
                                            </div>
                                            <div>
                                                <Label>Email</Label>
                                                <Input type="email" placeholder="jane@email.com" value={form.email} onChange={set('email')} />
                                            </div>
                                            <div>
                                                <Label>Phone</Label>
                                                <Input placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} />
                                            </div>
                                            <div className="col-span-2">
                                                <Label>Location</Label>
                                                <Input placeholder="City, State" value={form.location} onChange={set('location')} />
                                            </div>
                                            <div>
                                                <Label>LinkedIn</Label>
                                                <Input placeholder="linkedin.com/in/yourname" value={form.linkedin} onChange={set('linkedin')} />
                                            </div>
                                            <div>
                                                <Label>GitHub / Portfolio</Label>
                                                <Input placeholder="github.com/yourname" value={form.github} onChange={set('github')} />
                                            </div>
                                            <div className="col-span-2">
                                                <Label>Personal Website</Label>
                                                <Input placeholder="yoursite.com" value={form.website} onChange={set('website')} />
                                            </div>
                                        </div>
                                    </Section>

                                    {/* Professional Summary */}
                                    <Section
                                        title="Professional Summary"
                                        icon={<FileText className="w-4.5 h-4.5" />}
                                        defaultOpen
                                        onImprove={() => improveSection("summary")}
                                        isImproving={improvingSection === "summary"}
                                    >
                                        <div className="space-y-5">
                                            <div>
                                                <h3 className="text-sm font-bold text-[#0F172A]">Professional Summary</h3>
                                                <p className="mt-1 text-xs leading-relaxed text-[#64748B] font-light">
                                                    Write a concise overview highlighting your experience, achievements, and core strengths. Keep it ATS-friendly and results-focused.
                                                </p>
                                            </div>

                                            <div>
                                                <Label hint="This helps AI optimize your summary for the desired role.">Target Job Title</Label>
                                                <Input
                                                    placeholder="e.g. Senior MERN Stack Developer"
                                                    value={form.targetRole}
                                                    onChange={set("targetRole")}
                                                />
                                            </div>

                                            <div>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <Label hint="2–4 sentences focused on measurable impact.">Summary / Objective</Label>
                                                    <span className="text-[10px] text-slate-400 font-bold">
                                                        {form.summary.length}/400
                                                    </span>
                                                </div>
                                                <Textarea
                                                    rows={6}
                                                    placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications..."
                                                    value={form.summary}
                                                    onChange={set("summary")}
                                                />
                                            </div>

                                            <div className="rounded-2xl border border-slate-100 bg-[#FAFAFC] p-4.5 text-left">
                                                <div className="mb-2 text-xs font-bold text-[#6D5DF6]">ATS Optimization Tips</div>
                                                <ul className="space-y-1 text-[11px] leading-relaxed text-[#64748B] font-light">
                                                    <li>• Include years of experience</li>
                                                    <li>• Mention measurable achievements</li>
                                                    <li>• Use role-specific keywords</li>
                                                    <li>• Avoid generic buzzwords</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </Section>

                                    {/* Work Experience */}
                                    <Section
                                        title="Work Experience"
                                        icon={<Briefcase className="w-4.5 h-4.5" />}
                                        defaultOpen
                                        showImproveButton
                                        onImprove={() => improveSection("experience")}
                                        isImproving={improvingSection === "experience"}
                                    >
                                        <Label hint="One block per job, separated by a blank line. Format: Title | Company | Location | Dates, then bullet points starting with -">Experience</Label>
                                        <Textarea
                                            rows={10}
                                            placeholder={`Software Engineer | Acme Corp | New York, NY | Jan 2022 - Present\n- Built REST APIs serving 1M+ requests/day\n- Reduced page load time by 40% through lazy loading\n\nJunior Developer | Startup Inc | Remote | Jun 2020 - Dec 2021\n- Developed React dashboard used by 5,000 customers`}
                                            value={form.experience}
                                            onChange={set('experience')}
                                        />
                                    </Section>

                                    {/* Education */}
                                    <Section
                                        title="Education"
                                        icon={<GraduationCap className="w-4.5 h-4.5" />}
                                        defaultOpen
                                        showImproveButton
                                        onImprove={() => improveSection("education")}
                                        isImproving={improvingSection === "education"}
                                    >
                                        <Label hint="One line per degree: Degree | School | Years | GPA or Honors (optional)">Education</Label>
                                        <Textarea
                                            rows={4}
                                            placeholder={`B.S. Computer Science | MIT | 2018 - 2022 | GPA 3.9\nHigh School Diploma | Lincoln High | 2014 - 2018`}
                                            value={form.education}
                                            onChange={set('education')}
                                        />
                                    </Section>

                                    {/* Skills */}
                                    <Section
                                        title="Skills"
                                        icon={<Award className="w-4.5 h-4.5" />}
                                        defaultOpen
                                        showImproveButton
                                        onImprove={() => improveSection("skills")}
                                        isImproving={improvingSection === "skills"}
                                    >
                                        <Label hint="Comma-separated list. Include both technical and soft skills.">Skills</Label>
                                        <Textarea
                                            rows={4}
                                            placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, AWS, REST APIs, Agile, Communication, Problem Solving"
                                            value={form.skills}
                                            onChange={set('skills')}
                                        />
                                    </Section>

                                    {/* Projects */}
                                    <Section
                                        title="Projects"
                                        icon={<Layers className="w-4.5 h-4.5" />}
                                        defaultOpen={false}
                                        showImproveButton
                                        onImprove={() => improveSection("projects")}
                                        isImproving={improvingSection === "projects"}
                                    >
                                        <Label hint="One project per line: Name | Tech/Context | Description of impact">Projects</Label>
                                        <Textarea
                                            rows={5}
                                            placeholder={`E-Commerce Platform | React, Node.js, Stripe | Built full-stack store handling $50K/month in transactions\nML Price Predictor | Python, scikit-learn | Trained model with 92% accuracy on housing dataset`}
                                            value={form.projects}
                                            onChange={set('projects')}
                                        />
                                    </Section>

                                    {/* Certifications */}
                                    <Section
                                        title="Certifications & Licenses"
                                        icon={<ShieldCheck className="w-4.5 h-4.5" />}
                                        defaultOpen={false}
                                        showImproveButton
                                        onImprove={() => improveSection("certifications")}
                                        isImproving={improvingSection === "certifications"}
                                    >
                                        <Label hint="One per line: Name | Issuing Organization | Year">Certifications</Label>
                                        <Textarea
                                            rows={4}
                                            placeholder={`AWS Solutions Architect – Associate | Amazon Web Services | 2023\nCertified Kubernetes Administrator | CNCF | 2022`}
                                            value={form.certifications}
                                            onChange={set('certifications')}
                                        />
                                    </Section>

                                    {/* Languages */}
                                    <Section title="Languages" icon={<Globe className="w-4.5 h-4.5" />} defaultOpen={false}>
                                        <Label hint="Comma-separated, include proficiency level">Languages</Label>
                                        <Input
                                            placeholder="English (Native), Spanish (Fluent), French (Basic)"
                                            value={form.languages}
                                            onChange={set('languages')}
                                        />
                                    </Section>

                                    {/* Awards & Honors */}
                                    <Section
                                        title="Awards & Honors"
                                        icon={<Star className="w-4.5 h-4.5" />}
                                        defaultOpen={false}
                                        showImproveButton
                                        onImprove={() => improveSection("awards")}
                                        isImproving={improvingSection === "awards"}
                                    >
                                        <Label hint="One per line: Award Name | Organization | Year">Awards</Label>
                                        <Textarea
                                            rows={3}
                                            placeholder={`Dean's List | UC Berkeley | 2020, 2021\nHackathon Winner | TechCrunch Disrupt | 2022`}
                                            value={form.awards}
                                            onChange={set('awards')}
                                        />
                                    </Section>

                                    {/* Volunteer Work */}
                                    <Section
                                        title="Volunteer Work"
                                        icon={<User className="w-4.5 h-4.5" />}
                                        defaultOpen={false}
                                        showImproveButton
                                        onImprove={() => improveSection("volunteerWork")}
                                        isImproving={improvingSection === "volunteerWork"}
                                    >
                                        <Label hint="One per line: Role | Organization | Description">Volunteer Work</Label>
                                        <Textarea
                                            rows={3}
                                            placeholder={`Tech Mentor | Code for America | Coached 20 students through web dev curriculum`}
                                            value={form.volunteerWork}
                                            onChange={set('volunteerWork')}
                                        />
                                    </Section>

                                    {/* Publications */}
                                    <Section
                                        title="Publications & Research"
                                        icon={<BookOpen className="w-4.5 h-4.5" />}
                                        defaultOpen={false}
                                        showImproveButton
                                        onImprove={() => improveSection("publications")}
                                        isImproving={improvingSection === "publications"}
                                    >
                                        <Label hint="One per line: Title | Journal/Conference | Year">Publications</Label>
                                        <Textarea
                                            rows={3}
                                            placeholder={`Efficient Transformer Pruning | NeurIPS Workshop | 2023\nIntro to WebAssembly | Smashing Magazine | 2022`}
                                            value={form.publications}
                                            onChange={set('publications')}
                                        />
                                    </Section>

                                    {/* Update Button */}
                                    <div className="pt-2">
                                        <Button
                                            variant="purple"
                                            className="w-full text-sm font-semibold rounded-2xl shadow-md py-6 bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] hover:shadow-[#6D5DF6]/15"
                                            onClick={fillTemplate}
                                        >
                                            <Sparkles className="w-4 h-4 fill-current" />
                                            Update Resume Preview
                                        </Button>
                                    </div>
                                    </div>
                                </div>

                                {/* ── PREVIEW PANEL ── */}
                                <div
                                    ref={pagination.measureRef}
                                    aria-hidden="true"
                                    style={{
                                        position: 'fixed',
                                        left: '-10000px',
                                        top: 0,
                                        width: '794px',
                                        height: 'auto',
                                        visibility: 'hidden',
                                        pointerEvents: 'none',
                                        zIndex: -1,
                                        overflow: 'visible',
                                    }}
                                >
                                    {activeTemplate.render(resumeData)}
                                </div>
                                <div className={`${mobileEditorView === 'preview' ? 'flex' : 'hidden'} xl:flex justify-center print:block w-full min-w-0`} ref={previewParentRef}>
                                    <div
                                        className="print:w-full"
                                        style={{
                                            width: `${794 * previewScale}px`,
                                            height: `${totalPages * 1123 * previewScale}px`,
                                            position: 'relative',
                                            transition: 'width 0.15s ease, height 0.15s ease'
                                        }}
                                    >
                                        <div
                                            ref={resumeRef}
                                            className="resume-print-wrapper"
                                            style={{
                                                width: '794px',
                                                background: 'white',
                                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1), 0 30px 80px -10px rgba(109,93,246,0.12)',
                                                borderRadius: '6px',
                                                border: '1px solid #f1f5f9',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                transform: `scale(${previewScale})`,
                                                transformOrigin: 'top left',
                                                transition: 'transform 0.15s ease'
                                            }}
                                        >
                                            <ResumeDocument>
                                                {(() => {
                                                    const pagesToRender = pagination.isReady && pagination.pages.length > 0
                                                        ? pagination.pages
                                                        : pagination.stablePages.current.length > 0
                                                            ? pagination.stablePages.current
                                                            : [{ sidebarBlockKeys: [], mainBlockKeys: [], continuedSectionIds: [] }];
                                                    return pagesToRender.map((page, pageIndex) => {
                                                        const visibleBlockKeys = page.mainBlockKeys.length || page.sidebarBlockKeys.length
                                                            ? new Set([...page.sidebarBlockKeys, ...page.mainBlockKeys])
                                                            : undefined;
                                                        return (
                                                            <ResumePage key={pageIndex} pageIndex={pageIndex} debugData={page.debugData}>
                                                                {activeTemplate.render(resumeData, {
                                                                    visibleBlockKeys,
                                                                    pageIndex,
                                                                    sidebarMode: isTwoColumnTemplate ? 'repeat' : 'first-page-only',
                                                                    showContinuationLabels: true,
                                                                    continuedSectionIds: new Set(page.continuedSectionIds),
                                                                })}
                                                            </ResumePage>
                                                        );
                                                    });
                                                })()}
                                            </ResumeDocument>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>


            </>
        );
    }

    return (
        <>
            <Notification notification={notification} />
            {FeedbackModal}
            <div className="bg-[#FAFAFC] min-h-screen text-[#0F172A] pt-28 md:pt-32 pb-20 md:pb-24 overflow-x-hidden font-sans">
                <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-12 text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] mb-6">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-[10px] tracking-widest uppercase font-extrabold font-display">
                            PROFILLO ATS TEMPLATE LIBRARY
                        </span>
                    </div>
                    <h1 className="font-display font-extrabold liquid-heading-lg mb-6 text-[#0F172A] ">
                        Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D5DF6] via-[#8B7CF8] to-[#ec4899] ">template</span>
                    </h1>
                    <p className="text-base text-[#64748B] max-w-xl mx-auto leading-relaxed font-light mb-8">
                        Pick a layout design, fill in your details, and export an ATS-optimized, high-fidelity PDF instantly.
                    </p>
                    <div className="flex items-center justify-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                        <p   className="text-xs font-bold text-left text-[#0F172A] ml-2">Trusted by 10,000+ Job Seekers<br />
                            <span className='font-normal'>okay, we're working on it — but you could be #1</span></p>
                    </div>
                    {user && (
                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm">
                            <Crown className="h-4 w-4 text-[#6D5DF6]" />
                            {user.role === 'ADMIN' ? 'Admin access: all templates unlocked' : `${user.planType} plan`}
                        </div>
                    )}
                </div>

                {/* AI Recommendation Widget */}
                <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-10 mb-12 md:mb-16">
                    <div className="bg-white rounded-3xl p-2 shadow-glass border border-[#f1f5f9] flex flex-col sm:flex-row items-center gap-2">
                        <div className="flex-1 flex items-center gap-3 px-4 w-full">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="What's your target job role? (e.g. Frontend Developer)"
                                className="w-full py-3 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none bg-transparent font-sans"
                                value={searchRole}
                                onChange={(e) => setSearchRole(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-10 mb-10 md:mb-12">
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        {['All Templates', 'Developers', 'Students', 'Startup', 'Leadership', 'Career Switch', 'Executive'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${selectedCategory === cat
                                    ? 'bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] text-white shadow-md shadow-[#6D5DF6]/20'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-[#6D5DF6]/30 hover:bg-slate-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gallery */}
                <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredTemplates.map((tpl, idx) => {
                        const locked = isTemplatePremium(tpl.id) && !canUsePremiumTemplates;
                        return (
                                <motion.div
                                    key={tpl.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.03 }}
                                    className={`bg-white border border-[#f1f5f9] rounded-[2rem] overflow-hidden shadow-glass hover:shadow-premium hover:border-[#6D5DF6]/30 transition-all duration-400 cursor-pointer group flex flex-col relative ${locked ? 'opacity-90' : ''}`}
                                    onClick={() => openTemplate(tpl.id)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#6D5DF6]/0 to-[#6D5DF6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none z-10" />
                                    {locked && (
                                        <div className="absolute right-4 top-4 z-30 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] text-white shadow-md shadow-[#6D5DF6]/20 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                                            <Gem className="h-3.5 w-3.5" />
                                            Pro
                                        </div>
                                    )}

                                    <div
                                        className="h-[260px] sm:h-[310px] overflow-hidden relative bg-[#F8F9FC] border-b border-[#f1f5f9] card-preview"
                                        ref={el => {
                                            thumbContainerRefs.current[tpl.id] = el;
                                        }}
                                    >
                                        <div
                                            className="absolute top-0 left-0 pointer-events-none thumb-wrap bg-white"
                                            style={{ width: '794px', transformOrigin: 'top left' }}
                                        >
                                            {tpl.render()}
                                        </div>
                                    </div>

                                    <div className="p-7 flex flex-col flex-grow text-left relative z-20">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full bg-[#6D5DF6]/8 text-[#6D5DF6] font-bold">
                                                {tpl.badge}
                                            </span>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">ATS Optimized</span>
                                            </div>
                                        </div>

                                        <div className="font-display font-extrabold text-xl mb-1.5 text-[#0F172A] group-hover:text-[#6D5DF6] transition-colors duration-300">{tpl.name}</div>

                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {tpl.bestFor.map(tag => (
                                                <span key={tag} className="text-[9px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="text-xs text-[#64748B] leading-relaxed mb-6 flex-grow font-light">{tpl.desc}</div>

                                        <Button
                                            variant="purple"
                                            className="w-full text-xs font-bold rounded-xl mt-auto shadow-sm group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-300"
                                        >
                                            {locked ? (
                                                <>
                                                    Unlock Template
                                                    <Lock className="w-4 h-4 ml-1.5" />
                                                </>
                                            ) : (
                                                <>
                                                    Use Template
                                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            );
                    })}
                </div>

                {/* Bottom CTA Section */}
                <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-10 mt-16 md:mt-24 text-center pb-12">
                    <div className="bg-white border-2 border-[#6D5DF6]/50 rounded-[2.5rem] liquid-card relative overflow-hidden shadow-2xl shadow-[#6D5DF6]/20">
                        {/* decorative background blur */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#6D5DF6] rounded-full mix-blend-multiply filter blur-[80px] opacity-10"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#ec4899] rounded-full mix-blend-multiply filter blur-[80px] opacity-10"></div>

                        <div className="relative z-10">
                            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#0F172A] mb-4">
                                Not sure which to choose?
                            </h2>
                            <p className="text-slate-500 font-light text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
                                Start with the Developer ATS template. It's our highest converting layout and works perfectly for 90% of technical roles.
                            </p>
                            <Button
                                variant="purple"
                                className="h-12 px-8 rounded-2xl bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] hover:shadow-[0_0_20px_rgba(109,93,246,0.4)] text-white font-bold text-sm transition-all duration-300 cursor-pointer"
                                onClick={() => {
                                    openTemplate(1);
                                }}
                            >
                                Start with Developer ATS
                            </Button>
                        </div>
                    </div>
                </div>

                <Button
                    variant="purple"
                    size="icon"
                    className="fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full shadow-xl print:hidden"
                    onClick={() => setFeedbackOpen(true)}
                    title="Send feedback"
                    aria-label="Send feedback"
                >
                    <MessageSquare className="h-5 w-5" />
                </Button>
            </div>
        </>
    );
};

export default TemplateGallery;
