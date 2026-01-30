"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import { useDebounce } from "@/hooks/use-debounce";

export function AdminSearch({
  placeholder = "Search...",
}: {
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [term, setTerm] = useState(searchParams.get("q") || "");
  const debouncedTerm = useDebounce(term, 500);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";

    // Only update if the value is different
    if (debouncedTerm !== currentQ) {
      const params = new URLSearchParams(searchParams);
      if (debouncedTerm) {
        params.set("q", debouncedTerm);
        params.set("page", "1"); // Reset pagination
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedTerm, pathname, router, searchParams]);

  return (
    <Input
      placeholder={placeholder}
      value={term}
      onChange={(e) => setTerm(e.target.value)}
      className="max-w-sm"
    />
  );
}

// Simple debounce hook if not exists
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
