import React from 'react';

interface Props {
    data: any; // Resume Profile Data (name, contact info)
    jobTitle: string;
    companyName: string;
    hiringManagerName: string;
    content: string; // The generated cover letter body
}

const ClassicCoverLetter: React.FC<Props> = ({ data, jobTitle, companyName, hiringManagerName, content }) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const managerName = hiringManagerName || "Hiring Manager";

    // Split content by paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim().length > 0);

    return (
        <div className="bg-white w-full h-full p-10 sm:p-12 flex flex-col text-gray-900 box-sizing-border" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '11pt' }}>
            {/* Header / Sender Info */}
            <div className="mb-6 border-b-2 border-gray-800 pb-3 text-center">
                <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">{data?.fullName || "Your Name"}</h1>
                <div className="text-xs flex flex-wrap justify-center gap-x-3 gap-y-1 text-gray-700">
                    {data?.email && <span>{data.email}</span>}
                    {data?.phone && <span>• {data.phone}</span>}
                    {data?.location && <span>• {data.location}</span>}
                    {data?.linkedin && <span>• {data.linkedin.replace(/^https?:\/\//, '')}</span>}
                </div>
            </div>

            {/* Date */}
            <div className="mb-4 text-xs text-gray-600">
                {today}
            </div>

            {/* Recipient Info */}
            <div className="mb-6 text-xs leading-relaxed">
                <div className="font-semibold">{managerName}</div>
                <div>{jobTitle}</div>
                <div className="font-bold">{companyName}</div>
            </div>

            {/* Body */}
            <div className="flex-1 text-[12.5px] leading-relaxed text-justify whitespace-pre-wrap">
                {paragraphs.map((p, i) => (
                    <p key={i} className="mb-3.5">{p}</p>
                ))}
            </div>

        </div>
    );
};

export default ClassicCoverLetter;
