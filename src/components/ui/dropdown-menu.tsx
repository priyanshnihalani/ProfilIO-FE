import * as React from "react";

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block text-left font-sans">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children }) => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used within a DropdownMenu");

  return React.cloneElement(children as React.ReactElement<any>, {
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      context.setOpen(!context.open);
      if ((children as any).props.onClick) {
        (children as any).props.onClick(e);
      }
    },
  });
};

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right";
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className = "", align = "right", children, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("DropdownMenuContent must be used within a DropdownMenu");

    if (!context.open) return null;

    const alignClass = align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right";

    return (
      <div
        ref={ref}
        className={`absolute z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1 text-slate-950 shadow-md animate-in fade-in slide-in-from-top-1 duration-200 focus:outline-none ${alignClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className = "", onClick, children, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("DropdownMenuItem must be used within a DropdownMenu");

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (onClick) onClick(e);
      context.setOpen(false);
    };

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={`relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100 hover:text-slate-900 transition-colors ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
