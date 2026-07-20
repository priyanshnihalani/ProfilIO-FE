import React from 'react';
import './TemplateStyles.css';
import type { ResumeData } from '../types/resume';
import { defaultResumeData } from '../types/resume';

const SIDEBAR_W = 210;

type NavySidebarProps = {
    data?: ResumeData;
    visibleBlockKeys?: Set<string>;
    pageIndex?: number;
    sidebarMode?: 'first-page-only' | 'repeat';
    showContinuationLabels?: boolean;
    continuedSectionIds?: Set<string>;
};

const NavySidebar: React.FC<NavySidebarProps> = ({
    data = defaultResumeData,
    visibleBlockKeys,
    pageIndex = 0,
    sidebarMode = 'first-page-only',
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

    const showSidebarLayout = sidebarMode === 'repeat' || pageIndex === 0;

    const sidebarBg = '#1e293b'; // slate/dark navy
    const mainTitleColor = '#1e3a8a'; // rich navy

    const mainTitleStyle: React.CSSProperties = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10.5pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: mainTitleColor,
        borderBottom: `2px solid ${mainTitleColor}`,
        paddingBottom: '3px',
        marginBottom: '10px',
        marginTop: '14px',
    };

    const sidebarTitleStyle: React.CSSProperties = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '7.5pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#94a3b8',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        paddingBottom: '4px',
        marginBottom: '8px',
        marginTop: '16px',
    };

    const textStyle: React.CSSProperties = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '8.5pt',
        lineHeight: 1.45,
        color: '#475569',
    };

    const jobTitleStyle: React.CSSProperties = {
        fontWeight: 700,
        fontSize: '9pt',
        color: '#0f172a',
        fontFamily: 'Arial, sans-serif',
    };

    // ─── Continuation page (Single column layout) ───────────────────
    if (!showSidebarLayout) {
        return (
            <div
                style={{
                    width: '794px',
                    height: '1122px',
                    backgroundColor: '#ffffff',
                    padding: '48px 50px',
                    boxSizing: 'border-box',
                    overflowWrap: 'break-word',
                }}
            >
                {data.summary && shouldRender('summary') && (
                    <div style={{ marginBottom: '16px' }}>
                        {shouldRender('summary-title') && (
                            <div style={mainTitleStyle} data-section-title="true" data-section-id="summary" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('summary', 'Profile Summary')}
                            </div>
                        )}
                        <div data-block-key="summary" data-section-id="summary" data-column="main" style={textStyle} contentEditable suppressContentEditableWarning>
                            {data.summary}
                        </div>
                    </div>
                )}

                {data.experience.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        {shouldRender('experience-title') && (
                            <div style={mainTitleStyle} data-section-title="true" data-section-id="experience" data-column="main" contentEditable suppressContentEditableWarning>
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
                                                <span style={{ fontSize: '8pt', color: '#64748b' }} contentEditable suppressContentEditableWarning>{job.dates}</span>
                                            </div>
                                            <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#475569', marginBottom: '3px' }}>
                                                <strong style={{ color: mainTitleColor }} contentEditable suppressContentEditableWarning>{job.company}</strong>
                                                {job.location && <span contentEditable suppressContentEditableWarning>{` — ${job.location}`}</span>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#475569', marginBottom: '3px' }}>
                                            <strong style={{ color: mainTitleColor }}>{job.company}</strong> (Continued)
                                        </div>
                                    )}

                                    {visibleBullets.length > 0 && (
                                        <ul style={{ paddingLeft: '14px', margin: '0', listStyleType: 'disc' }}>
                                            {job.bullets.map((bullet, bi) => {
                                                const bulletKey = `${blockKey}-bullet-${bi}`;
                                                if (!shouldRender(bulletKey)) return null;
                                                return <li key={bi} data-block-key={bulletKey} data-section-id="experience" data-column="main" style={{ ...textStyle, marginBottom: '2px' }} contentEditable suppressContentEditableWarning>{bullet}</li>;
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.projects.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        {shouldRender('projects-title') && (
                            <div style={mainTitleStyle} data-section-title="true" data-section-id="projects" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('projects', 'Projects')}
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
                                            {project.meta && <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#475569', marginBottom: '3px' }} contentEditable suppressContentEditableWarning>{project.meta}</div>}
                                        </div>
                                    ) : (
                                        <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#475569', marginBottom: '3px' }}>
                                            <strong>{project.name}</strong> (Continued)
                                        </div>
                                    )}

                                    {visibleBullets.length > 0 && (
                                        <ul style={{ paddingLeft: '14px', margin: '0', listStyleType: 'disc' }}>
                                            {project.bullets.map((bullet, bi) => {
                                                const bulletKey = `${blockKey}-bullet-${bi}`;
                                                if (!shouldRender(bulletKey)) return null;
                                                return <li key={bi} data-block-key={bulletKey} data-section-id="projects" data-column="main" style={{ ...textStyle, marginBottom: '2px' }} contentEditable suppressContentEditableWarning>{bullet}</li>;
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                {data.education.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        {shouldRender('education-title') && (
                            <div style={mainTitleStyle} data-section-title="true" data-section-id="education" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('education', 'Education')}
                            </div>
                        )}
                        {data.education.map((edu, index) => {
                            const blockKey = `education-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div key={index} data-block-key={blockKey} data-section-id="education" data-column="main" style={{ marginBottom: '6px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <span style={{ fontWeight: 700, fontSize: '9pt', color: '#0f172a' }} contentEditable suppressContentEditableWarning>{edu.degree}</span>
                                        <span style={{ fontSize: '8pt', color: '#64748b' }} contentEditable suppressContentEditableWarning>{edu.dates}</span>
                                    </div>
                                    <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#475569' }}>
                                        <span contentEditable suppressContentEditableWarning>{edu.school}</span>
                                        {edu.details && <span contentEditable suppressContentEditableWarning>{` — ${edu.details}`}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.skills.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        {shouldRender('skills-title') && (
                            <div style={mainTitleStyle} data-section-title="true" data-section-id="skills" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('skills', 'Skills')}
                            </div>
                        )}
                        {shouldRender('skills') && (
                            <div
                                data-block-key="skills"
                                data-section-id="skills"
                                data-column="main"
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
                            >
                                {data.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '4px', background: '#f1f5f9', color: '#1e293b', fontSize: '8pt', fontWeight: 500 }}
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

                {data.certifications.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        {shouldRender('certifications-title') && (
                            <div style={mainTitleStyle} data-section-title="true" data-section-id="certifications" data-column="main" contentEditable suppressContentEditableWarning>
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
                                    style={{ ...textStyle, marginBottom: '4px' }}
                                    contentEditable
                                    suppressContentEditableWarning
                                >
                                    {cert}
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.languages.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        {shouldRender('languages-title') && (
                            <div style={mainTitleStyle} data-section-title="true" data-section-id="languages" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('languages', 'Languages')}
                            </div>
                        )}
                        {shouldRender('languages') && (
                            <div
                                data-block-key="languages"
                                data-section-id="languages"
                                data-column="main"
                                style={{ ...textStyle, lineHeight: 1.3 }}
                                contentEditable
                                suppressContentEditableWarning
                            >
                                {data.languages.join(', ')}
                            </div>
                        )}
                    </div>
                )}

                {(() => {
                    const hasVisibleAwards = data.awards.some((_, i) => shouldRender(`awards-${i}`));
                    const hasTitle = shouldRender('awards-title');
                    if (!hasVisibleAwards) return null;
                    return (
                        <div style={{ marginBottom: '16px' }}>
                            {hasTitle && (
                                <div style={mainTitleStyle} data-section-title="true" data-section-id="awards" data-column="main" contentEditable suppressContentEditableWarning>
                                    {getTitle('awards', 'Awards & Honors')}
                                </div>
                            )}
                            {data.awards.map((award, index) => {
                                const blockKey = `awards-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                return (
                                    <div key={index} data-block-key={blockKey} data-section-id="awards" data-column="main" style={{ marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 700, fontSize: '8.5pt', color: '#0f172a' }} contentEditable suppressContentEditableWarning>{award.name}</span>
                                        {award.meta && <span style={{ fontStyle: 'italic', fontSize: '8pt', color: '#64748b', marginLeft: '6px' }} contentEditable suppressContentEditableWarning>{award.meta}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}
            </div>
        );
    }

    // ─── Two-Column Layout (First Page / Repeat Mode) ───────────────────
    return (
        <div
            style={{
                width: '794px',
                height: '1122px',
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
                overflowWrap: 'break-word',
            }}
        >
            {/* Sidebar */}
            <div
                data-sidebar="true"
                style={{
                    width: `${SIDEBAR_W}px`,
                    backgroundColor: sidebarBg,
                    color: '#f8fafc',
                    padding: '36px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    height: '100%',
                }}
            >
                {shouldRender('header') && (
                    <div data-block-key="header" data-section-id="header" data-column="sidebar">
                        <div
                            style={{
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '15pt',
                                fontWeight: 700,
                                lineHeight: 1.2,
                                color: '#ffffff',
                                marginBottom: '4px',
                            }}
                            contentEditable
                            suppressContentEditableWarning
                        >
                            {data.fullName}
                        </div>
                        {data.headline && (
                            <div
                                style={{
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '8pt',
                                    color: '#94a3b8',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '16px',
                                }}
                                contentEditable
                                suppressContentEditableWarning
                            >
                                {data.headline}
                            </div>
                        )}

                        <div style={sidebarTitleStyle} data-section-title="true" data-section-id="contact" data-column="sidebar">
                            Contact
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {contacts.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{ fontSize: '8pt', color: '#cbd5e1', wordBreak: 'break-all' }}
                                    contentEditable
                                    suppressContentEditableWarning
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sidebar Skills */}
                {(() => {
                    const hasTitle = shouldRender('skills-title');
                    const visibleSkills = data.skills.filter((_, idx) => shouldRender(`skills-${idx}`));
                    if (!hasTitle && visibleSkills.length === 0) return null;
                    return (
                        <div style={{ marginTop: '10px' }}>
                            {hasTitle && (
                                <div style={sidebarTitleStyle} data-section-title="true" data-section-id="skills" data-column="sidebar">
                                    {getTitle('skills', 'Skills')}
                                </div>
                            )}
                            {visibleSkills.length > 0 && (
                                <div
                                    data-section-id="skills"
                                    data-column="sidebar"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
                                >
                                    {data.skills.map((skill, idx) => {
                                        const blockKey = `skills-${idx}`;
                                        if (!shouldRender(blockKey)) return null;
                                        return (
                                            <div
                                                key={idx}
                                                data-block-key={blockKey}
                                                data-section-id="skills"
                                                data-column="sidebar"
                                                style={{ fontSize: '8pt', color: '#cbd5e1', padding: '2px 0' }}
                                                contentEditable
                                                suppressContentEditableWarning
                                            >
                                                {skill}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Sidebar Certifications */}
                {(() => {
                    const hasVisibleCerts = data.certifications.some((_, index) => shouldRender(`certifications-${index}`));
                    const hasTitle = shouldRender('certifications-title');
                    if (!hasVisibleCerts && !hasTitle) return null;
                    return (
                        <div style={{ marginTop: '10px' }}>
                            {hasTitle && (
                                <div style={sidebarTitleStyle} data-section-title="true" data-section-id="certifications" data-column="sidebar">
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
                                        data-column="sidebar"
                                        style={{ fontSize: '8pt', color: '#cbd5e1', marginBottom: '4px', lineHeight: 1.3 }}
                                        contentEditable
                                        suppressContentEditableWarning
                                    >
                                        {cert}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}

                {/* Sidebar Languages */}
                {(() => {
                    const hasTitle = shouldRender('languages-title');
                    const hasLanguages = shouldRender('languages') && data.languages.length > 0;
                    if (!hasTitle && !hasLanguages) return null;
                    return (
                        <div style={{ marginTop: '10px' }}>
                            {hasTitle && (
                                <div style={sidebarTitleStyle} data-section-title="true" data-section-id="languages" data-column="sidebar">
                                    {getTitle('languages', 'Languages')}
                                </div>
                            )}
                            {hasLanguages && (
                                <div
                                    data-block-key="languages"
                                    data-section-id="languages"
                                    data-column="sidebar"
                                    style={{ fontSize: '8pt', color: '#cbd5e1', lineHeight: 1.3 }}
                                    contentEditable
                                    suppressContentEditableWarning
                                >
                                    {data.languages.join(', ')}
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>

            {/* Main Content Area */}
            <div
                data-main="true"
                style={{
                    flex: 1,
                    padding: '36px 30px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {data.summary && shouldRender('summary') && (
                    <div style={{ marginBottom: '14px' }}>
                        {shouldRender('summary-title') && (
                            <div style={mainTitleStyle} data-section-title="true" data-section-id="summary" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('summary', 'Professional Summary')}
                            </div>
                        )}
                        <div data-block-key="summary" data-section-id="summary" data-column="main" style={textStyle} contentEditable suppressContentEditableWarning>
                            {data.summary}
                        </div>
                    </div>
                )}

                {data.experience.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                        {shouldRender('experience-title') && (
                            <div style={mainTitleStyle} data-section-title="true" data-section-id="experience" data-column="main" contentEditable suppressContentEditableWarning>
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
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    {isHeaderVisible ? (
                                        <div data-block-key={headerKey} data-section-id="experience" data-column="main">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                                <span style={jobTitleStyle} contentEditable suppressContentEditableWarning>{job.title}</span>
                                                <span style={{ fontSize: '8pt', color: '#64748b', fontWeight: 'bold' }} contentEditable suppressContentEditableWarning>{job.dates}</span>
                                            </div>
                                            <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#475569', marginBottom: '3px' }}>
                                                <strong style={{ color: mainTitleColor }} contentEditable suppressContentEditableWarning>{job.company}</strong>
                                                {job.location && <span contentEditable suppressContentEditableWarning>{` — ${job.location}`}</span>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#475569', marginBottom: '3px' }}>
                                            <strong style={{ color: mainTitleColor }}>{job.company}</strong> (Continued)
                                        </div>
                                    )}

                                    {visibleBullets.length > 0 && (
                                        <ul style={{ paddingLeft: '14px', margin: '0', listStyleType: 'disc' }}>
                                            {job.bullets.map((bullet, bi) => {
                                                const bulletKey = `${blockKey}-bullet-${bi}`;
                                                if (!shouldRender(bulletKey)) return null;
                                                return <li key={bi} data-block-key={bulletKey} data-section-id="experience" data-column="main" style={{ ...textStyle, marginBottom: '2px' }} contentEditable suppressContentEditableWarning>{bullet}</li>;
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.projects.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                        {shouldRender('projects-title') && (
                            <div style={mainTitleStyle} data-section-title="true" data-section-id="projects" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('projects', 'Projects')}
                            </div>
                        )}
                        {data.projects.map((project, index) => {
                            const blockKey = `projects-${index}`;
                            const headerKey = `${blockKey}-header`;
                            const isHeaderVisible = shouldRender(headerKey);
                            const visibleBullets = project.bullets.filter((_, bi) => shouldRender(`${blockKey}-bullet-${bi}`));

                            if (!isHeaderVisible && visibleBullets.length === 0) return null;

                            return (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    {isHeaderVisible ? (
                                        <div data-block-key={headerKey} data-section-id="projects" data-column="main">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                                <span style={jobTitleStyle} contentEditable suppressContentEditableWarning>{project.name}</span>
                                            </div>
                                            {project.meta && <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#475569', marginBottom: '3px' }} contentEditable suppressContentEditableWarning>{project.meta}</div>}
                                        </div>
                                    ) : (
                                        <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#475569', marginBottom: '3px' }}>
                                            <strong>{project.name}</strong> (Continued)
                                        </div>
                                    )}

                                    {visibleBullets.length > 0 && (
                                        <ul style={{ paddingLeft: '14px', margin: '0', listStyleType: 'disc' }}>
                                            {project.bullets.map((bullet, bi) => {
                                                const bulletKey = `${blockKey}-bullet-${bi}`;
                                                if (!shouldRender(bulletKey)) return null;
                                                return <li key={bi} data-block-key={bulletKey} data-section-id="projects" data-column="main" style={{ ...textStyle, marginBottom: '2px' }} contentEditable suppressContentEditableWarning>{bullet}</li>;
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.education.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                        {shouldRender('education-title') && (
                            <div style={mainTitleStyle} data-section-title="true" data-section-id="education" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('education', 'Education')}
                            </div>
                        )}
                        {data.education.map((edu, index) => {
                            const blockKey = `education-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div key={index} data-block-key={blockKey} data-section-id="education" data-column="main" style={{ marginBottom: '6px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <span style={{ fontWeight: 700, fontSize: '9pt', color: '#0f172a' }} contentEditable suppressContentEditableWarning>{edu.degree}</span>
                                        <span style={{ fontSize: '8pt', color: '#64748b' }} contentEditable suppressContentEditableWarning>{edu.dates}</span>
                                    </div>
                                    <div style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#475569' }}>
                                        <span contentEditable suppressContentEditableWarning>{edu.school}</span>
                                        {edu.details && <span contentEditable suppressContentEditableWarning>{` — ${edu.details}`}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Awards */}
                {(() => {
                    const hasVisibleAwards = data.awards.some((_, i) => shouldRender(`awards-${i}`));
                    const hasTitle = shouldRender('awards-title');
                    if (!hasVisibleAwards) return null;
                    return (
                        <div style={{ marginTop: '8px' }}>
                            {hasTitle && (
                                <div style={mainTitleStyle} data-section-title="true" data-section-id="awards" data-column="main" contentEditable suppressContentEditableWarning>
                                    {getTitle('awards', 'Awards & Honors')}
                                </div>
                            )}
                            {data.awards.map((award, index) => {
                                const blockKey = `awards-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                return (
                                    <div key={index} data-block-key={blockKey} data-section-id="awards" data-column="main" style={{ marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 700, fontSize: '8.5pt', color: '#0f172a' }} contentEditable suppressContentEditableWarning>{award.name}</span>
                                        {award.meta && <span style={{ fontStyle: 'italic', fontSize: '8pt', color: '#64748b', marginLeft: '6px' }} contentEditable suppressContentEditableWarning>{award.meta}</span>}
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

export default NavySidebar;
