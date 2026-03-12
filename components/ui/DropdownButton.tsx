"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DropdownButtonProps {
  title: string;
  text: string[];
  url: string[];
}

const DropdownButton = memo(function DropdownButton({
  data,
}: {
  data: DropdownButtonProps;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        onClick={toggleOpen}
        variant="outline"
        className="flex items-center gap-2"
      >
        {data.title}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </Button>
      {open && (
        <div className="absolute w-full z-50 mt-2 rounded-xl border bg-background shadow-lg animate-fade-in">
          {data.text.map((label, index) => {
            const href = data.url[index];
            if (!href) return null;
            return (
              <Link href={href} key={index}>
                <Button
                  onClick={handleClose}
                  className="flex w-full justify-start px-4 py-2 text-sm hover:bg-muted rounded-none first:rounded-t-xl last:rounded-b-xl"
                  variant="ghost"
                >
                  {label}
                </Button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default DropdownButton;
