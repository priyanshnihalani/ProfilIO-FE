import React from 'react';
import './TemplateStyles.css';
import type { ResumeData } from '../types/resume';
import { defaultResumeData } from '../types/resume';

type TheHorizonProps = {
    data?: ResumeData;
    visibleBlockKeys?: Set<string>;
    pageIndex?: number;
    showContinuationLabels?: boolean;
    continuedSectionIds?: Set<string>;
};

const TheHorizon: React.FC<TheHorizonProps> = ({
    data = defaultResumeData,
    visibleBlockKeys,
    pageIndex = 0,
    showContinuationLabels = true,
    continuedSectionIds,
}) => {
    const contacts = [data.email, data.phone, data.location, ...data.links]
        .filter(Boolean)
        .filter((item, index, arr) => arr.indexOf(item) === index);

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

    // On continuation pages (pageIndex > 0) we skip the dark header band
    // to avoid it repeating on every page and wasting space.
    const showHeader = pageIndex === 0;

    return (
        <div
            className="t6"
            style={{
                width: '794px',
                height: '1122px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                background: 'white',
            }}
        >
            {/* Dark header — only on page 1 */}
            {showHeader && shouldRender('header') && (
                <div className="t6-header" data-block-key="header" data-section-id="header" data-column="main">
                    <div className="t6-name" contentEditable suppressContentEditableWarning>{data.fullName}</div>
                    <div className="t6-title" contentEditable suppressContentEditableWarning>{data.headline}</div>
                    <div className="t6-contact">
                        {contacts.map((item) => (
                            <span key={item} contentEditable suppressContentEditableWarning>{item}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Scrollable body — flex: 1 ensures it fills remaining height */}
            <div className="t6-body" style={{ flex: 1, padding: showHeader ? '32px 50px 40px' : '48px 50px 40px', boxSizing: 'border-box' }}>

                {data.summary && shouldRender('summary') && (
                    <div
                        className="t6-summary"
                        data-block-key="summary"
                        data-section-id="summary"
                        data-column="main"
                        contentEditable
                        suppressContentEditableWarning
                    >
                        {data.summary}
                    </div>
                )}

                {data.experience.length > 0 && (
                    <div className="t6-section">
                        {shouldRender('experience-title') && (
                            <div className="t6-section-head" data-section-title="true" data-section-id="experience" data-column="main">
                                <div className="t6-section-title" contentEditable suppressContentEditableWarning>
                                    {getTitle('experience', 'Experience')}
                                </div>
                                <div className="t6-section-line" />
                            </div>
                        )}
                        {data.experience.map((job, index) => {
                            const blockKey = `experience-${index}`;
                            const headerKey = `${blockKey}-header`;
                            const isHeaderVisible = shouldRender(headerKey);
                            const visibleBullets = job.bullets.filter((_, bi) => shouldRender(`${blockKey}-bullet-${bi}`));

                            if (!isHeaderVisible && visibleBullets.length === 0) return null;

                            return (
                                <div className="t6-job" key={`${job.company}-${index}`}>
                                    {isHeaderVisible ? (
                                        <div
                                            data-block-key={headerKey}
                                            data-section-id="experience"
                                            data-column="main"
                                        >
                                            <div className="t6-job-header">
                                                <span className="t6-job-title" contentEditable suppressContentEditableWarning>{job.title}</span>
                                                <span className="t6-job-date" contentEditable suppressContentEditableWarning>{job.dates}</span>
                                            </div>
                                            <div className="t6-job-company" contentEditable suppressContentEditableWarning>{job.company}</div>
                                        </div>
                                    ) : (
                                        <div className="t6-job-company" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                            {job.company} (Continued)
                                        </div>
                                    )}

                                    {visibleBullets.length > 0 && (
                                        <ul className="t6-bullets">
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
                    <div className="t6-section">
                        {shouldRender('projects-title') && (
                            <div className="t6-section-head" data-section-title="true" data-section-id="projects" data-column="main">
                                <div className="t6-section-title" contentEditable suppressContentEditableWarning>
                                    {getTitle('projects', 'Projects')}
                                </div>
                                <div className="t6-section-line" />
                            </div>
                        )}
                        {data.projects.map((project, index) => {
                            const blockKey = `projects-${index}`;
                            const headerKey = `${blockKey}-header`;
                            const isHeaderVisible = shouldRender(headerKey);
                            const visibleBullets = project.bullets.filter((_, bi) => shouldRender(`${blockKey}-bullet-${bi}`));

                            if (!isHeaderVisible && visibleBullets.length === 0) return null;

                            return (
                                <div className="t6-job" key={`${project.name}-${index}`}>
                                    {isHeaderVisible ? (
                                        <div
                                            data-block-key={headerKey}
                                            data-section-id="projects"
                                            data-column="main"
                                        >
                                            <div className="t6-job-header">
                                                <span className="t6-job-title" contentEditable suppressContentEditableWarning>{project.name}</span>
                                            </div>
                                            {project.meta && (
                                                <div className="t6-job-company" contentEditable suppressContentEditableWarning>{project.meta}</div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="t6-job-company" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                            {project.name} (Continued)
                                        </div>
                                    )}

                                    {visibleBullets.length > 0 && (
                                        <ul className="t6-bullets">
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
                    <div className="t6-section">
                        {shouldRender('education-title') && (
                            <div className="t6-section-head" data-section-title="true" data-section-id="education" data-column="main">
                                <div className="t6-section-title" contentEditable suppressContentEditableWarning>
                                    {getTitle('education', 'Education')}
                                </div>
                                <div className="t6-section-line" />
                            </div>
                        )}
                        {data.education.map((edu, index) => {
                            const blockKey = `education-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div className="t6-edu-item" key={`${edu.school}-${index}`} data-block-key={blockKey} data-section-id="education" data-column="main">
                                    <div className="t6-edu-degree" contentEditable suppressContentEditableWarning>{edu.degree}</div>
                                    <div className="t6-edu-school" contentEditable suppressContentEditableWarning>
                                        {edu.school}{edu.details ? ` — ${edu.details}` : ''} · {edu.dates}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.skills.length > 0 && (
                    <div className="t6-section">
                        {shouldRender('skills-title') && (
                            <div className="t6-section-head" data-section-title="true" data-section-id="skills" data-column="main">
                                <div className="t6-section-title" contentEditable suppressContentEditableWarning>
                                    {getTitle('skills', 'Technical Skills')}
                                </div>
                                <div className="t6-section-line" />
                            </div>
                        )}
                        {shouldRender('skills') && (
                            <div className="t6-skills" data-block-key="skills" data-section-id="skills" data-column="main">
                                {data.skills.map((skill) => (
                                    <span className="t6-skill" key={skill} contentEditable suppressContentEditableWarning>{skill}</span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {data.certifications.length > 0 && (
                    <div className="t6-section">
                        {shouldRender('certifications-title') && (
                            <div className="t6-section-head" data-section-title="true" data-section-id="certifications" data-column="main">
                                <div className="t6-section-title" contentEditable suppressContentEditableWarning>
                                    {getTitle('certifications', 'Certifications')}
                                </div>
                                <div className="t6-section-line" />
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
                                    style={{ fontSize: '9.5pt', color: '#444', marginBottom: '6px', paddingLeft: '18px' }}
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
                    <div className="t6-section">
                        {shouldRender('languages-title') && (
                            <div className="t6-section-head" data-section-title="true" data-section-id="languages" data-column="main">
                                <div className="t6-section-title" contentEditable suppressContentEditableWarning>
                                    {getTitle('languages', 'Languages')}
                                </div>
                                <div className="t6-section-line" />
                            </div>
                        )}
                        {shouldRender('languages') && (
                            <div
                                data-block-key="languages"
                                data-section-id="languages"
                                data-column="main"
                                style={{ fontSize: '9.5pt', color: '#444', paddingLeft: '18px' }}
                                contentEditable
                                suppressContentEditableWarning
                            >
                                {data.languages.join(' · ')}
                            </div>
                        )}
                    </div>
                )}

                {/* Awards */}
                {(() => {
                    const hasVisibleAwards = data.awards && data.awards.length > 0 && data.awards.some((_, i) => shouldRender(`awards-${i}`));
                    const hasTitle = shouldRender('awards-title');
                    if (!hasVisibleAwards) return null;
                    return (
                        <div className="t6-section">
                            {hasTitle && (
                                <div className="t6-section-head" data-section-title="true" data-section-id="awards" data-column="main">
                                    <div className="t6-section-title" contentEditable suppressContentEditableWarning>
                                        {getTitle('awards', 'Awards & Honors')}
                                    </div>
                                    <div className="t6-section-line" />
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
                                        style={{ fontSize: '9.5pt', color: '#444', marginBottom: '6px', paddingLeft: '18px' }}
                                    >
                                        <strong>{award.name}</strong>
                                        {award.meta && <span style={{ fontStyle: 'italic', marginLeft: '6px', fontSize: '9pt', color: '#666' }}>({award.meta})</span>}
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

export default TheHorizon;
