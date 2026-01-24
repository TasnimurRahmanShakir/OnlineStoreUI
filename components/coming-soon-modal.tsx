"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ComingSoon } from "@/components/coming-soon";
import { ReactNode } from "react";

interface ComingSoonModalProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function ComingSoonModal({
  children,
  title,
  description,
}: ComingSoonModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <ComingSoon
          title={title}
          description={description}
          showHomeButton={false}
          className="min-h-[300px]"
        />
      </DialogContent>
    </Dialog>
  );
}
