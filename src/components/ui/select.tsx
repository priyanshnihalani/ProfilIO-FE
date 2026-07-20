import * as React from "react";
import { RiCheckLine, RiArrowDownSLine } from "react-icons/ri";

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
} | null>(null);

interface SelectProps {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");
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
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, selectedLabel, setSelectedLabel }}>
      <div ref={containerRef} className="relative w-full font-sans">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className = "", children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectTrigger must be used within a Select component");

    return (
      <button
        type="button"
        ref={ref}
        onClick={() => context.setOpen(!context.open)}
        className={`flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all text-left cursor-pointer font-sans ${className}`}
        {...props}
      >
        {children || <SelectValue />}
        <RiArrowDownSLine className={`h-4 w-4 opacity-50 transition-transform duration-200 ${context.open ? "rotate-180" : ""}`} />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder = "Select option..." }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within a Select component");

  return (
    <span className={context.value ? "text-slate-900 font-medium" : "text-slate-400"}>
      {context.selectedLabel || placeholder}
    </span>
  );
};

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className = "", children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectContent must be used within a Select component");

    if (!context.open) return null;

    return (
      <div
        ref={ref}
        className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 text-slate-950 shadow-md focus:outline-none animate-in fade-in slide-in-from-top-1 duration-200 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className = "", value, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectItem must be used within a Select component");

    const isSelected = context.value === value;

    // Track children text to automatically update SelectValue label
    React.useEffect(() => {
      if (isSelected && typeof children === "string") {
        context.setSelectedLabel(children);
      }
    }, [isSelected, children]);

    const handleSelect = () => {
      context.onValueChange(value);
      if (typeof children === "string") {
        context.setSelectedLabel(children);
      }
      context.setOpen(false);
    };

    return (
      <div
        ref={ref}
        onClick={handleSelect}
        className={`relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm text-slate-700 outline-none hover:bg-slate-100 hover:text-slate-900 transition-colors ${
          isSelected ? "bg-slate-50 text-slate-900 font-semibold" : ""
        } ${className}`}
        {...props}
      >
        {isSelected && (
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <RiCheckLine className="h-4 w-4 text-primary" />
          </span>
        )}
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
