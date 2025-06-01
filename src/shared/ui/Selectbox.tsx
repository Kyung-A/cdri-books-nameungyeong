"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

interface IOption {
  label: string;
  value: string;
}

interface ICustomSelectProps {
  options: IOption[];
  value?: string | null;
  onChange: (value: string) => void;
  className?: string;
}

export default function SelectBox({
  options,
  value,
  onChange,
  className,
}: ICustomSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
    },
    [onChange]
  );

  useEffect(() => {
    if (!value || value === "") {
      onChange(options[0].value);
    }
  }, [onChange, options, value]);

  return (
    <div
      className={`relative ${className}`}
      ref={wrapperRef}
      tabIndex={0}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-sm p-2 border-b border-[#D2D6DA] text-left flex justify-between items-center cursor-pointer"
      >
        <span className="text-sm font-bold">
          {options.find((opt) => opt.value === value)?.label}
        </span>
        <Image src="/chevron.png" width={12} height={12} alt="open" />
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-[0px_4px_14px_6px_#97979726] rounded max-h-48 overflow-auto">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`px-3 py-2 cursor-pointer text-[#8D94A0] text-sm ${
                opt.value === value ? "bg-gray-100 font-bold" : ""
              }`}
              onMouseDown={() => handleSelect(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
