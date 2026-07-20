import React from 'react';
import './TemplateStyles.css';
import type { ResumeData } from '../types/resume';
import { defaultResumeData } from '../types/resume';

type SharpExecutiveProps = {
    data?: ResumeData;
    visibleBlockKeys?: Set<string>;
    pageIndex?: number;
    showContinuationLabels?: boolean;
    continuedSectionIds?: Set<string>;
};

const SharpExecutive: React.FC<SharpExecutiveProps> = ({
    data = defaultResumeData,
    visibleBlockKeys,
    showContinuationLabels = true,
    continuedSectionIds,
}) => {
    const contacts = [data.email, data.phone, data.location, ...data.links]
        .filter(Boolean)
        .filter((item, index, arr) => arr.indexOf(item) === index); // deduplicate

    const shouldRender = (key: string) => {
        if (!visibleBlockKeys) return true;
        return visibleBlockKeys.has(key);
    };

    const getTitle = (sectionId: string, defaultTitle: string) => {
        if (continuedSectionIds?.has(sectionId) && showContinuationLabels) {
            return `${defaultTitle} (Continued)`;
        }
        return defaultTitle;
    };

    const accentColor = '#2563eb'; // Royal Blue Accent

    const sectionTitleStyle: React.CSSProperties = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '9pt',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#0f172a',
        borderLeft: `4px solid ${accentColor}`,
        paddingLeft: '10px',
        marginTop: '16px',
        marginBottom: '10px',
    };

    const jobTitleStyle: React.CSSProperties = {
        fontWeight: 700,
        fontSize: '9.5pt',
        color: '#0f172a',
        fontFamily: 'Arial, sans-serif',
    };

    const textStyle: React.CSSProperties = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '9pt',
        lineHeight: 1.45,
        color: '#334155',
    };

    return (
        <div 
            style={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: '9.5pt',
                lineHeight: 1.5,
                color: '#1e293b',
                backgroundColor: '#fff',
                width: '794px',
                height: '1122px', 
                padding: '44px 52px', 
                boxSizing: 'border-box', 
                overflowWrap: 'break-word',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header */}
            {shouldRender('header') && (
                <div data-block-key="header" data-section-id="header" data-column="main" style={{ marginBottom: '14px' }}>
                    <div 
                        style={{ fontSize: '28pt', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '4px' }}
                        contentEditable 
                        suppressContentEditableWarning
                    >
                        {data.fullName}
                    </div>
                    {data.headline && (
                        <div 
                            style={{ fontSize: '10.5pt', fontWeight: 600, color: accentColor, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {data.headline}
                        </div>
                    )}
                    <div 
                        style={{ 
                            fontSize: '8.5pt', 
                            color: '#64748b', 
                            display: 'flex', 
                            gap: '12px', 
                            flexWrap: 'wrap',
                            fontWeight: 500,
                        }}
                    >
                        {contacts.map((item, idx) => (
                            <React.Fragment key={item}>
                                {idx > 0 && <span style={{ color: '#cbd5e1' }}>|</span>}
                                <span contentEditable suppressContentEditableWarning>{item}</span>
                            </React.Fragment>
                        ))}
                    </div>
                    <div style={{ borderBottom: '2.5px solid #0f172a', marginTop: '12px', width: '100%' }} />
                </div>
            )}

            {/* Summary */}
            {data.summary && shouldRender('summary') && (
                <div style={{ marginBottom: '14px' }}>
                    {shouldRender('summary-title') && (
                        <div 
                            style={sectionTitleStyle}
                            data-section-title="true" 
                            data-section-id="summary" 
                            data-column="main"
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {getTitle('summary', 'Executive Summary')}
                        </div>
                    )}
                    <div 
                        data-block-key="summary" 
                        data-section-id="summary" 
                        data-column="main"
                        style={textStyle}
                        contentEditable 
                        suppressContentEditableWarning
                    >
                        {data.summary}
                    </div>
                </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                    {shouldRender('experience-title') && (
                        <div 
                            style={sectionTitleStyle}
                            data-section-title="true" 
                            data-section-id="experience" 
                            data-column="main"
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {getTitle('experience', 'Professional Experience')}
                        </div>
                    )}
                    {data.experience.map((job, index) => {
                        const blockKey = `experience-${index}`;
                        const headerKey = `${blockKey}-header`;
                        const isHeaderVisible = shouldRender(headerKey);
                        const visibleBullets = job.bullets.filter((_, bi) => shouldRender(`${blockKey}-bullet-${bi}`));

                        if (!isHeaderVisible && visibleBullets.length === 0) return null;

                        return (
                            <div key={index} style={{ marginBottom: '12px' }}>
                                {isHeaderVisible ? (
                                    <div data-block-key={headerKey} data-section-id="experience" data-column="main">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                            <span style={jobTitleStyle} contentEditable suppressContentEditableWarning>{job.title}</span>
                                            <span style={{ fontSize: '8.5pt', fontWeight: 'bold', color: '#64748b' }} contentEditable suppressContentEditableWarning>{job.dates}</span>
                                        </div>
                                        <div style={{ fontSize: '8.5pt', marginBottom: '4px' }}>
                                            <strong style={{ color: accentColor, fontWeight: 700 }} contentEditable suppressContentEditableWarning>{job.company}</strong>
                                            {job.location && <span style={{ color: '#64748b' }} contentEditable suppressContentEditableWarning>{` — ${job.location}`}</span>}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#64748b', marginBottom: '4px' }}>
                                        {job.company} (Continued)
                                    </div>
                                )}

                                {visibleBullets.length > 0 && (
                                    <ul style={{ paddingLeft: '14px', margin: '0', listStyleType: 'disc' }}>
                                        {job.bullets.map((bullet, bi) => {
                                            const bulletKey = `${blockKey}-bullet-${bi}`;
                                            if (!shouldRender(bulletKey)) return null;
                                            return (
                                                <li 
                                                    key={bi} 
                                                    data-block-key={bulletKey} 
                                                    data-section-id="experience" 
                                                    data-column="main"
                                                    style={{ ...textStyle, marginBottom: '2px' }}
                                                    contentEditable 
                                                    suppressContentEditableWarning
                                                >
                                                    {bullet}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                    {shouldRender('projects-title') && (
                        <div 
                            style={sectionTitleStyle}
                            data-section-title="true" 
                            data-section-id="projects" 
                            data-column="main"
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {getTitle('projects', 'Key Projects')}
                        </div>
                    )}
                    {data.projects.map((project, index) => {
                        const blockKey = `projects-${index}`;
                        const headerKey = `${blockKey}-header`;
                        const isHeaderVisible = shouldRender(headerKey);
                        const visibleBullets = project.bullets.filter((_, bi) => shouldRender(`${blockKey}-bullet-${bi}`));

                        if (!isHeaderVisible && visibleBullets.length === 0) return null;

                        return (
                            <div key={index} style={{ marginBottom: '12px' }}>
                                {isHeaderVisible ? (
                                    <div data-block-key={headerKey} data-section-id="projects" data-column="main">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                            <span style={jobTitleStyle} contentEditable suppressContentEditableWarning>{project.name}</span>
                                        </div>
                                        {project.meta && (
                                            <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#64748b', marginBottom: '4px' }} contentEditable suppressContentEditableWarning>
                                                {project.meta}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#64748b', marginBottom: '4px' }}>
                                        {project.name} (Continued)
                                    </div>
                                )}

                                {visibleBullets.length > 0 && (
                                    <ul style={{ paddingLeft: '14px', margin: '0', listStyleType: 'disc' }}>
                                        {project.bullets.map((bullet, bi) => {
                                            const bulletKey = `${blockKey}-bullet-${bi}`;
                                            if (!shouldRender(bulletKey)) return null;
                                            return (
                                                <li 
                                                    key={bi} 
                                                    data-block-key={bulletKey} 
                                                    data-section-id="projects" 
                                                    data-column="main"
                                                    style={{ ...textStyle, marginBottom: '2px' }}
                                                    contentEditable 
                                                    suppressContentEditableWarning
                                                >
                                                    {bullet}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                    {shouldRender('skills-title') && (
                        <div 
                            style={sectionTitleStyle}
                            data-section-title="true" 
                            data-section-id="skills" 
                            data-column="main"
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {getTitle('skills', 'Core Competencies')}
                        </div>
                    )}
                    {shouldRender('skills') && (
                        <div 
                            data-block-key="skills" 
                            data-section-id="skills" 
                            data-column="main"
                            style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: '8px', 
                                marginTop: '4px'
                            }}
                        >
                            {data.skills.map((skill) => (
                                <span 
                                    key={skill} 
                                    style={{ 
                                        fontSize: '8.5pt', 
                                        color: '#0f172a', 
                                        backgroundColor: '#eff6ff',
                                        border: `1.5px solid #dbeafe`,
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontWeight: 600
                                    }}
                                    contentEditable 
                                    suppressContentEditableWarning
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                    {shouldRender('education-title') && (
                        <div 
                            style={sectionTitleStyle}
                            data-section-title="true" 
                            data-section-id="education" 
                            data-column="main"
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {getTitle('education', 'Education')}
                        </div>
                    )}
                    {data.education.map((edu, index) => {
                        const blockKey = `education-${index}`;
                        if (!shouldRender(blockKey)) return null;
                        return (
                            <div 
                                key={index} 
                                data-block-key={blockKey} 
                                data-section-id="education" 
                                data-column="main"
                                style={{ marginBottom: '8px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <span style={{ fontWeight: 700, fontSize: '9.5pt', color: '#0f172a' }} contentEditable suppressContentEditableWarning>{edu.degree}</span>
                                    <span style={{ fontSize: '8.5pt', color: '#64748b' }} contentEditable suppressContentEditableWarning>{edu.dates}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', fontSize: '9pt', color: accentColor, fontWeight: 500 }}>
                                    <span contentEditable suppressContentEditableWarning>{edu.school}</span>
                                    {edu.details && <span style={{ color: '#64748b' }} contentEditable suppressContentEditableWarning>{` — ${edu.details}`}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Certifications & Languages Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Certifications */}
                {data.certifications.length > 0 && (
                    <div>
                        {shouldRender('certifications-title') && (
                            <div 
                                style={{ ...sectionTitleStyle, borderLeft: `3px solid ${accentColor}`, paddingLeft: '8px', marginTop: '4px' }}
                                data-section-title="true" 
                                data-section-id="certifications" 
                                data-column="main"
                                contentEditable 
                                suppressContentEditableWarning
                            >
                                {getTitle('certifications', 'Certifications')}
                            </div>
                        )}
                        {data.certifications.map((cert, index) => {
                            const blockKey = `certifications-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div 
                                    key={index} 
                                    data-block-key={blockKey} 
                                    data-section-id="certifications" 
                                    data-column="main"
                                    style={{ fontSize: '8.5pt', color: '#334155', marginBottom: '4px' }}
                                    contentEditable 
                                    suppressContentEditableWarning
                                >
                                    {cert}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Languages */}
                {data.languages.length > 0 && (
                    <div>
                        {shouldRender('languages-title') && (
                            <div 
                                style={{ ...sectionTitleStyle, borderLeft: `3px solid ${accentColor}`, paddingLeft: '8px', marginTop: '4px' }}
                                data-section-title="true" 
                                data-section-id="languages" 
                                data-column="main"
                                contentEditable 
                                suppressContentEditableWarning
                            >
                                {getTitle('languages', 'Languages')}
                            </div>
                        )}
                        {shouldRender('languages') && (
                            <div 
                                data-block-key="languages" 
                                data-section-id="languages" 
                                data-column="main"
                                style={{ fontSize: '8.5pt', color: '#334155' }}
                                contentEditable 
                                suppressContentEditableWarning
                            >
                                {data.languages.join(' · ')}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Awards */}
            {(() => {
                const hasVisibleAwards = data.awards.some((_, i) => shouldRender(`awards-${i}`));
                const hasTitle = shouldRender('awards-title');
                if (!hasVisibleAwards) return null;
                return (
                    <div style={{ marginTop: '12px' }}>
                        {hasTitle && (
                            <div 
                                style={sectionTitleStyle}
                                data-section-title="true" 
                                data-section-id="awards" 
                                data-column="main"
                                contentEditable 
                                suppressContentEditableWarning
                            >
                                {getTitle('awards', 'Key Honors')}
                            </div>
                        )}
                        {data.awards.map((award, index) => {
                            const blockKey = `awards-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div 
                                    key={index} 
                                    data-block-key={blockKey} 
                                    data-section-id="awards" 
                                    data-column="main"
                                    style={{ marginBottom: '6px' }}
                                >
                                    <strong style={{ fontSize: '9pt', color: '#0f172a' }} contentEditable suppressContentEditableWarning>{award.name}</strong>
                                    {award.meta && <span style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#64748b', marginLeft: '6px' }} contentEditable suppressContentEditableWarning>{award.meta}</span>}
                                </div>
                            );
                        })}
                    </div>
                );
            })()}
        </div>
    );
};

export default SharpExecutive;
