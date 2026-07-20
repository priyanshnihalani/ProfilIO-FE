import React from 'react';
import './TemplateStyles.css';
import type { ResumeData } from '../types/resume';
import { defaultResumeData } from '../types/resume';

type TheMonolithProps = {
    data?: ResumeData;
    visibleBlockKeys?: Set<string>;
    pageIndex?: number;
    showContinuationLabels?: boolean;
    continuedSectionIds?: Set<string>;
};

const TheMonolith: React.FC<TheMonolithProps> = ({
    data = defaultResumeData,
    visibleBlockKeys,
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

    return (
        <div className="t4" style={{ padding: '48px 50px', height: '1122px', boxSizing: 'border-box' }}>

            {shouldRender('header') && (
                <div className="t4-head" data-block-key="header" data-section-id="header" data-column="main">
                    <div className="t4-name" contentEditable suppressContentEditableWarning>{data.fullName}</div>
                    <div className="t4-title" contentEditable suppressContentEditableWarning>{data.headline}</div>
                    <div className="t4-contact">
                        {contacts.map((item) => (
                            <span key={item} contentEditable suppressContentEditableWarning>{item}</span>
                        ))}
                    </div>
                </div>
            )}

            {data.summary && shouldRender('summary') && (
                <div
                    className="t4-summary"
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
                <div className="t4-section">
                    {shouldRender('experience-title') && (
                        <div className="t4-section-title" data-section-title="true" data-section-id="experience" data-column="main" contentEditable suppressContentEditableWarning>
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
                            <div className="t4-job" key={`${job.company}-${index}`}>
                                {isHeaderVisible ? (
                                    <div
                                        data-block-key={headerKey}
                                        data-section-id="experience"
                                        data-column="main"
                                    >
                                        <div className="t4-job-title" contentEditable suppressContentEditableWarning>{job.company}</div>
                                        <div className="t4-job-meta" contentEditable suppressContentEditableWarning>{job.title} · {job.dates}</div>
                                        <div className="t4-job-divider" />
                                    </div>
                                ) : (
                                    <div className="t4-job-meta" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                        <strong>{job.company}</strong> (Continued)
                                    </div>
                                )}

                                {visibleBullets.length > 0 && (
                                    <ul className="t4-bullets">
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
                <div className="t4-section">
                    {shouldRender('projects-title') && (
                        <div className="t4-section-title" data-section-title="true" data-section-id="projects" data-column="main" contentEditable suppressContentEditableWarning>
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
                            <div className="t4-job" key={`${project.name}-${index}`}>
                                {isHeaderVisible ? (
                                    <div
                                        data-block-key={headerKey}
                                        data-section-id="projects"
                                        data-column="main"
                                    >
                                        <div className="t4-job-title" contentEditable suppressContentEditableWarning>{project.name}</div>
                                        {project.meta && <div className="t4-job-meta" contentEditable suppressContentEditableWarning>{project.meta}</div>}
                                        <div className="t4-job-divider" />
                                    </div>
                                ) : (
                                    <div className="t4-job-meta" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                        <strong>{project.name}</strong> (Continued)
                                    </div>
                                )}

                                {visibleBullets.length > 0 && (
                                    <ul className="t4-bullets">
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
                <div className="t4-section">
                    {shouldRender('education-title') && (
                        <div className="t4-section-title" data-section-title="true" data-section-id="education" data-column="main" contentEditable suppressContentEditableWarning>
                            {getTitle('education', 'Education')}
                        </div>
                    )}
                    {data.education.map((edu, index) => {
                        const blockKey = `education-${index}`;
                        if (!shouldRender(blockKey)) return null;
                        return (
                            <div className="t4-edu-item" key={`${edu.school}-${index}`} data-block-key={blockKey} data-section-id="education" data-column="main">
                                <div className="t4-edu-degree" contentEditable suppressContentEditableWarning>{edu.school}</div>
                                <div className="t4-edu-meta" contentEditable suppressContentEditableWarning>
                                    {edu.degree}{edu.details ? ` — ${edu.details}` : ''} · {edu.dates}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {data.skills.length > 0 && (
                <div className="t4-section">
                    {shouldRender('skills-title') && (
                        <div className="t4-section-title" data-section-title="true" data-section-id="skills" data-column="main" contentEditable suppressContentEditableWarning>
                            {getTitle('skills', 'Skills')}
                        </div>
                    )}
                    {/* Skills as one atomic block — tag list wraps naturally */}
                    {shouldRender('skills') && (
                        <div className="t4-skills-list" data-block-key="skills" data-section-id="skills" data-column="main">
                            {data.skills.map((skill) => (
                                <span className="t4-skill" key={skill} contentEditable suppressContentEditableWarning>{skill}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {data.certifications.length > 0 && (
                <div className="t4-section">
                    {shouldRender('certifications-title') && (
                        <div className="t4-section-title" data-section-title="true" data-section-id="certifications" data-column="main" contentEditable suppressContentEditableWarning>
                            {getTitle('certifications', 'Certifications')}
                        </div>
                    )}
                    {/* Individual certification blocks so pagination can split long lists */}
                    {data.certifications.map((cert, index) => {
                        const blockKey = `certifications-${index}`;
                        if (!shouldRender(blockKey)) return null;
                        return (
                            <div
                                key={index}
                                data-block-key={blockKey}
                                data-section-id="certifications"
                                data-column="main"
                                style={{ textAlign: 'center', fontSize: '9.5pt', color: '#444', marginBottom: '6px' }}
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
                <div className="t4-section">
                    {shouldRender('languages-title') && (
                        <div className="t4-section-title" data-section-title="true" data-section-id="languages" data-column="main" contentEditable suppressContentEditableWarning>
                            {getTitle('languages', 'Languages')}
                        </div>
                    )}
                    {shouldRender('languages') && (
                        <div
                            data-block-key="languages"
                            data-section-id="languages"
                            data-column="main"
                            style={{ textAlign: 'center', fontSize: '9.5pt', color: '#444' }}
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
                    <div className="t4-section">
                        {hasTitle && (
                            <div className="t4-section-title" data-section-title="true" data-section-id="awards" data-column="main" contentEditable suppressContentEditableWarning>
                                {getTitle('awards', 'Awards & Honors')}
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
                                    style={{ textAlign: 'center', fontSize: '9.5pt', color: '#444', marginBottom: '6px' }}
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
    );
};

export default TheMonolith;
