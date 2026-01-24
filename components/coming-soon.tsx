import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
  title?: string;
  description?: string;
  showHomeButton?: boolean;
  className?: string;
}

export function ComingSoon({
  title = "Coming Soon",
  description = "We are working hard to bring you this feature. Check back later for updates!",
  showHomeButton = true,
  className,
}: ComingSoonProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6",
        className,
      )}
    >
      <div className="rounded-full bg-primary/10 p-6 mb-2 animate-pulse">
        <Construction className="h-12 w-12 text-primary" />
      </div>
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground text-pretty max-w-md mx-auto">
          {description}
        </p>
      </div>
      {showHomeButton && (
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      )}
    </div>
  );
}
