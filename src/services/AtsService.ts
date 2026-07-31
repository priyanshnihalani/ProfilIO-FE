import { post } from "./ApiService.tsx";
import type { ResumeData } from "../types/resume";
import { resumeToText } from "../pages/Template.tsx";

export interface AtsScoreBreakdown {
    keywordScore: number;
    structureScore: number;
    experienceScore: number;
    skillsScore: number;
    formattingScore: number;
    templateScore: number;
}

// types/AtsService.ts or wherever AtsAnalysisResult is defined
export type AtsAnalysisResult = {
    overallScore: number;
    tier: string;
    targetRole: string;
    scoredAt: string;

    dimensionScores: {
        keywordRelevance: number;
        formatParsability: number;
        impactLanguage: number;
        sectionCompleteness: number;
        roleAlignment: number;
        contactInfo: number;
        readability: number;
        atsAntiPatterns: number;
        enterpriseImpact?: number;
    };

    recommendations: Array<{
        priority: "critical" | "high" | "medium" | "low";
        dimension: string;
        issue: string;
        fix: string;
        impact: string;
        estimatedScoreGain?: number;
    }>;

    details: {
        keyword: {
            missing_keywords: string[];
            matched_keywords: string[];
            supported_keywords?: string[];
            unsupported_skill_keywords?: string[];
            keyword_stuffing_detected: boolean;
        };
        impact: { weak_phrases_found: string[]; quantified_bullet_count: number; total_bullet_count: number };
        completeness: { missing_sections: string[] };
        alignment: {
            inferred_seniority_level: string;
            alignment_gaps: string[];
            alignment_strengths: string[];
            unsupported_skill_matches?: string[];
        };
        sectionScores?: Array<{
            key: string;
            label: string;
            score: number;
            wordCount: number;
            bulletCount: number;
            notes: string[];
        }>;
        parserSimulation?: {
            name: string | null;
            email: string | null;
            phone: string | null;
            location: string | null;
            linkedin: string | null;
            sectionsDetected: string[];
            missingSections: string[];
            companiesOrRoles: string[];
            dates: string[];
        };
        lineLevelIssues?: Array<{
            line: number | null;
            section: string;
            severity: "critical" | "high" | "medium" | "low";
            issue: string;
            fix: string;
            evidence: string | null;
        }>;
        keywordEvidence?: Array<{
            keyword: string;
            status: "found" | "missing";
            line: number | null;
            evidence: string | null;
        }>;
    };
};

export const analyzeResumeForAts = async (
    resumeData: ResumeData,
    jobDescription: string,
    targetRole: string,
    isTwoColumn: boolean = false,
    selectedMissingKeywords: string[] = []
): Promise<AtsAnalysisResult> => {
    const resumeText = resumeToText(resumeData);

    const response = await post("resume/score", {
        resumeText,
        targetRole,
        jobDescription,
        templateMetadata: { isTwoColumn },
        selectedMissingKeywords,
    });
    if (!response.data?.success || !response.data?.data) throw new Error("ATS analysis returned an invalid response.");
    return response.data.data;
};


export const autoImproveResume = async (
    resumeData: ResumeData,
    missingKeywords: string[],
    recommendedSkills: string[]
): Promise<any> => {
    try {
        const response = await post("ats/auto-improve", {
            resumeData,
            missingKeywords,
            recommendedSkills
        });

        if (response?.data?.success) {
            return response.data.improvedData;
        }
        return null;
    } catch (error) {
        console.error("Failed to auto-improve resume:", error);
        return null;
    }
};
