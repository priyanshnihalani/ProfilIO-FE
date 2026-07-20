import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "purple" | "success";
}

function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-sans";

  const variants = {
    default: "border-transparent bg-primary text-white hover:bg-primary-dark",
    secondary: "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200",
    destructive: "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
    outline: "text-slate-700 border-slate-200 hover:bg-slate-50",
    purple: "border-transparent bg-purple-100 text-purple-700 hover:bg-purple-200",
    success: "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  };

  const variantClass = variants[variant] || variants.default;

  return <div className={`${baseStyles} ${variantClass} ${className}`} {...props} />;
}

export { Badge };
