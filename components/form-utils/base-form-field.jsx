"use client";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField as UIFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

/**
 * BaseFormField - A foundational component for all form fields
 * 
 * This component provides a consistent structure and styling for all form fields
 * while allowing for customization through props and children.
 */
const BaseFormField = ({
  // Form control props
  control,
  name,
  
  // Label and description
  label,
  description,
  required,
  
  // Style props
  className,
  labelClassName,
  
  // Icon props
  IconLeft,
  IconRight,
  
  // State props
  disabled,
  
  // Render props
  children,
  renderLabel,
  renderDescription,
  
  // Handle direct (non-form) usage
  value,
  onChange,
  
  // Additional props
  ...props
}) => {
  // If using without React Hook Form
  if (!control) {
    return (
      <div className={cn("w-full", className)}>
        {label && !renderLabel && (
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("text-sm text-foreground font-medium flex-grow", labelClassName)}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </div>
            {IconRight && <span className="text-gray-500 flex-shrink-0">{IconRight}</span>}
          </div>
        )}
        
        {renderLabel && renderLabel()}
        
        {children({ value, onChange, disabled })}
        
        {description && !renderDescription && (
          <div className="text-sm text-muted-foreground mt-1">{description}</div>
        )}
        
        {renderDescription && renderDescription()}
      </div>
    );
  }

  // Using with React Hook Form
  return (
    <UIFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          {label && !renderLabel && (
            <div className="flex items-center gap-2 mb-2">
              <FormLabel className={cn("flex-grow", labelClassName)}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              {IconRight && <span className="text-gray-500 flex-shrink-0">{IconRight}</span>}
            </div>
          )}
          
          {renderLabel && renderLabel()}
          
          <FormControl>
            <div className={cn("relative", IconLeft && "has-left-icon", IconRight && "has-right-icon")}>
              {IconLeft && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {IconLeft}
                </div>
              )}
              
              {children({ 
                field, 
                disabled,
                ...props 
              })}
              
              {IconRight && !renderLabel && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {IconRight}
                </div>
              )}
            </div>
          </FormControl>
          
          {description && !renderDescription && <FormDescription>{description}</FormDescription>}
          
          {renderDescription && renderDescription()}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BaseFormField; 