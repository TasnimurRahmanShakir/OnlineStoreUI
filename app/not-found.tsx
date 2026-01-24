import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center space-y-6">
      <div className="rounded-full bg-muted p-6 mb-4">
        <SearchX className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="text-lg text-muted-foreground text-pretty max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been removed, renamed, or doesn&apos;t exist.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="lg">
          <Link href="/">
            <MoveLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
