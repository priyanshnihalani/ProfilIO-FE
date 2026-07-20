import React from 'react';
import './TemplateStyles.css';
import type { ResumeData } from '../types/resume';
import { defaultResumeData } from '../types/resume';

type MinimalCleanProps = {
    data?: ResumeData;
    visibleBlockKeys?: Set<string>;
    pageIndex?: number;
    showContinuationLabels?: boolean;
    continuedSectionIds?: Set<string>;
};

const MinimalClean: React.FC<MinimalCleanProps> = ({
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

    return (
        <div className="t1" style={{ padding: '48px 50px', height: '1122px', boxSizing: 'border-box', overflowWrap: 'break-word' }}>

            {/* Header */}
            {shouldRender('header') && (
                <div data-block-key="header" data-section-id="header" data-column="main">
                    <div className="t1-name" contentEditable suppressContentEditableWarning>{data.fullName}</div>
                    <div className="t1-contact">
                        {contacts.map((item) => (
                            <span key={item} contentEditable suppressContentEditableWarning>{item}</span>
                        ))}
                    </div>
                    <hr className="t1-divider" />
                </div>
            )}

            {/* Summary */}
            {data.summary && shouldRender('summary') && (
                <div
                    className="t1-summary"
                    data-block-key="summary"
                    data-section-id="summary"
                    data-column="main"
                    contentEditable
                    suppressContentEditableWarning
                >
                    {data.summary}
                </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <div className="t1-section">
                    {shouldRender('experience-title') && (
                        <div
                            className="t1-section-title"
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
                            <div className="t1-job" key={`${job.company}-${job.title}-${index}`}>
                                {isHeaderVisible ? (
                                    <div
                                        data-block-key={headerKey}
                                        data-section-id="experience"
                                        data-column="main"
                                    >
                                        <div className="t1-job-header">
                                            <span className="t1-job-title" contentEditable suppressContentEditableWarning>{job.title}</span>
                                            <span className="t1-job-date" contentEditable suppressContentEditableWarning>{job.dates}</span>
                                        </div>
                                        <div className="t1-job-company" contentEditable suppressContentEditableWarning>
                                            {job.company}{job.location ? ` — ${job.location}` : ''}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="t1-job-company" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                        {job.company} (Continued)
                                    </div>
                                )}

                                {visibleBullets.length > 0 && (
                                    <ul className="t1-job-bullets">
                                        {job.bullets.map((bullet, bi) => {
                                            const bulletKey = `${blockKey}-bullet-${bi}`;
                                            if (!shouldRender(bulletKey)) return null;
                                            return (
                                                <li
                                                    key={bi}
                                                    data-block-key={bulletKey}
                                                    data-section-id="experience"
                                                    data-column="main"
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
                <div className="t1-section">
                    {shouldRender('projects-title') && (
                        <div
                            className="t1-section-title"
                            data-section-title="true"
                            data-section-id="projects"
                            data-column="main"
                            contentEditable
                            suppressContentEditableWarning
                        >
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
                            <div className="t1-job" key={`${project.name}-${index}`}>
                                {isHeaderVisible ? (
                                    <div
                                        data-block-key={headerKey}
                                        data-section-id="projects"
                                        data-column="main"
                                    >
                                        <div className="t1-job-header">
                                            <span className="t1-job-title" contentEditable suppressContentEditableWarning>{project.name}</span>
                                        </div>
                                        {project.meta && (
                                            <div className="t1-job-company" contentEditable suppressContentEditableWarning>{project.meta}</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="t1-job-company" style={{ fontStyle: 'italic', color: '#555', marginBottom: '3px' }}>
                                        {project.name} (Continued)
                                    </div>
                                )}

                                {visibleBullets.length > 0 && (
                                    <ul className="t1-job-bullets">
                                        {project.bullets.map((bullet, bi) => {
                                            const bulletKey = `${blockKey}-bullet-${bi}`;
                                            if (!shouldRender(bulletKey)) return null;
                                            return (
                                                <li
                                                    key={bi}
                                                    data-block-key={bulletKey}
                                                    data-section-id="projects"
                                                    data-column="main"
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
                <div className="t1-section">
                    {shouldRender('skills-title') && (
                        <div
                            className="t1-section-title"
                            data-section-title="true"
                            data-section-id="skills"
                            data-column="main"
                            contentEditable
                            suppressContentEditableWarning
                        >
                            {getTitle('skills', 'Skills')}
                        </div>
                    )}
                    {shouldRender('skills') && (
                        <div
                            className="t1-skills-list"
                            data-block-key="skills"
                            data-section-id="skills"
                            data-column="main"
                        >
                            {data.skills.map((skill) => (
                                <span className="t1-skill" key={skill} contentEditable suppressContentEditableWarning>{skill}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <div className="t1-section">
                    {shouldRender('education-title') && (
                        <div
                            className="t1-section-title"
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
                                key={`${edu.school}-${index}`}
                                data-block-key={blockKey}
                                data-section-id="education"
                                data-column="main"
                                style={{ marginBottom: '10px' }}
                            >
                                <div className="t1-edu-row">
                                    <span className="t1-edu-degree" contentEditable suppressContentEditableWarning>{edu.degree}</span>
                                    <span className="t1-job-date" contentEditable suppressContentEditableWarning>{edu.dates}</span>
                                </div>
                                <div className="t1-edu-school" contentEditable suppressContentEditableWarning>
                                    {edu.school}{edu.details ? ` — ${edu.details}` : ''}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
                <div className="t1-section">
                    {shouldRender('certifications-title') && (
                        <div
                            className="t1-section-title"
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
                                key={`cert-${index}`}
                                data-block-key={blockKey}
                                data-section-id="certifications"
                                data-column="main"
                                style={{ fontSize: '9.5pt', color: '#333', marginBottom: '4px' }}
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
                <div className="t1-section">
                    {shouldRender('languages-title') && (
                        <div
                            className="t1-section-title"
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
                            style={{ fontSize: '9.5pt', color: '#333' }}
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
                const hasVisibleAwards = data.awards.some((_, i) => shouldRender(`awards-${i}`));
                const hasTitle = shouldRender('awards-title');
                if (!hasVisibleAwards && !hasTitle) return null;
                // Don't render if only the title is visible but no actual award blocks
                if (!hasVisibleAwards) return null;
                return (
                    <div className="t1-section">
                        {hasTitle && (
                            <div
                                className="t1-section-title"
                                data-section-title="true"
                                data-section-id="awards"
                                data-column="main"
                                contentEditable
                                suppressContentEditableWarning
                            >
                                {getTitle('awards', 'Awards & Honors')}
                            </div>
                        )}
                        {data.awards.map((award, index) => {
                            const blockKey = `awards-${index}`;
                            if (!shouldRender(blockKey)) return null;
                            return (
                                <div
                                    key={`award-${index}`}
                                    data-block-key={blockKey}
                                    data-section-id="awards"
                                    data-column="main"
                                    style={{ marginBottom: '8px' }}
                                >
                                    <div style={{ fontWeight: 700, fontSize: '10pt' }} contentEditable suppressContentEditableWarning>
                                        {award.name}
                                    </div>
                                    {award.meta && (
                                        <div style={{ fontSize: '9pt', color: '#555', fontStyle: 'italic' }} contentEditable suppressContentEditableWarning>
                                            {award.meta}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })()}
        </div>
    );
};

export default MinimalClean;
