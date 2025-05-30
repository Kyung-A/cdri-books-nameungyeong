"use client";
import {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import Image from "next/image";
import { useClickOutside } from "../hooks";

interface IPopoverContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const PopoverContext = createContext<IPopoverContextProps | null>(null);

export function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("Must be used inside PopoverLayout");
  return context;
}

function Root({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative">{children}</div>
    </PopoverContext.Provider>
  );
}

function Trigger({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen, triggerRef } = usePopoverContext();
  return (
    <button ref={triggerRef} onClick={() => setOpen((p) => !p)} {...props}>
      {children}
    </button>
  );
}

function Content({ children }: { children: ReactNode }) {
  const { open, setOpen, triggerRef } = usePopoverContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useClickOutside(contentRef, triggerRef, open, setOpen);

  if (!open) return null;
  return (
    <div
      ref={contentRef}
      className="absolute mt-5 bg-white rounded-lg py-6 px-9 shadow-[0px_4px_14px_6px_#97979726] -translate-x-1/2 left-1/2"
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="w-5 ml-auto block cursor-pointer"
      >
        <Image width={20} height={20} src="/close.png" alt="close" />
      </button>
      {children}
    </div>
  );
}

export const PopoverLayout = {
  Root,
  Trigger,
  Content,
};
