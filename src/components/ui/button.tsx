import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "purple";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer font-sans";

    const variants = {
      default: "bg-primary text-white shadow-md hover:bg-primary-dark shadow-primary/20",
      purple: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:brightness-105",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
      outline: "border border-border bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-11 px-5 py-2.5",
      sm: "h-9 rounded-lg px-3.5 text-xs",
      lg: "h-12 rounded-xl px-8 text-base",
      icon: "h-10 w-10 p-0",
    };

    const variantClass = variants[variant] || variants.default;
    const sizeClass = sizes[size] || sizes.default;

    return (
      <button
        className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
