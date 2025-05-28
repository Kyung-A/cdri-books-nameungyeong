"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface IPopoverContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

interface ITriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const PopoverContext = createContext<IPopoverContextProps | null>(null);

function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("");
  return context;
}

export default function PopoverLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative">{children}</div>
    </PopoverContext.Provider>
  );
}

function Trigger({ children, ...props }: ITriggerProps) {
  const { setOpen, triggerRef } = usePopoverContext();

  return (
    <button
      ref={triggerRef}
      onClick={() => setOpen((prev) => !prev)}
      {...props}
    >
      {children}
    </button>
  );
}

function Content({ children }: { children: ReactNode }) {
  const { open, setOpen, triggerRef } = usePopoverContext();
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={contentRef} className="">
      {children}
    </div>
  );
}

PopoverLayout.Trigger = Trigger;
PopoverLayout.Content = Content;
