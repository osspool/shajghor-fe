// app/dashboard/forms/components/error-display.jsx
import { Button } from "@/components/ui/button";

export const ErrorDisplay = ({ error }) => (
  <div className="container mx-auto px-4 py-6 max-w-7xl">
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="text-red-500 text-center">
        <h3 className="text-lg font-semibold">Something went wrong</h3>
        <p className="text-sm">{error.message}</p>
      </div>
      <Button onClick={() => window.location.reload()} variant="outline">
        Try Again
      </Button>
    </div>
  </div>
);