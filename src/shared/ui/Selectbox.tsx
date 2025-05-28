// src/shared/ui/SearchFilterBar.tsx
"use client";

import {
  useState,
  type ReactNode,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

export interface Option {
  value: string;
  label: ReactNode;
}

interface SearchFilterBarProps {
  options: Option[];
}

export function SearchFilterBar({ options }: SearchFilterBarProps) {
  return (
    <div className="flex border-b border-gray-300 rounded-md overflow-hidden">
      <div className="relative">
        <select className="appearance-none px-3 py-2 pr-8 bg-transparent text-gray-700 focus:outline-none">
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
