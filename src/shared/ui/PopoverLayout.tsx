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

interface IPopoverContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const PopoverContext = createContext<IPopoverContextProps | null>(null);

function usePopoverContext() {
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
  const { open } = usePopoverContext();
  if (!open) return null;
  return (
    <div className="absolute w-full mt-2 bg-white rounded-lg py-6 px-9 shadow-[0px_4px_14px_6px_#97979726]">
      <button type="button" className="w-5">
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
