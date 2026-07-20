import React from 'react';
import './TemplateStyles.css';
import type { ResumeData } from '../types/resume';
import { defaultResumeData } from '../types/resume';

// Sidebar width constant — single source of truth used everywhere:
// inline styles, CSS gradient, and print CSS must all agree on this value.
const SIDEBAR_W = 220;

type ModernProfessionalProps = {
    data?: ResumeData;
    visibleBlockKeys?: Set<string>;
    pageIndex?: number;
    sidebarMode?: 'first-page-only' | 'repeat';
    showContinuationLabels?: boolean;
    continuedSectionIds?: Set<string>;
};

const ModernProfessional: React.FC<ModernProfessionalProps> = ({
    data = defaultResumeData,
    visibleBlockKeys,
    pageIndex = 0,
    sidebarMode = 'first-page-only',
    showContinuationLabels = true,
    continuedSectionIds,
}) => {
    const contacts = [data.email, data.phone, data.location, ...data.links]
        .filter(Boolean)
        .filter((item, index, arr) => arr.indexOf(item) === index);
    const skillWidth = (index: number) => `${Math.max(70, 94 - index * 4)}%`;

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

    // ─── Continuation page: single-column, white background ───────────────────
    if (!showSidebarLayout) {
        return (
            <div
                className="t2 t2-single"
                style={{
                    width: '794px',
                    height: '1122px',
                    display: 'block',
                    background: '#ffffff',
                    padding: '48px 50px',
                    boxSizing: 'border-box',
                }}
            >
                {data.summary && shouldRender('summary') && (
                    <div className="t2-section">
                        {shouldRender('summary-title') && (
                            <div className="t2-section-title" data-section-title="true" data-section-id="summary" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('summary', 'Profile')}
                            </div>
                        )}
                        <div className="t2-summary" data-block-key="summary" data-section-id="summary" data-column="main" contentEditable suppressContentEditableWarning>
                            {data.summary}
                        </div>
                    </div>
                )}

                {data.experience.length > 0 && (
                    <div className="t2-section">
                        {shouldRender('experience-title') && (
                            <div className="t2-section-title" data-section-title="true" data-section-id="experience" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('experience', 'Experience')}
                            </div>
                        )}
                        {data.experience.map((job, index) => {
                            const blockKey = `experience-${index}`;
                            const headerKey = `${blockKey}-header`;
                            const isHeaderVisible = shouldRender(headerKey);
                            const visibleBullets = job.bullets.filter((_, bi) => shouldRender(`${blockKey}-bullet-${bi}`));

                            if (!isHeaderVisible && visibleBullets.length === 0) return null;

                            return (
                                <div className="t2-job" key={`${job.company}-${index}`}>
                                    {isHeaderVisible ? (
                                        <div
                                            data-block-key={headerKey}
                                            data-section-id="experience"
                                            data-column="main"
                                        >
                                            <div className="t2-job-title" contentEditable suppressContentEditableWarning>{job.title}</div>
                                            <div className="t2-job-meta" contentEditable suppressContentEditableWarning>
                                                <strong>{job.company}</strong>{job.location ? ` — ${job.location}` : ''} · {job.dates}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="t2-job-meta" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                            <strong>{job.company}</strong> (Continued)
                                        </div>
                                    )}
                                    {visibleBullets.length > 0 && (
                                        <ul className="t2-bullets">
                                            {job.bullets.map((bullet, bi) => {
                                                const bulletKey = `${blockKey}-bullet-${bi}`;
                                                if (!shouldRender(bulletKey)) return null;
                                                return <li key={bi} data-block-key={bulletKey} data-section-id="experience" data-column="main" contentEditable suppressContentEditableWarning>{bullet}</li>;
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.projects.length > 0 && (
                    <div className="t2-section">
                        {shouldRender('projects-title') && (
                            <div className="t2-section-title" data-section-title="true" data-section-id="projects" data-column="main" contentEditable suppressContentEditableWarning>
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
                                <div className="t2-job" key={`${project.name}-${index}`}>
                                    {isHeaderVisible ? (
                                        <div
                                            data-block-key={headerKey}
                                            data-section-id="projects"
                                            data-column="main"
                                        >
                                            <div className="t2-job-title" contentEditable suppressContentEditableWarning>{project.name}</div>
                                            {project.meta && <div className="t2-job-meta" contentEditable suppressContentEditableWarning>{project.meta}</div>}
                                        </div>
                                    ) : (
                                        <div className="t2-job-meta" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                            <strong>{project.name}</strong> (Continued)
                                        </div>
                                    )}
                                    {visibleBullets.length > 0 && (
                                        <ul className="t2-bullets">
                                            {project.bullets.map((bullet, bi) => {
                                                const bulletKey = `${blockKey}-bullet-${bi}`;
                                                if (!shouldRender(bulletKey)) return null;
                                                return <li key={bi} data-block-key={bulletKey} data-section-id="projects" data-column="main" contentEditable suppressContentEditableWarning>{bullet}</li>;
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.education.length > 0 && (
                    <div className="t2-section">
                        {shouldRender('education-title') && (
                            <div className="t2-section-title" data-section-title="true" data-section-id="education" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('education', 'Education')}
                            </div>
                        )}
                        {data.education.map((edu, index) => {
                            const blockKey = `education-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div className="t2-edu-item" key={`${edu.school}-${index}`} data-block-key={blockKey} data-section-id="education" data-column="main">
                                    <div className="t2-edu-degree" contentEditable suppressContentEditableWarning>{edu.degree}</div>
                                    <div className="t2-edu-school" contentEditable suppressContentEditableWarning>{edu.school}</div>
                                    <div className="t2-edu-date" contentEditable suppressContentEditableWarning>{edu.dates}{edu.details ? ` — ${edu.details}` : ''}</div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.skills.length > 0 && (
                    <div className="t2-section">
                        {shouldRender('skills-title') && (
                            <div className="t2-section-title" data-section-title="true" data-section-id="skills" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('skills', 'Technical Skills')}
                            </div>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} data-section-id="skills" data-column="main">
                            {data.skills.map((skill, index) => {
                                const blockKey = `skills-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                return (
                                    <span
                                        key={skill}
                                        data-block-key={blockKey}
                                        style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '4px', background: '#f1f5f9', color: '#1e293b', fontSize: '8pt', fontWeight: 500 }}
                                        contentEditable
                                        suppressContentEditableWarning
                                    >
                                        {skill}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                {data.languages.length > 0 && (
                    <div className="t2-section">
                        {shouldRender('languages-title') && (
                            <div className="t2-section-title" data-section-title="true" data-section-id="languages" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('languages', 'Languages')}
                            </div>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }} data-section-id="languages" data-column="main">
                            {data.languages.map((lang, index) => {
                                const blockKey = `languages-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                return (
                                    <div key={index} data-block-key={blockKey} style={{ fontSize: '8.5pt', color: '#334155' }} contentEditable suppressContentEditableWarning>
                                        {lang}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {data.certifications.length > 0 && (
                    <div className="t2-section">
                        {shouldRender('certifications-title') && (
                            <div className="t2-section-title" data-section-title="true" data-section-id="certifications" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('certifications', 'Certifications')}
                            </div>
                        )}
                        <ul className="t2-bullets" data-section-id="certifications" data-column="main">
                            {data.certifications.map((cert, index) => {
                                const blockKey = `certifications-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                return <li key={index} data-block-key={blockKey} contentEditable suppressContentEditableWarning>{cert}</li>;
                            })}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    // ─── Page 1: two-column layout ─────────────────────────────────────────────
    return (
        <div
            className="t2"
            style={{
                width: '794px',
                height: '1122px',
                display: 'flex',
                // gradient split point matches SIDEBAR_W exactly — fixes browser/PDF mismatch
                background: `linear-gradient(to right, #1d3557 ${SIDEBAR_W}px, #ffffff ${SIDEBAR_W}px)`,
                boxSizing: 'border-box',
            }}
        >
            {/* Sidebar */}
            <div
                className="t2-sidebar"
                data-sidebar="true"
                style={{
                    width: `${SIDEBAR_W}px`,
                    flexShrink: 0,
                    padding: '48px 20px 48px 28px',
                    boxSizing: 'border-box',
                    overflowY: 'hidden',
                }}
            >
                {shouldRender('sidebar-header') && (
                    <div data-block-key="sidebar-header" data-section-id="sidebar-header" data-column="sidebar">
                        <div className="t2-sidebar-name" contentEditable suppressContentEditableWarning>{data.fullName}</div>
                        <div className="t2-sidebar-role" contentEditable suppressContentEditableWarning>{data.headline}</div>
                    </div>
                )}

                {contacts.length > 0 && shouldRender('sidebar-contact') && (
                    <div className="t2-sidebar-section" data-block-key="sidebar-contact" data-section-id="sidebar-contact" data-column="sidebar">
                        <div className="t2-sidebar-heading" contentEditable suppressContentEditableWarning>Contact</div>
                        {contacts.map((item) => (
                            <div className="t2-contact-item" key={item} contentEditable suppressContentEditableWarning>{item}</div>
                        ))}
                    </div>
                )}

                {data.skills.length > 0 && (
                    <div className="t2-sidebar-section">
                        {shouldRender('skills-title') && (
                            <div className="t2-sidebar-heading" data-section-title="true" data-section-id="skills" data-column="sidebar" contentEditable suppressContentEditableWarning>
                                {getTitle('skills', 'Technical Skills')}
                            </div>
                        )}
                        {data.skills.map((skill, index) => {
                            const blockKey = `skills-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div className="t2-skill-bar" key={skill} data-block-key={blockKey} data-section-id="skills" data-column="sidebar">
                                    <div className="t2-skill-name" contentEditable suppressContentEditableWarning>{skill}</div>
                                    <div className="t2-skill-track">
                                        <div className="t2-skill-fill" style={{ width: skillWidth(index) }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.education.length > 0 && (
                    <div className="t2-sidebar-section">
                        {shouldRender('education-title') && (
                            <div className="t2-sidebar-heading" data-section-title="true" data-section-id="education" data-column="sidebar" contentEditable suppressContentEditableWarning>
                                {getTitle('education', 'Education')}
                            </div>
                        )}
                        {data.education.map((edu, index) => {
                            const blockKey = `education-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div className="t2-edu-item" key={`${edu.school}-${index}`} data-block-key={blockKey} data-section-id="education" data-column="sidebar">
                                    <div className="t2-contact-item" style={{ fontWeight: 700, color: '#fff' }} contentEditable suppressContentEditableWarning>{edu.degree}</div>
                                    <div className="t2-contact-item" contentEditable suppressContentEditableWarning>{edu.school}</div>
                                    <div className="t2-contact-item" style={{ color: '#a8c4d6' }} contentEditable suppressContentEditableWarning>{edu.dates}</div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.certifications.length > 0 && (
                    <div className="t2-sidebar-section">
                        {shouldRender('certifications-title') && (
                            <div className="t2-sidebar-heading" data-section-title="true" data-section-id="certifications" data-column="sidebar" contentEditable suppressContentEditableWarning>
                                {getTitle('certifications', 'Certifications')}
                            </div>
                        )}
                        {data.certifications.map((cert, index) => {
                            const blockKey = `certifications-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div className="t2-contact-item" key={index} data-block-key={blockKey} data-section-id="certifications" data-column="sidebar" contentEditable suppressContentEditableWarning>
                                    {cert}
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.languages.length > 0 && (
                    <div className="t2-sidebar-section">
                        {shouldRender('languages-title') && (
                            <div className="t2-sidebar-heading" data-section-title="true" data-section-id="languages" data-column="sidebar" contentEditable suppressContentEditableWarning>
                                {getTitle('languages', 'Languages')}
                            </div>
                        )}
                        {data.languages.map((lang, index) => {
                            const blockKey = `languages-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div className="t2-contact-item" key={index} data-block-key={blockKey} data-section-id="languages" data-column="sidebar" contentEditable suppressContentEditableWarning>
                                    {lang}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Main column */}
            <div
                className="t2-main"
                data-main="true"
                style={{ flex: 1, padding: '48px 36px 48px 28px', boxSizing: 'border-box', overflowY: 'hidden' }}
            >
                {data.summary && (
                    <div className="t2-section">
                        {shouldRender('summary-title') && (
                            <div className="t2-section-title" data-section-title="true" data-section-id="summary" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('summary', 'Profile')}
                            </div>
                        )}
                        {shouldRender('summary') && (
                            <div className="t2-summary" data-block-key="summary" data-section-id="summary" data-column="main" contentEditable suppressContentEditableWarning>
                                {data.summary}
                            </div>
                        )}
                    </div>
                )}

                {data.experience.length > 0 && (
                    <div className="t2-section">
                        {shouldRender('experience-title') && (
                            <div className="t2-section-title" data-section-title="true" data-section-id="experience" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('experience', 'Experience')}
                            </div>
                        )}
                        {data.experience.map((job, index) => {
                            const blockKey = `experience-${index}`;
                            const headerKey = `${blockKey}-header`;
                            const isHeaderVisible = shouldRender(headerKey);
                            const visibleBullets = job.bullets.filter((_, bi) => shouldRender(`${blockKey}-bullet-${bi}`));

                            if (!isHeaderVisible && visibleBullets.length === 0) return null;

                            return (
                                <div className="t2-job" key={`${job.company}-${index}`}>
                                    {isHeaderVisible ? (
                                        <div
                                            data-block-key={headerKey}
                                            data-section-id="experience"
                                            data-column="main"
                                        >
                                            <div className="t2-job-title" contentEditable suppressContentEditableWarning>{job.title}</div>
                                            <div className="t2-job-meta" contentEditable suppressContentEditableWarning>
                                                <strong>{job.company}</strong>{job.location ? ` — ${job.location}` : ''} · {job.dates}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="t2-job-meta" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                            <strong>{job.company}</strong> (Continued)
                                        </div>
                                    )}
                                    {visibleBullets.length > 0 && (
                                        <ul className="t2-bullets">
                                            {job.bullets.map((bullet, bi) => {
                                                const bulletKey = `${blockKey}-bullet-${bi}`;
                                                if (!shouldRender(bulletKey)) return null;
                                                return <li key={bi} data-block-key={bulletKey} data-section-id="experience" data-column="main" contentEditable suppressContentEditableWarning>{bullet}</li>;
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.projects.length > 0 && (
                    <div className="t2-section">
                        {shouldRender('projects-title') && (
                            <div className="t2-section-title" data-section-title="true" data-section-id="projects" data-column="main" contentEditable suppressContentEditableWarning>
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
                                <div className="t2-job" key={`${project.name}-${index}`}>
                                    {isHeaderVisible ? (
                                        <div
                                            data-block-key={headerKey}
                                            data-section-id="projects"
                                            data-column="main"
                                        >
                                            <div className="t2-job-title" contentEditable suppressContentEditableWarning>{project.name}</div>
                                            {project.meta && <div className="t2-job-meta" contentEditable suppressContentEditableWarning>{project.meta}</div>}
                                        </div>
                                    ) : (
                                        <div className="t2-job-meta" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                            <strong>{project.name}</strong> (Continued)
                                        </div>
                                    )}
                                    {visibleBullets.length > 0 && (
                                        <ul className="t2-bullets">
                                            {project.bullets.map((bullet, bi) => {
                                                const bulletKey = `${blockKey}-bullet-${bi}`;
                                                if (!shouldRender(bulletKey)) return null;
                                                return <li key={bi} data-block-key={bulletKey} data-section-id="projects" data-column="main" contentEditable suppressContentEditableWarning>{bullet}</li>;
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Awards */}
                {(() => {
                    const hasVisibleAwards = data.awards && data.awards.length > 0 && data.awards.some((_, i) => shouldRender(`awards-${i}`));
                    const hasTitle = shouldRender('awards-title');
                    if (!hasVisibleAwards) return null;
                    return (
                        <div className="t2-section" style={{ marginTop: '10px' }}>
                            {hasTitle && (
                                <div className="t2-section-title" data-section-title="true" data-section-id="awards" data-column="main" contentEditable suppressContentEditableWarning>
                                    {getTitle('awards', 'Awards & Honors')}
                                </div>
                            )}
                            {data.awards.map((award, index) => {
                                const blockKey = `awards-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                return (
                                    <div key={index} data-block-key={blockKey} data-section-id="awards" data-column="main" className="t2-job" style={{ marginBottom: '6px' }}>
                                        <div className="t2-job-title" contentEditable suppressContentEditableWarning>
                                            <strong>{award.name}</strong>
                                            {award.meta && <span style={{ fontStyle: 'italic', fontWeight: 'normal', marginLeft: '6px', fontSize: '8.5pt', color: '#555' }}>({award.meta})</span>}
                                        </div>
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

export default ModernProfessional;
