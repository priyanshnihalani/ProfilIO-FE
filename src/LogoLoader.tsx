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
        <div className="flex items-center gap-3">

          {/* Animated V */}
          <svg
            width="42"
            height="42"
            viewBox="0 0 100 100"
            className="stroke-[#59614e]"
          >
            <path
              d="M20 50 L40 70 L80 20"
              fill="none"
              strokeWidth="6"
              className="logo-draw"
            />
          </svg>

          {/* Brand Name */}
          <span className="text-2xl font-semibold text-[#2d3432] logo-fade">
            Velmio
          </span>
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