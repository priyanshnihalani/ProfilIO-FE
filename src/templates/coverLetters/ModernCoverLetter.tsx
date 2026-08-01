import React from 'react';

interface Props {
    data: any;
    jobTitle: string;
    companyName: string;
    hiringManagerName: string;
    content: string;
}

const ModernCoverLetter: React.FC<Props> = ({ data, jobTitle, companyName, hiringManagerName, content }) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const managerName = hiringManagerName || "Hiring Manager";
    const paragraphs = content.split('\n').filter(p => p.trim().length > 0);

    return (
        <div className="bg-white w-full h-full flex flex-col text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Top Accent Bar */}
            <div className="h-4 w-full bg-indigo-600"></div>
            
            <div className="p-10 sm:p-12 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">{data?.fullName || "Your Name"}</h1>
                        <h2 className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">{data?.targetRole || jobTitle}</h2>
                    </div>
                    <div className="text-right text-xs text-gray-500 space-y-0.5 font-medium">
                        {data?.email && <div>{data.email}</div>}
                        {data?.phone && <div>{data.phone}</div>}
                        {data?.location && <div>{data.location}</div>}
                    </div>
                </div>

                <div className="flex mb-6">
                    {/* Recipient */}
                    <div className="w-1/2">
                        <p className="text-[10px] font-bold text-[#6D5DF6] uppercase tracking-wider mb-0.5">To</p>
                        <p className="text-xs font-bold text-gray-900">{managerName}</p>
                        <p className="text-xs text-gray-600">{jobTitle}</p>
                        <p className="text-xs font-semibold text-gray-800">{companyName}</p>
                    </div>
                    {/* Date */}
                    <div className="w-1/2 text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
                        <p className="text-xs text-gray-600">{today}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 text-[12.5px] leading-relaxed text-gray-700">
                    {paragraphs.map((p, i) => (
                        <p key={i} className="mb-3.5">{p}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ModernCoverLetter;
