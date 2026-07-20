import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";

const SheetContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Sheet: React.FC<SheetProps> = ({ open: controlledOpen, onOpenChange, children }) => {
  const [localOpen, setLocalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : localOpen;
  const setOpen = React.useCallback(
    (val: boolean) => {
      if (!isControlled) setLocalOpen(val);
      if (onOpenChange) onOpenChange(val);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

interface SheetTriggerProps {
  children: React.ReactNode;
}

const SheetTrigger: React.FC<SheetTriggerProps> = ({ children }) => {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error("SheetTrigger must be used within a Sheet component");

  return React.cloneElement(children as React.ReactElement<any>, {
    onClick: (e: React.MouseEvent) => {
      context.setOpen(true);
      if ((children as any).props.onClick) {
        (children as any).props.onClick(e);
      }
    },
  });
};

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className = "", side = "right", children, ...props }, ref) => {
    const context = React.useContext(SheetContext);
    if (!context) throw new Error("SheetContent must be used within a Sheet component");

    const sideVariants = {
      right: {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        styles: "right-0 top-0 bottom-0 w-3/4 max-w-sm border-l",
      },
      left: {
        initial: { x: "-100%" },
        animate: { x: 0 },
        exit: { x: "-100%" },
        styles: "left-0 top-0 bottom-0 w-3/4 max-w-sm border-r",
      },
      top: {
        initial: { y: "-100%" },
        animate: { y: 0 },
        exit: { y: "-100%" },
        styles: "top-0 left-0 right-0 h-80 border-b",
      },
      bottom: {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        styles: "bottom-0 left-0 right-0 h-80 border-t",
      },
    };

    const config = sideVariants[side];

    return (
      <AnimatePresence>
        {context.open && (
          <div className="fixed inset-0 z-50 flex font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => context.setOpen(false)}
            />

            {/* Slide-out Drawer */}
            <motion.div
              ref={ref}
              initial={config.initial}
              animate={config.animate}
              exit={config.exit}
              transition={{ type: "tween", duration: 0.35 }}
              className={`absolute z-10 bg-white p-6 shadow-xl border-slate-200 flex flex-col focus:outline-none ${config.styles} ${className}`}
              {...(props as any)}
            >
              {children}

              {/* Close Button */}
              <button
                type="button"
                onClick={() => context.setOpen(false)}
                className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);
SheetContent.displayName = "SheetContent";

const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 mb-6 ${className}`} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", ...props }) => (
  <h2 className={`text-lg font-bold font-display text-slate-900 ${className}`} {...props} />
);
SheetTitle.displayName = "SheetTitle";

const SheetDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = "", ...props }) => (
  <p className={`text-sm text-slate-500 font-sans ${className}`} {...props} />
);
SheetDescription.displayName = "SheetDescription";

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription };
