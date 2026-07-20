import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";

const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open: controlledOpen, onOpenChange, children }) => {
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
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children }) => {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogTrigger must be used within a Dialog component");

  return React.cloneElement(children as React.ReactElement<any>, {
    onClick: (e: React.MouseEvent) => {
      context.setOpen(true);
      if ((children as any).props.onClick) {
        (children as any).props.onClick(e);
      }
    },
  });
};

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className = "", children, ...props }, ref) => {
    const context = React.useContext(DialogContext);
    if (!context) throw new Error("DialogContent must be used within a Dialog component");

    return (
      <AnimatePresence>
        {context.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => context.setOpen(false)}
            />

            {/* Modal Wrapper */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className={`relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl focus:outline-none ${className}`}
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
DialogContent.displayName = "DialogContent";

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left mb-4 ${className}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6 ${className}`} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = "", ...props }, ref) => (
    <h2
      ref={ref}
      className={`text-xl font-bold leading-none tracking-tight font-display text-slate-900 ${className}`}
      {...props}
    />
  )
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = "", ...props }, ref) => (
    <p ref={ref} className={`text-sm text-slate-500 mt-1 font-sans ${className}`} {...props} />
  )
);
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
