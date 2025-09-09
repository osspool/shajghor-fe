// components/ui/loading-spinner.jsx
const LoadingSpinner = ({ className = "", size = "default" }) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      default: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12"
    }[size] || "h-6 w-6";
  
    return (
      <div className={`relative ${className}`}>
        {/* Outer ring */}
        <div
          className={`${sizeClasses} rounded-full border-2 border-t-primary/20 border-r-primary/20 border-b-primary/20 border-l-primary animate-spin`}
        />
        
        {/* Inner decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`${sizeClasses} rounded-full border border-primary/10 animate-pulse`}
          />
        </div>
      </div>
    );
  };
  
  // Full-page loading spinner with luxury branding
  export const FullPageSpinner = () => {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="xl" className="text-primary" />
        <div className="text-center space-y-2">
          <p className="text-lg font-serif text-foreground/80">Loading</p>
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  };
  
  // Centered container with spinner
  export const LoadingContainer = ({ children, loading, className = "" }) => {
    if (loading) {
      return (
        <div className={`flex items-center justify-center p-8 ${className}`}>
          <LoadingSpinner size="lg" />
        </div>
      );
    }
    return children;
  };
  
  export { LoadingSpinner };