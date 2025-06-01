"use client";

import { useContext } from "react";
import { PopoverContext } from "../context";

export function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("Must be used inside PopoverLayout");
  return context;
}
