"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";

interface IPopoverContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export const PopoverContext = createContext<IPopoverContextProps | null>(null);

export function PopoverProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
}
