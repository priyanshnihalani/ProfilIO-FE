import React from 'react';
import './TemplateStyles.css';
import type { ResumeData } from '../types/resume';
import { defaultResumeData } from '../types/resume';

type ModernBannerProps = {
    data?: ResumeData;
    visibleBlockKeys?: Set<string>;
    pageIndex?: number;
    showContinuationLabels?: boolean;
    continuedSectionIds?: Set<string>;
};

const ModernBanner: React.FC<ModernBannerProps> = ({
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

    const darkBlue = '#1e3a8a'; // Deep blue accent
    const bannerBg = '#eff6ff'; // Soft blue header banner
    const textColor = '#334155'; // Slate body text

    const sectionTitleStyle: React.CSSProperties = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '9.5pt',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: darkBlue,
        marginTop: '10px',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };

    const jobTitleStyle: React.CSSProperties = {
        fontWeight: 700,
        fontSize: '9.5pt',
        color: '#0f172a',
        fontFamily: 'Arial, sans-serif',
    };

    const textStyle: React.CSSProperties = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '8.2pt',
        lineHeight: 1.35,
        color: textColor,
    };

    return (
        <div 
            style={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: '9.5pt',
                lineHeight: 1.5,
                color: '#1f2937',
                backgroundColor: '#fff',
                width: '794px',
                height: '1122px', 
                boxSizing: 'border-box', 
                overflowWrap: 'break-word',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Soft Blue Banner (Only on page 0 or when header is visible) */}
            {shouldRender('header') && (
                <div 
                    data-block-key="header" 
                    data-section-id="header" 
                    data-column="main" 
                    style={{ 
                        backgroundColor: bannerBg, 
                        padding: '16px 48px 12px 48px',
                        textAlign: 'left',
                        boxSizing: 'border-box',
                        borderBottom: '1px solid #dbeafe'
                    }}
                >
                    <div 
                        style={{ fontSize: '24pt', fontWeight: 900, color: darkBlue, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2px' }}
                        contentEditable 
                        suppressContentEditableWarning
                    >
                        {data.fullName}
                    </div>
                    {data.headline && (
                        <div 
                            style={{ fontSize: '10pt', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {data.headline}
                        </div>
                    )}
                    {data.summary && shouldRender('summary') && (
                        <div 
                            data-block-key="summary" 
                            data-section-id="summary" 
                            data-column="main"
                            style={{ ...textStyle, color: '#475569', fontSize: '8.5pt', marginBottom: '14px', lineHeight: 1.4 }}
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {data.summary}
                        </div>
                    )}
                    <div 
                        style={{ 
                            fontSize: '8pt', 
                            color: '#64748b', 
                            display: 'flex', 
                            gap: '12px', 
                            flexWrap: 'wrap',
                            fontWeight: 500
                        }}
                    >
                        {contacts.map((item, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && <span style={{ color: '#cbd5e1' }}>|</span>}
                                <span contentEditable suppressContentEditableWarning>{item}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content Body */}
            <div data-main="true" style={{ padding: '10px 48px 20px 48px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                
                {/* Core Competencies (Skills as rounded capsules) */}
                {data.skills.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
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
                                    gap: '6px', 
                                    marginTop: '4px'
                                }}
                            >
                                {data.skills.map((skill) => (
                                    <span 
                                        key={skill} 
                                        style={{ 
                                            fontSize: '8pt', 
                                            color: '#1e40af', 
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #bfdbfe',
                                            padding: '4px 12px',
                                            borderRadius: '6px',
                                            fontWeight: 500
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

                {/* Experience */}
                {data.experience.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
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
                                <div key={index} style={{ marginBottom: '8px' }}>
                                    {isHeaderVisible ? (
                                        <div data-block-key={headerKey} data-section-id="experience" data-column="main">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                                <span style={jobTitleStyle} contentEditable suppressContentEditableWarning>{job.title} — {job.company}</span>
                                                <span style={{ fontSize: '8pt', fontWeight: 'bold', color: '#64748b' }} contentEditable suppressContentEditableWarning>{job.dates}</span>
                                            </div>
                                            {job.location && (
                                                <div style={{ fontSize: '8pt', color: '#64748b', marginBottom: '4px' }} contentEditable suppressContentEditableWarning>
                                                    {job.location}
                                                </div>
                                            )}
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
                    <div style={{ marginBottom: '10px' }}>
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
                                <div key={index} style={{ marginBottom: '8px' }}>
                                    {isHeaderVisible ? (
                                        <div data-block-key={headerKey} data-section-id="projects" data-column="main">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                                <span style={jobTitleStyle} contentEditable suppressContentEditableWarning>{project.name}</span>
                                            </div>
                                            {project.meta && (
                                                <div style={{ fontStyle: 'italic', fontSize: '8pt', color: '#64748b', marginBottom: '4px' }} contentEditable suppressContentEditableWarning>
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {data.education.map((edu, index) => {
                                const blockKey = `education-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                return (
                                    <div 
                                        key={index} 
                                        data-block-key={blockKey} 
                                        data-section-id="education" 
                                        data-column="main"
                                        style={{ marginBottom: '6px' }}
                                    >
                                        <div style={{ fontWeight: 700, fontSize: '9pt', color: '#111827' }} contentEditable suppressContentEditableWarning>{edu.degree}</div>
                                        <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#4b5563' }}>
                                            <span contentEditable suppressContentEditableWarning>{edu.school}</span>
                                            {edu.details && <span style={{ color: '#6b7280' }} contentEditable suppressContentEditableWarning>{` — ${edu.details}`}</span>}
                                        </div>
                                        <div style={{ fontSize: '8pt', color: '#6b7280' }} contentEditable suppressContentEditableWarning>{edu.dates}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Certifications & Languages Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Certifications */}
                    {data.certifications.length > 0 && (
                        <div>
                            {shouldRender('certifications-title') && (
                                <div 
                                    style={{ ...sectionTitleStyle, marginTop: '8px' }}
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
                                        style={{ fontSize: '8.5pt', color: '#374151', marginBottom: '4px' }}
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
                                    style={{ ...sectionTitleStyle, marginTop: '8px' }}
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
                                    style={{ fontSize: '8.5pt', color: '#374151' }}
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
                                    {getTitle('awards', 'Honors & Awards')}
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
                                        <strong style={{ fontSize: '9pt', color: '#111827' }} contentEditable suppressContentEditableWarning>{award.name}</strong>
                                        {award.meta && <span style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#6b7280', marginLeft: '6px' }} contentEditable suppressContentEditableWarning>{award.meta}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default ModernBanner;
