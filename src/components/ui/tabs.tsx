import * as React from "react";

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (val: string) => void;
} | null>(null);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (val: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ value, onValueChange, className = "", ...props }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={`w-full font-sans ${className}`} {...props} />
    </TabsContext.Provider>
  );
};

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex items-center justify-center rounded-xl bg-slate-100 p-1 text-slate-500 font-sans ${className}`}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className = "", value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within a Tabs component");

    const isActive = context.value === value;

    return (
      <button
        type="button"
        ref={ref}
        role="tab"
        aria-selected={isActive}
        onClick={() => context.onValueChange(value)}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer font-sans
          ${isActive ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-900"}
          ${className}`}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className = "", value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within a Tabs component");

    const isActive = context.value === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={`mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-sans ${className}`}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
