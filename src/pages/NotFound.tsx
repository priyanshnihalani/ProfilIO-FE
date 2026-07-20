import { useNavigate } from "react-router-dom";
import { RiArrowLeftLine, RiFileUnknowLine } from "react-icons/ri";
import { Button } from "../components/ui/button";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center px-6 relative overflow-hidden font-sans">

            {/* Decorative background blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6D5DF6]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#8B7CF8]/5 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 text-center max-w-lg space-y-8">

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#6D5DF6]/10 flex items-center justify-center shadow-lg shadow-[#6D5DF6]/5">
                        <RiFileUnknowLine className="text-[#6D5DF6] text-4xl" />
                    </div>
                </div>

                {/* 404 number */}
                <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#6D5DF6]">
                        Error 404
                    </p>
                    <h1 className="text-8xl md:text-[10rem] font-extrabold tracking-tighter text-[#0F172A] leading-none select-none font-display">
                        404
                    </h1>
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] font-display">
                        Page not found
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-6 h-12 rounded-xl text-slate-600 bg-white shadow-sm border-slate-200"
                    >
                        <RiArrowLeftLine className="mr-2" />
                        Go back
                    </Button>
                    <Button
                        variant="purple"
                        onClick={() => navigate("/")}
                        className="w-full sm:w-auto px-8 h-12 rounded-xl bg-[#6D5DF6] hover:bg-[#5C4EE5] shadow-md"
                    >
                        Back to Home
                    </Button>
                </div>

            </div>

            {/* Bottom wordmark */}
            <div className="absolute bottom-8 flex items-center gap-2 opacity-50 select-none pointer-events-none">
                <img src="/logo.png" alt="ProfilIO" className="h-6 w-auto object-contain grayscale" />
            </div>
        </div>
    );
};

export default NotFound;
