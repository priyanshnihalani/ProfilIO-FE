import React from 'react';
import './TemplateStyles.css';
import type { ResumeData } from '../types/resume';
import { defaultResumeData } from '../types/resume';

type ElegantCompactProps = {
    data?: ResumeData;
    visibleBlockKeys?: Set<string>;
    pageIndex?: number;
    sidebarMode?: 'first-page-only' | 'repeat';
    showContinuationLabels?: boolean;
    continuedSectionIds?: Set<string>;
};

const ElegantCompact: React.FC<ElegantCompactProps> = ({
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

    // ─── Continuation pages: single column ────────────────────────────────────
    if (!showSidebarLayout) {
        return (
            <div className="t3 t3-single" style={{ padding: '48px 50px', height: '1122px', boxSizing: 'border-box', overflowWrap: 'break-word' }}>
                {data.summary && shouldRender('summary') && (
                    <div className="t3-section">
                        {shouldRender('summary-title') && (
                            <div className="t3-section-title" data-section-title="true" data-section-id="summary" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('summary', 'Profile')}
                            </div>
                        )}
                        <div className="t3-summary" data-block-key="summary" data-section-id="summary" data-column="main" contentEditable suppressContentEditableWarning>
                            {data.summary}
                        </div>
                    </div>
                )}

                {data.experience.length > 0 && (
                    <div className="t3-section">
                        {shouldRender('experience-title') && (
                            <div className="t3-section-title" data-section-title="true" data-section-id="experience" data-column="main" contentEditable suppressContentEditableWarning>
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
                                <div className="t3-job" key={`${job.company}-${index}`}>
                                    {isHeaderVisible ? (
                                        <div
                                            data-block-key={headerKey}
                                            data-section-id="experience"
                                            data-column="main"
                                        >
                                            <div className="t3-job-top">
                                                <span className="t3-job-title" contentEditable suppressContentEditableWarning>{job.title}</span>
                                                <span className="t3-job-date" contentEditable suppressContentEditableWarning>{job.dates}</span>
                                            </div>
                                            <div className="t3-job-company" contentEditable suppressContentEditableWarning>{job.company}{job.location ? ` — ${job.location}` : ''}</div>
                                        </div>
                                    ) : (
                                        <div className="t3-job-company" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                            {job.company} (Continued)
                                        </div>
                                    )}
                                    {visibleBullets.length > 0 && (
                                        <ul className="t3-bullets">
                                            {job.bullets.map((b, bi) => {
                                                const bulletKey = `${blockKey}-bullet-${bi}`;
                                                if (!shouldRender(bulletKey)) return null;
                                                return <li key={bi} data-block-key={bulletKey} data-section-id="experience" data-column="main" contentEditable suppressContentEditableWarning>{b}</li>;
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.projects.length > 0 && (
                    <div className="t3-section">
                        {shouldRender('projects-title') && (
                            <div className="t3-section-title" data-section-title="true" data-section-id="projects" data-column="main" contentEditable suppressContentEditableWarning>
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
                                <div className="t3-job" key={`${project.name}-${index}`}>
                                    {isHeaderVisible ? (
                                        <div
                                            data-block-key={headerKey}
                                            data-section-id="projects"
                                            data-column="main"
                                        >
                                            <div className="t3-job-title" contentEditable suppressContentEditableWarning>{project.name}</div>
                                            {project.meta && <div className="t3-job-company" contentEditable suppressContentEditableWarning>{project.meta}</div>}
                                        </div>
                                    ) : (
                                        <div className="t3-job-company" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                            {project.name} (Continued)
                                        </div>
                                    )}
                                    {visibleBullets.length > 0 && (
                                        <ul className="t3-bullets">
                                            {project.bullets.map((b, bi) => {
                                                const bulletKey = `${blockKey}-bullet-${bi}`;
                                                if (!shouldRender(bulletKey)) return null;
                                                return <li key={bi} data-block-key={bulletKey} data-section-id="projects" data-column="main" contentEditable suppressContentEditableWarning>{b}</li>;
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.education.length > 0 && (
                    <div className="t3-section">
                        {shouldRender('education-title') && (
                            <div className="t3-section-title" data-section-title="true" data-section-id="education" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('education', 'Education')}
                            </div>
                        )}
                        {data.education.map((edu, index) => {
                            const blockKey = `education-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div className="t3-edu-item" key={`${edu.school}-${index}`} data-block-key={blockKey} data-section-id="education" data-column="main">
                                    <div className="t3-edu-degree" contentEditable suppressContentEditableWarning>{edu.degree}</div>
                                    <div className="t3-edu-school" contentEditable suppressContentEditableWarning>{edu.school}</div>
                                    <div className="t3-edu-date" contentEditable suppressContentEditableWarning>{edu.dates}{edu.details ? ` — ${edu.details}` : ''}</div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.skills.length > 0 && (
                    <div className="t3-section">
                        {shouldRender('skills-title') && (
                            <div className="t3-section-title" data-section-title="true" data-section-id="skills" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('skills', 'Skills')}
                            </div>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }} data-section-id="skills" data-column="main">
                            {data.skills.map((skill, index) => {
                                const blockKey = `skills-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                return (
                                    <span
                                        className="t3-skill"
                                        key={skill}
                                        data-block-key={blockKey}
                                        data-section-id="skills"
                                        data-column="main"
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
                    <div className="t3-section">
                        {shouldRender('languages-title') && (
                            <div className="t3-section-title" data-section-title="true" data-section-id="languages" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('languages', 'Languages')}
                            </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }} data-section-id="languages" data-column="main">
                            {data.languages.map((language, index) => {
                                const blockKey = `languages-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                const [name, level = ''] = language.split(' - ');
                                return (
                                    <div className="t3-lang" key={index} data-block-key={blockKey} style={{ margin: 0 }}>
                                        <span contentEditable suppressContentEditableWarning>{name}</span>
                                        <span className="t3-lang-level" contentEditable suppressContentEditableWarning>{level}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {data.awards.length > 0 && (
                    <div className="t3-section">
                        {shouldRender('awards-title') && (
                            <div className="t3-section-title" data-section-title="true" data-section-id="awards" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('awards', 'Awards')}
                            </div>
                        )}
                        {data.awards.map((award, index) => {
                            const blockKey = `awards-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div className="t3-edu-item" key={`award-${index}`} data-block-key={blockKey} data-section-id="awards" data-column="main">
                                    <div className="t3-edu-degree" contentEditable suppressContentEditableWarning>{award.name}</div>
                                    <div className="t3-edu-school" contentEditable suppressContentEditableWarning>{award.meta}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // ─── Page 1: two-column with centred header ────────────────────────────────
    // Architecture: header block at root level (data-block-key="header"),
    // then a wrapper with data-main containing only the main column,
    // and data-sidebar at the same root level for the sidebar column.
    // This ensures the pagination engine can find both data-main and
    // data-sidebar as distinct, non-overlapping subtrees.

    // ─── Sidebar-overflow page: sidebar content only, no main column ───────────
    // When sidebarMode === 'repeat' and pageIndex > 0, the header is hidden.
    // If the main column has no visible blocks on this page, render only
    // the sidebar content to avoid an empty left column pushing the sidebar down.
    const isHeaderVisible = shouldRender('header');
    const hasAnyMainContent = visibleBlockKeys
        ? [...visibleBlockKeys].some(k =>
            !k.startsWith('skills-') &&
            k !== 'skills-title' &&
            !k.startsWith('languages') &&
            !k.startsWith('awards') &&
            !k.startsWith('sidebar') &&
            k !== 'header'
          )
        : true;
    const isSidebarOnlyPage = !isHeaderVisible && !hasAnyMainContent && pageIndex > 0;

    if (isSidebarOnlyPage) {
        return (
            <div className="t3" style={{ padding: '48px 50px', height: '1122px', boxSizing: 'border-box', overflowWrap: 'break-word' }}>
                {data.skills.length > 0 && (() => {
                    const visibleSkills = data.skills.filter((_, i) => shouldRender(`skills-${i}`));
                    if (visibleSkills.length === 0) return null;
                    return (
                        <div className="t3-section">
                            {shouldRender('skills-title') && (
                                <div className="t3-section-title" data-section-title="true" data-section-id="skills" data-column="main" contentEditable suppressContentEditableWarning>
                                    {getTitle('skills', 'Skills')}
                                </div>
                            )}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {data.skills.map((skill, index) => {
                                    const blockKey = `skills-${index}`;
                                    if (!shouldRender(blockKey)) return null;
                                    return (
                                        <span
                                            className="t3-skill"
                                            key={skill}
                                            data-block-key={blockKey}
                                            data-section-id="skills"
                                            data-column="main"
                                            contentEditable
                                            suppressContentEditableWarning
                                        >
                                            {skill}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}

                {data.languages.length > 0 && (
                    <div className="t3-section">
                        {shouldRender('languages-title') && (
                            <div className="t3-section-title" data-section-title="true" data-section-id="languages" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('languages', 'Languages')}
                            </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }} data-section-id="languages" data-column="main">
                            {data.languages.map((language, index) => {
                                const blockKey = `languages-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                const [name, level = ''] = language.split(' - ');
                                return (
                                    <div className="t3-lang" key={index} data-block-key={blockKey} style={{ margin: 0 }}>
                                        <span contentEditable suppressContentEditableWarning>{name}</span>
                                        <span className="t3-lang-level" contentEditable suppressContentEditableWarning>{level}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {data.awards.length > 0 && (
                    <div className="t3-section">
                        {shouldRender('awards-title') && (
                            <div className="t3-section-title" data-section-title="true" data-section-id="awards" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('awards', 'Awards')}
                            </div>
                        )}
                        {data.awards.map((award, index) => {
                            const blockKey = `awards-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div className="t3-edu-item" key={`award-${index}`} data-block-key={blockKey} data-section-id="awards" data-column="main">
                                    <div className="t3-edu-degree" contentEditable suppressContentEditableWarning>{award.name}</div>
                                    <div className="t3-edu-school" contentEditable suppressContentEditableWarning>{award.meta}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="t3" style={{ padding: '48px 50px', height: '1122px', boxSizing: 'border-box', overflowWrap: 'break-word' }}>

            {/* Header — measured as a root-level block */}
            {shouldRender('header') && (
                <div className="t3-head" data-block-key="header" data-section-id="header" data-column="main">
                    <div className="t3-name" contentEditable suppressContentEditableWarning>{data.fullName}</div>
                    <div className="t3-title" contentEditable suppressContentEditableWarning>{data.headline}</div>
                    <div className="t3-contact">
                        {contacts.map((item, index) => (
                            <React.Fragment key={item}>
                                {index > 0 && <span className="t3-sep">·</span>}
                                <span contentEditable suppressContentEditableWarning>{item}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Two-column grid — main and sidebar as sibling sentinels */}
            <div className="t3-two-col">
                {/* Main content */}
                <div data-main="true">
                    {data.summary && (
                        <div className="t3-section">
                            {shouldRender('summary-title') && (
                                <div className="t3-section-title" data-section-title="true" data-section-id="summary" data-column="main" contentEditable suppressContentEditableWarning>
                                    {getTitle('summary', 'Profile')}
                                </div>
                            )}
                            {shouldRender('summary') && (
                                <div className="t3-summary" data-block-key="summary" data-section-id="summary" data-column="main" contentEditable suppressContentEditableWarning>
                                    {data.summary}
                                </div>
                            )}
                        </div>
                    )}

                    {data.experience.length > 0 && (
                        <div className="t3-section">
                            {shouldRender('experience-title') && (
                                <div className="t3-section-title" data-section-title="true" data-section-id="experience" data-column="main" contentEditable suppressContentEditableWarning>
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
                                    <div className="t3-job" key={`${job.company}-${index}`}>
                                        {isHeaderVisible ? (
                                            <div
                                                data-block-key={headerKey}
                                                data-section-id="experience"
                                                data-column="main"
                                            >
                                                <div className="t3-job-top">
                                                    <span className="t3-job-title" contentEditable suppressContentEditableWarning>{job.title}</span>
                                                    <span className="t3-job-date" contentEditable suppressContentEditableWarning>{job.dates}</span>
                                                </div>
                                                <div className="t3-job-company" contentEditable suppressContentEditableWarning>
                                                    {job.company}{job.location ? ` — ${job.location}` : ''}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="t3-job-company" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                                {job.company} (Continued)
                                            </div>
                                        )}
                                        {visibleBullets.length > 0 && (
                                            <ul className="t3-bullets">
                                                {job.bullets.map((b, bi) => {
                                                    const bulletKey = `${blockKey}-bullet-${bi}`;
                                                    if (!shouldRender(bulletKey)) return null;
                                                    return <li key={bi} data-block-key={bulletKey} data-section-id="experience" data-column="main" contentEditable suppressContentEditableWarning>{b}</li>;
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {data.projects.length > 0 && (
                        <div className="t3-section">
                            {shouldRender('projects-title') && (
                                <div className="t3-section-title" data-section-title="true" data-section-id="projects" data-column="main" contentEditable suppressContentEditableWarning>
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
                                    <div className="t3-job" key={`${project.name}-${index}`}>
                                        {isHeaderVisible ? (
                                            <div
                                                data-block-key={headerKey}
                                                data-section-id="projects"
                                                data-column="main"
                                            >
                                                <div className="t3-job-title" contentEditable suppressContentEditableWarning>{project.name}</div>
                                                {project.meta && <div className="t3-job-company" contentEditable suppressContentEditableWarning>{project.meta}</div>}
                                            </div>
                                        ) : (
                                            <div className="t3-job-company" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                                {project.name} (Continued)
                                            </div>
                                        )}
                                        {visibleBullets.length > 0 && (
                                            <ul className="t3-bullets">
                                                {project.bullets.map((b, bi) => {
                                                    const bulletKey = `${blockKey}-bullet-${bi}`;
                                                    if (!shouldRender(bulletKey)) return null;
                                                    return <li key={bi} data-block-key={bulletKey} data-section-id="projects" data-column="main" contentEditable suppressContentEditableWarning>{b}</li>;
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div data-sidebar="true">
                    {data.skills.length > 0 && (
                        <div className="t3-right-section">
                            {shouldRender('skills-title') && (
                                <div className="t3-section-title" data-section-title="true" data-section-id="skills" data-column="sidebar" contentEditable suppressContentEditableWarning>
                                    {getTitle('skills', 'Skills')}
                                </div>
                            )}
                            {data.skills.map((skill, index) => {
                                const blockKey = `skills-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                return (
                                    <span
                                        className="t3-skill"
                                        key={skill}
                                        data-block-key={blockKey}
                                        data-section-id="skills"
                                        data-column="sidebar"
                                        contentEditable
                                        suppressContentEditableWarning
                                    >
                                        {skill}
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {data.education.length > 0 && (
                        <div className="t3-right-section">
                            {shouldRender('education-title') && (
                                <div className="t3-section-title" data-section-title="true" data-section-id="education" data-column="sidebar" contentEditable suppressContentEditableWarning>
                                    {getTitle('education', 'Education')}
                                </div>
                            )}
                            {data.education.map((edu, index) => {
                                const blockKey = `education-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                return (
                                    <div className="t3-edu-item" key={`${edu.school}-${index}`} data-block-key={blockKey} data-section-id="education" data-column="sidebar">
                                        <div className="t3-edu-degree" contentEditable suppressContentEditableWarning>{edu.degree}</div>
                                        <div className="t3-edu-school" contentEditable suppressContentEditableWarning>{edu.school}</div>
                                        <div className="t3-edu-date" contentEditable suppressContentEditableWarning>{edu.dates}{edu.details ? ` — ${edu.details}` : ''}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {data.languages.length > 0 && (
                        <div className="t3-right-section">
                            {shouldRender('languages-title') && (
                                <div className="t3-section-title" data-section-title="true" data-section-id="languages" data-column="sidebar" contentEditable suppressContentEditableWarning>
                                    {getTitle('languages', 'Languages')}
                                </div>
                            )}
                            {data.languages.map((language, index) => {
                                const blockKey = `languages-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                const [name, level = ''] = language.split(' - ');
                                return (
                                    <div className="t3-lang" key={index} data-block-key={blockKey} data-section-id="languages" data-column="sidebar">
                                        <span contentEditable suppressContentEditableWarning>{name}</span>
                                        <span className="t3-lang-level" contentEditable suppressContentEditableWarning>{level}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {data.awards.length > 0 && (
                        <div className="t3-right-section">
                            {shouldRender('awards-title') && (
                                <div className="t3-section-title" data-section-title="true" data-section-id="awards" data-column="sidebar" contentEditable suppressContentEditableWarning>
                                    {getTitle('awards', 'Awards')}
                                </div>
                            )}
                            {data.awards.map((award, index) => {
                                const blockKey = `awards-${index}`;
                                if (!shouldRender(blockKey)) return null;
                                return (
                                    <div className="t3-edu-item" key={`award-${index}`} data-block-key={blockKey} data-section-id="awards" data-column="sidebar">
                                        <div className="t3-edu-degree" contentEditable suppressContentEditableWarning>{award.name}</div>
                                        <div className="t3-edu-school" contentEditable suppressContentEditableWarning>{award.meta}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ElegantCompact;
