"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ClientHeaderSection = ({
  title,
  description,
  actions = null,
  icon: Icon = null,
  iconClassName,
  loading = false,
  variant = "plain",
}) => {
  const variantMap = {
    primary: "retro-card-primary",
    secondary: "retro-card-secondary",
    accent: "retro-card-accent",
    tertiary: "retro-card-tertiary",
    plain: "retro-card-plain",
  };

  return (
    <div
      className={cn(
        "retro-card", 
        variantMap[variant],
        "flex flex-col sm:flex-row sm:items-center sm:justify-between",
        "px-6 py-5 mb-4 transition-all hover:-translate-y-1 duration-200"
      )}
    >
      <div className="flex items-center gap-4 sm:mb-0">
        {Icon && (
          <div
            className={cn(
              "flex aspect-square size-10 items-center justify-center",
              "border-2 border-current rounded-md",
              `text-retro-${variant !== 'plain' ? variant : 'secondary'}`,
              iconClassName
            )}
          >
            <Icon className="size-5" />
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight leading-none font-mono">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground font-mono">{description}</p>
        </div>
      </div>

      {actions && (
        <div className="flex-shrink-0 space-x-2 mt-4 sm:mt-0">
          {actions.map((action, index) => {
            const buttonVariant = action.variant || "primary";
            
            return (
              <Button
                key={index}
                onClick={action.onClick}
                disabled={loading}
                className={cn(
                  "retro-button",
                  `retro-button-${buttonVariant}`,
                  action.className
                )}
                size={action.size || "default"}
              >
                {action.icon && (
                  <action.icon 
                    className={cn(
                      "size-4", 
                      action.iconPosition === "right" ? "ml-2" : "mr-2"
                    )} 
                  />
                )}
                <span className="font-mono">{loading ? action.loadingText : action.text}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientHeaderSection;