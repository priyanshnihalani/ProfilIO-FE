import React from 'react';
import './TemplateStyles.css';
import type { ResumeData } from '../types/resume';
import { defaultResumeData } from '../types/resume';

type TraditionalSerifProps = {
    data?: ResumeData;
    visibleBlockKeys?: Set<string>;
    pageIndex?: number;
    showContinuationLabels?: boolean;
    continuedSectionIds?: Set<string>;
};

const TraditionalSerif: React.FC<TraditionalSerifProps> = ({
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

    const headerLineStyle = {
        border: 'none',
        borderTop: '1px solid #111111',
        margin: '4px 0',
        width: '100%',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontFamily: 'Georgia, serif',
        fontSize: '9.5pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#000000',
        marginTop: '16px',
        marginBottom: '6px',
        borderBottom: '1px solid #111111',
        paddingBottom: '2px',
    };

    const jobTitleStyle: React.CSSProperties = {
        fontWeight: 400,
        fontStyle: 'italic',
        fontSize: '9.5pt',
        color: '#111111',
        fontFamily: 'Georgia, serif',
    };

    const textStyle: React.CSSProperties = {
        fontFamily: 'Georgia, serif',
        fontSize: '9.5pt',
        lineHeight: 1.4,
        color: '#111111',
    };

    return (
        <div 
            style={{ 
                fontFamily: 'Georgia, serif',
                fontSize: '10pt',
                lineHeight: 1.45,
                color: '#000000',
                backgroundColor: '#ffffff',
                width: '794px',
                height: '1122px', 
                padding: '50px 56px', 
                boxSizing: 'border-box', 
                overflowWrap: 'break-word',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header */}
            {shouldRender('header') && (
                <div data-block-key="header" data-section-id="header" data-column="main" style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <div 
                        style={{ fontSize: '22pt', fontWeight: 700, fontFamily: 'Georgia, serif', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#000000', marginBottom: '4px' }}
                        contentEditable 
                        suppressContentEditableWarning
                    >
                        {data.fullName}
                    </div>
                    {data.headline && (
                        <div 
                            style={{ fontSize: '9pt', fontStyle: 'italic', color: '#333333', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            {data.headline}
                        </div>
                    )}
                    <hr style={headerLineStyle} />
                    <div 
                        style={{ 
                            fontSize: '8.5pt', 
                            color: '#111111', 
                            display: 'inline-flex', 
                            gap: '8px', 
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            fontFamily: 'Georgia, serif',
                            padding: '2px 0'
                        }}
                    >
                        {contacts.map((item, idx) => (
                            <React.Fragment key={item}>
                                {idx > 0 && <span style={{ color: '#000000' }}>|</span>}
                                <span contentEditable suppressContentEditableWarning>{item}</span>
                            </React.Fragment>
                        ))}
                    </div>
                    <hr style={headerLineStyle} />
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
                            <div key={index} style={{ marginBottom: '12px' }}>
                                {isHeaderVisible ? (
                                    <div data-block-key={headerKey} data-section-id="experience" data-column="main">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '10pt' }} contentEditable suppressContentEditableWarning>{job.company}</span>
                                            <span style={{ fontSize: '9pt', fontWeight: 'bold' }} contentEditable suppressContentEditableWarning>{job.dates}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                            <span style={jobTitleStyle} contentEditable suppressContentEditableWarning>{job.title}</span>
                                            {job.location && <span style={{ fontSize: '9.5pt' }} contentEditable suppressContentEditableWarning>{job.location}</span>}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ fontStyle: 'italic', fontSize: '9.5pt', color: '#111111', marginBottom: '4px' }}>
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
                                            <span style={{ fontWeight: 'bold', fontSize: '10pt' }} contentEditable suppressContentEditableWarning>{project.name}</span>
                                        </div>
                                        {project.meta && (
                                            <div style={{ fontStyle: 'italic', fontSize: '9.5pt', marginBottom: '4px' }} contentEditable suppressContentEditableWarning>
                                                {project.meta}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ fontStyle: 'italic', fontSize: '9.5pt', marginBottom: '4px' }}>
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
                                    <span style={{ fontWeight: 700, fontSize: '10pt' }} contentEditable suppressContentEditableWarning>{edu.school}</span>
                                    <span style={{ fontSize: '9pt', fontWeight: 'bold' }} contentEditable suppressContentEditableWarning>{edu.dates}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <span style={jobTitleStyle} contentEditable suppressContentEditableWarning>{edu.degree}</span>
                                    {edu.details && <span style={{ fontSize: '9.5pt' }} contentEditable suppressContentEditableWarning>{edu.details}</span>}
                                </div>
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
                            {getTitle('skills', 'Skills & Interests')}
                        </div>
                    )}
                    {shouldRender('skills') && (
                        <div 
                            data-block-key="skills" 
                            data-section-id="skills" 
                            data-column="main"
                            style={textStyle}
                            contentEditable 
                            suppressContentEditableWarning
                        >
                            <strong>Skills:</strong> {data.skills.join(', ')}
                        </div>
                    )}
                </div>
            )}

            {/* Certifications & Languages Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Certifications */}
                {data.certifications.length > 0 && (
                    <div>
                        {shouldRender('certifications-title') && (
                            <div 
                                style={{ ...sectionTitleStyle, fontSize: '9pt', marginTop: '8px' }}
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
                                    style={textStyle}
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
                                style={{ ...sectionTitleStyle, fontSize: '9pt', marginTop: '8px' }}
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
                                style={textStyle}
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
                    <div style={{ marginTop: '10px' }}>
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
                                    style={{ ...textStyle, marginBottom: '4px' }}
                                >
                                    <strong>{award.name}</strong>
                                    {award.meta && <span style={{ fontStyle: 'italic', marginLeft: '6px' }}>({award.meta})</span>}
                                </div>
                            );
                        })}
                    </div>
                );
            })()}
        </div>
    );
};

export default TraditionalSerif;
