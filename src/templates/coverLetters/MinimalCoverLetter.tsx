import React from 'react';

interface Props {
    data: any;
    jobTitle: string;
    companyName: string;
    hiringManagerName: string;
    content: string;
}

const MinimalCoverLetter: React.FC<Props> = ({ data, jobTitle, companyName, hiringManagerName, content }) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const managerName = hiringManagerName || "Hiring Manager";
    const paragraphs = content.split('\n').filter(p => p.trim().length > 0);

    return (
        <div className="bg-white w-full h-full p-10 sm:p-12 flex flex-col text-gray-800" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
            
            <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-light text-gray-900 mb-0.5 tracking-tight">{data?.fullName || "Your Name"}</h1>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{data?.targetRole || "Professional"}</div>
                </div>
                <div className="text-right text-xs text-gray-500 space-y-0.5">
                    {data?.email && <div>{data.email}</div>}
                    {data?.phone && <div>{data.phone}</div>}
                </div>
            </div>

            <div className="flex justify-between items-start mb-6 text-xs">
                <div className="text-gray-900 leading-relaxed">
                    <span className="block font-semibold">{managerName}</span>
                    <span className="block text-gray-500">{jobTitle}</span>
                    <span className="block text-gray-700 font-medium">{companyName}</span>
                </div>
                <div className="text-gray-400 font-medium">
                    {today}
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 text-[12.5px] leading-[1.6] text-gray-700">
                {paragraphs.map((p, i) => (
                    <p key={i} className="mb-3.5">{p}</p>
                ))}
            </div>
            
        </div>
    );
};

export default MinimalCoverLetter;
