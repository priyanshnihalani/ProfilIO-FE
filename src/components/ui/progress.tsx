import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = "", value = 0, indicatorClassName = "", ...props }, ref) => {
    // Clamp value between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={`relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}
        {...props}
      >
        <div
          className={`h-full w-full flex-1 bg-primary transition-all duration-500 ease-in-out ${indicatorClassName}`}
          style={{ transform: `translateX(-${100 - clampedValue}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
