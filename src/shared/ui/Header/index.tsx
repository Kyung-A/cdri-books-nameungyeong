"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GNB } from "@/shared/consts";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full py-6">
      <div className="max-w-7xl w-full  mx-auto flex items-center">
        <Image width={207} height={32} src="/logo.png" alt="logo" />
        <nav className="w-full">
          <ul className="flex items-center justify-center gap-x-14">
            {GNB.map((menu) => (
              <li
                key={menu.href}
                className={`font-medium relative ${
                  menu.href === pathname
                    ? "after:absolute after:-bottom-1 after:block after:w-full after:h-px after:bg-palette-primary"
                    : ""
                }`}
              >
                <Link href={menu.href}>{menu.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
