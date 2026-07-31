import React from "react";

type LogoLoaderProps = {
  text?: string;
  fullScreen?: boolean;
};

const LogoLoader: React.FC<LogoLoaderProps> = ({
  text = "Loading...",
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen w-full" : "py-10"
      } bg-[#f9f9f7]`}
    >
      <div className="flex flex-col items-center gap-4">

        {/* Logo */}
        <div className="flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="ProfilIO" 
            className="h-16 md:h-24 w-auto object-contain animate-pulse" 
          />
        </div>

        {/* Optional Text */}
        {text && (
          <p className="text-sm text-[#2d3432]/60 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LogoLoader;