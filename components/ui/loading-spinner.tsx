import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 animate-pulse"></div>

          {/* Spinning logo/icon */}
          <div className="relative flex items-center justify-center w-24 h-24">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>
          <p className="text-sm text-gray-600">
            Please wait while we fetch your data
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
