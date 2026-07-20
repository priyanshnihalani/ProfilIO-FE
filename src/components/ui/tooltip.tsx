import * as React from "react";

const TooltipContext = React.createContext<{ open: boolean } | null>(null);

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

interface TooltipProps {
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ open }}>
      <div
        className="relative inline-block"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

interface TooltipTriggerProps {
  children: React.ReactNode;
}

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children }) => {
  return <>{children}</>;
};

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
}

const TooltipContent: React.FC<TooltipContentProps> = ({
  className = "",
  side = "top",
  children,
  ...props
}) => {
  const context = React.useContext(TooltipContext);
  if (!context) throw new Error("TooltipContent must be used within a Tooltip component");

  if (!context.open) return null;

  const sideStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowStyles: React.CSSProperties = {
    bottom: side === "top" ? "-4px" : undefined,
    top: side === "bottom" ? "-4px" : (side === "left" || side === "right" ? "calc(50% - 4px)" : undefined),
    right: side === "left" ? "-4px" : undefined,
    left: side === "right" ? "-4px" : (side === "top" || side === "bottom" ? "calc(50% - 4px)" : undefined),
  };

  return (
    <div
      className={`absolute z-50 overflow-hidden rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in duration-200 pointer-events-none whitespace-nowrap font-sans ${sideStyles[side]} ${className}`}
      {...props}
    >
      {children}
      <div className="absolute w-2 h-2 bg-slate-900 rotate-45" style={arrowStyles} />
    </div>
  );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
