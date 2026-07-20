import React from 'react';
import './TemplateStyles.css';
import type { ResumeData } from '../types/resume';
import { defaultResumeData } from '../types/resume';

type ClassicProfessionalProps = {
    data?: ResumeData;
    visibleBlockKeys?: Set<string>;
    pageIndex?: number;
    showContinuationLabels?: boolean;
    continuedSectionIds?: Set<string>;
};

const ClassicProfessional: React.FC<ClassicProfessionalProps> = ({
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

    const hasVisibleExperience = data.experience.some((job, index) => {
        const blockKey = `experience-${index}`;
        return shouldRender(`${blockKey}-header`) || job.bullets.some((_, bi) => shouldRender(`${blockKey}-bullet-${bi}`));
    });

    const hasVisibleProjects = data.projects.some((project, index) => {
        const blockKey = `projects-${index}`;
        return shouldRender(`${blockKey}-header`) || project.bullets.some((_, bi) => shouldRender(`${blockKey}-bullet-${bi}`));
    });

    const hasVisibleEducation = data.education.some((_, index) => shouldRender(`education-${index}`));
    const hasVisibleCertifications = data.certifications.some((_, index) => shouldRender(`certifications-${index}`));
    const hasVisibleLanguages = data.languages.length > 0 && shouldRender('languages');
    const hasVisibleSkills = data.skills.length > 0 && shouldRender('skills');

    const getTitle = (sectionId: string, defaultTitle: string) => {
        if (continuedSectionIds?.has(sectionId) && showContinuationLabels) {
            return `${defaultTitle} (Continued)`;
        }
        return defaultTitle;
    };

    const hrStyle = {
        border: 'none',
        borderTop: '1px solid #000',
        margin: '6px 0 14px 0',
        width: '100%',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontFamily: 'Georgia, serif',
        fontSize: '10.5pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        textAlign: 'center',
        color: '#111',
        marginTop: '16px',
        marginBottom: '6px',
    };

    const jobTitleStyle: React.CSSProperties = {
        fontWeight: 700,
        fontSize: '9.5pt',
        color: '#111',
        fontFamily: 'Arial, sans-serif',
    };

    const textStyle: React.CSSProperties = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '9pt',
        lineHeight: 1.45,
        color: '#333',
    };

    return (
        <div 
            className="t-classic" 
            style={{ 
                fontFamily: 'Georgia, serif',
                fontSize: '10pt',
                lineHeight: 1.5,
                color: '#111',
                backgroundColor: '#fff',
                width: '794px',
                height: '1122px', 
                padding: '48px 52px', 
                boxSizing: 'border-box', 
                overflowWrap: 'break-word',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header */}
            {shouldRender('header') && (
                <div data-block-key="header" data-section-id="header" data-column="main" style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <div 
                        className="t-name" 
                        style={{ fontSize: '24pt', fontWeight: 700, fontFamily: 'Georgia, serif', letterSpacing: '0.03em', textTransform: 'uppercase', color: '#000', marginBottom: '4px' }}
                        contentEditable 
                        suppressContentEditableWarning
                    >
                        {data.fullName}
                    </div>
                    {data.headline && (
                        <div 
                            style={{ fontSize: '10pt', fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {data.headline}
                        </div>
                    )}
                    <div 
                        style={{ 
                            fontSize: '8.5pt', 
                            color: '#444', 
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            display: 'inline-flex', 
                            gap: '10px', 
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            fontFamily: 'Arial, sans-serif'
                        }}
                    >
                        {contacts.map((item, idx) => (
                            <React.Fragment key={item}>
                                {idx > 0 && <span style={{ color: '#cbd5e1' }}>•</span>}
                                <span contentEditable suppressContentEditableWarning>{item}</span>
                            </React.Fragment>
                        ))}
                    </div>
                    <hr style={hrStyle} />
                </div>
            )}

            {/* Summary */}
            {data.summary && shouldRender('summary') && (
                <div style={{ marginBottom: '16px' }}>
                    {shouldRender('summary-title') && (
                        <div 
                            style={sectionTitleStyle}
                            data-section-title="true" 
                            data-section-id="summary" 
                            data-column="main"
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {getTitle('summary', 'Professional Summary')}
                        </div>
                    )}
                    <div 
                        data-block-key="summary" 
                        data-section-id="summary" 
                        data-column="main"
                        style={{ ...textStyle, textAlign: 'justify' }}
                        contentEditable 
                        suppressContentEditableWarning
                    >
                        {data.summary}
                    </div>
                    <hr style={hrStyle} />
                </div>
            )}

            {/* Experience */}
            {hasVisibleExperience && (
                <div style={{ marginBottom: '16px' }}>
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
                                            <span style={{ fontSize: '8.5pt', fontWeight: 'bold', color: '#333', fontFamily: 'Arial, sans-serif' }} contentEditable suppressContentEditableWarning>{job.dates}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontStyle: 'italic', fontSize: '9pt', color: '#555', fontFamily: 'Arial, sans-serif', marginBottom: '4px' }}>
                                            <span contentEditable suppressContentEditableWarning>{job.company}</span>
                                            {job.location && <span contentEditable suppressContentEditableWarning>{job.location}</span>}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ fontStyle: 'italic', fontSize: '9pt', color: '#555', fontFamily: 'Arial, sans-serif', marginBottom: '4px' }}>
                                        {job.company} (Continued)
                                    </div>
                                )}

                                {visibleBullets.length > 0 && (
                                    <ul style={{ paddingLeft: '18px', margin: '0', listStyleType: 'disc' }}>
                                        {job.bullets.map((bullet, bi) => {
                                            const bulletKey = `${blockKey}-bullet-${bi}`;
                                            if (!shouldRender(bulletKey)) return null;
                                            return (
                                                <li 
                                                    key={bi} 
                                                    data-block-key={bulletKey} 
                                                    data-section-id="experience" 
                                                    data-column="main"
                                                    style={{ ...textStyle, marginBottom: '3px' }}
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
                    <hr style={hrStyle} />
                </div>
            )}

            {/* Projects */}
            {hasVisibleProjects && (
                <div style={{ marginBottom: '16px' }}>
                    {shouldRender('projects-title') && (
                        <div 
                            style={sectionTitleStyle}
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
                            <div key={index} style={{ marginBottom: '12px' }}>
                                {isHeaderVisible ? (
                                    <div data-block-key={headerKey} data-section-id="projects" data-column="main">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                            <span style={jobTitleStyle} contentEditable suppressContentEditableWarning>{project.name}</span>
                                        </div>
                                        {project.meta && (
                                            <div style={{ fontStyle: 'italic', fontSize: '9pt', color: '#555', fontFamily: 'Arial, sans-serif', marginBottom: '4px' }} contentEditable suppressContentEditableWarning>
                                                {project.meta}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ fontStyle: 'italic', fontSize: '9pt', color: '#555', fontFamily: 'Arial, sans-serif', marginBottom: '4px' }}>
                                        {project.name} (Continued)
                                    </div>
                                )}

                                {visibleBullets.length > 0 && (
                                    <ul style={{ paddingLeft: '18px', margin: '0', listStyleType: 'disc' }}>
                                        {project.bullets.map((bullet, bi) => {
                                            const bulletKey = `${blockKey}-bullet-${bi}`;
                                            if (!shouldRender(bulletKey)) return null;
                                            return (
                                                <li 
                                                    key={bi} 
                                                    data-block-key={bulletKey} 
                                                    data-section-id="projects" 
                                                    data-column="main"
                                                    style={{ ...textStyle, marginBottom: '3px' }}
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
                    <hr style={hrStyle} />
                </div>
            )}

            {/* Skills */}
            {hasVisibleSkills && (
                <div style={{ marginBottom: '16px' }}>
                    {shouldRender('skills-title') && (
                        <div 
                            style={sectionTitleStyle}
                            data-section-title="true" 
                            data-section-id="skills" 
                            data-column="main"
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {getTitle('skills', 'Skills & Expertises')}
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
                                justifyContent: 'center',
                                marginTop: '4px'
                            }}
                        >
                            {data.skills.map((skill) => (
                                <span 
                                    key={skill} 
                                    style={{ 
                                        fontFamily: 'Arial, sans-serif', 
                                        fontSize: '8.5pt', 
                                        color: '#222', 
                                        backgroundColor: '#f1f5f9',
                                        border: '1px solid #e2e8f0',
                                        padding: '3px 10px',
                                        borderRadius: '4px',
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
                    <hr style={hrStyle} />
                </div>
            )}

            {/* Education */}
            {hasVisibleEducation && (
                <div style={{ marginBottom: '16px' }}>
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
                                    <span style={{ fontWeight: 700, fontSize: '9.5pt', fontFamily: 'Arial, sans-serif' }} contentEditable suppressContentEditableWarning>{edu.degree}</span>
                                    <span style={{ fontSize: '8.5pt', color: '#666', fontFamily: 'Arial, sans-serif' }} contentEditable suppressContentEditableWarning>{edu.dates}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', fontSize: '9pt', color: '#444', fontFamily: 'Arial, sans-serif' }}>
                                    <span contentEditable suppressContentEditableWarning>{edu.school}</span>
                                    {edu.details && <span contentEditable suppressContentEditableWarning>{` — ${edu.details}`}</span>}
                                </div>
                            </div>
                        );
                    })}
                    <hr style={hrStyle} />
                </div>
            )}

            {/* Extra Sections (Certifications, Languages) */}
            {(hasVisibleCertifications || hasVisibleLanguages) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '8px' }}>
                {/* Certifications */}
                {hasVisibleCertifications && (
                    <div style={{ marginBottom: '12px' }}>
                        {shouldRender('certifications-title') && (
                            <div 
                                style={{ ...sectionTitleStyle, fontSize: '9.5pt', textAlign: 'left', marginTop: '0', borderBottom: '1px solid #eee', paddingBottom: '3px' }}
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
                                    style={{ fontSize: '8.5pt', fontFamily: 'Arial, sans-serif', color: '#333', marginBottom: '4px' }}
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
                {hasVisibleLanguages && (
                    <div style={{ marginBottom: '12px' }}>
                        {shouldRender('languages-title') && (
                            <div 
                                style={{ ...sectionTitleStyle, fontSize: '9.5pt', textAlign: 'left', marginTop: '0', borderBottom: '1px solid #eee', paddingBottom: '3px' }}
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
                                style={{ fontSize: '8.5pt', fontFamily: 'Arial, sans-serif', color: '#333' }}
                                contentEditable 
                                suppressContentEditableWarning
                            >
                                {data.languages.join(' · ')}
                            </div>
                        )}
                    </div>
                )}
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
                            <div 
                                style={{ ...sectionTitleStyle, borderTop: '1px solid #000', paddingTop: '8px' }}
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
                                    key={index} 
                                    data-block-key={blockKey} 
                                    data-section-id="awards" 
                                    data-column="main"
                                    style={{ marginBottom: '6px', textAlign: 'center' }}
                                >
                                    <span style={{ fontWeight: 700, fontSize: '9pt', fontFamily: 'Arial, sans-serif' }} contentEditable suppressContentEditableWarning>{award.name}</span>
                                    {award.meta && <span style={{ fontStyle: 'italic', fontSize: '8.5pt', color: '#555', fontFamily: 'Arial, sans-serif', marginLeft: '6px' }} contentEditable suppressContentEditableWarning>({award.meta})</span>}
                                </div>
                            );
                        })}
                    </div>
                );
            })()}
        </div>
    );
};

export default ClassicProfessional;
