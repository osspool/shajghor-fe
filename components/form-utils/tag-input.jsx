"use client";
import { useState, useRef, useCallback, useMemo } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BaseFormField from "./base-form-field";

const TagInput = ({
  control,
  name,
  label,
  description,
  placeholder = "Add tag...",
  required,
  disabled,
  className,
  labelClassName,
  inputClassName,
  maxTags,
  allowDuplicates = false,
  // Suggestions dropdown
  suggestions = [],
  suggestionLimit = 8,
  // For direct usage without form
  value: propValue = [],
  onChange: propOnChange,
  onValueChange,
  // Additional props for bulk input
  delimiter = ",",
  validateTag,
  transformTag,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  // Parse and validate multiple tags from a string
  const parseMultipleTags = useCallback((input) => {
    if (!input.trim()) return [];
    
    // Split by delimiter and clean up each tag
    return input
      .split(delimiter)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => transformTag ? transformTag(tag) : tag)
      .filter(tag => !validateTag || validateTag(tag));
  }, [delimiter, validateTag, transformTag]);

  // Add multiple tags at once
  const handleAddMultipleTags = useCallback((tags, newTags, field) => {
    if (!newTags || newTags.length === 0) return tags;
    
    let updatedTags = [...tags];
    let addedCount = 0;
    
    for (const newTag of newTags) {
      // Skip empty tags
      if (!newTag.trim()) continue;
      
      const trimmedTag = newTag.trim();
      
      // Check for duplicates if not allowed
      if (!allowDuplicates && updatedTags.includes(trimmedTag)) {
        continue;
      }
      
      // Check max tags limit
      if (maxTags && updatedTags.length >= maxTags) {
        break;
      }
      
      updatedTags.push(trimmedTag);
      addedCount++;
    }
    
    // Only update if we actually added tags
    if (addedCount > 0) {
      if (field) {
        field.onChange(updatedTags);
      } else if (propOnChange) {
        propOnChange(updatedTags);
      }
      
      onValueChange?.(updatedTags);
    }
    
    return updatedTags;
  }, [allowDuplicates, maxTags, propOnChange, onValueChange]);

  // Handle single tag addition (backward compatible)
  const handleAddTag = useCallback((tags, newTag, field) => {
    const tagsToAdd = parseMultipleTags(newTag);
    const updatedTags = handleAddMultipleTags(tags, tagsToAdd, field);
    setInputValue("");
    return updatedTags;
  }, [parseMultipleTags, handleAddMultipleTags]);

  const handleRemoveTag = useCallback((tags, indexToRemove, field) => {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    
    if (field) {
      field.onChange(updatedTags);
    } else if (propOnChange) {
      propOnChange(updatedTags);
    }
    
    onValueChange?.(updatedTags);
    
    return updatedTags;
  }, [propOnChange, onValueChange]);

  // Handle input change to process comma-separated values in real-time
  const handleInputChange = useCallback((e, tags, field) => {
    const value = e.target.value;
    
    // Check if the input contains delimiters
    if (value.includes(delimiter)) {
      // Process all complete tags (everything before the last delimiter)
      const parts = value.split(delimiter);
      const completeTags = parts.slice(0, -1);
      const remainingInput = parts[parts.length - 1];
      
      if (completeTags.length > 0) {
        handleAddMultipleTags(tags, completeTags.map(t => t.trim()).filter(t => t), field);
      }
      
      // Keep only the part after the last delimiter
      setInputValue(remainingInput);
    } else {
      setInputValue(value);
    }
  }, [delimiter, handleAddMultipleTags]);

  // Handle paste events for bulk input
  const handlePaste = useCallback((e, tags, field) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const pastedTags = parseMultipleTags(pastedText);
    
    if (pastedTags.length > 0) {
      handleAddMultipleTags(tags, pastedTags, field);
      setInputValue("");
    }
  }, [parseMultipleTags, handleAddMultipleTags]);

  const handleKeyDown = useCallback((e, tags, field) => {
    if (e.key === "Enter" || e.key === delimiter) {
      e.preventDefault();
      handleAddTag(tags, inputValue, field);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      e.preventDefault();
      handleRemoveTag(tags, tags.length - 1, field);
    }
  }, [delimiter, inputValue, handleAddTag, handleRemoveTag]);

  // Memoize placeholder text for better UX
  const getPlaceholder = useCallback((tagsCount) => {
    if (tagsCount === 0) {
      return placeholder.includes("comma") ? placeholder : `${placeholder} (separate with ${delimiter} for multiple)`;
    }
    return "Add another...";
  }, [placeholder, delimiter]);

  // Memoize whether we can add more tags
  const canAddMoreTags = useCallback((tagsLength) => {
    return !maxTags || tagsLength < maxTags;
  }, [maxTags]);

  const renderTagInput = ({ field, disabled: isDisabled }) => {
    const tags = field ? field.value || [] : propValue || [];
    const showInput = !isDisabled && canAddMoreTags(tags.length);
    const normalizedInput = (inputValue || "").toLowerCase().trim();
    const filteredSuggestions = useMemo(() => {
      if (!normalizedInput) return [];
      const input = normalizedInput;
      const existingSet = new Set(tags.map((t) => t.toLowerCase()));
      return suggestions
        .filter(Boolean)
        .map((s) => (transformTag ? transformTag(s) : s))
        .filter((s) => s.toLowerCase().includes(input))
        .filter((s) => allowDuplicates || !existingSet.has(s.toLowerCase()))
        .slice(0, suggestionLimit);
    }, [normalizedInput, suggestions, tags, allowDuplicates, suggestionLimit, transformTag]);
    
    return (
      <div 
        className={cn(
          "min-h-[2.5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "transition-colors duration-200",
          isDisabled && "opacity-60 cursor-not-allowed",
          inputClassName
        )}
        onClick={() => showInput && inputRef.current?.focus()}
      >
        {/* Tags container */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1 animate-in fade-in-0 zoom-in-95"
              >
                <span className="max-w-[200px] truncate" title={tag}>
                  {tag}
                </span>
                {!isDisabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(tags, index, field);
                    }}
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Input field */}
        {showInput && (
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e, tags, field)}
              onKeyDown={(e) => handleKeyDown(e, tags, field)}
              onPaste={(e) => handlePaste(e, tags, field)}
              placeholder={getPlaceholder(tags.length)}
              className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
              disabled={isDisabled}
              aria-label="Add new tag"
              {...props}
            />
            {inputValue.trim() && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                onClick={() => handleAddTag(tags, inputValue, field)}
                aria-label="Add tag"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Suggestions list */}
        {showInput && filteredSuggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {filteredSuggestions.map((sug) => (
              <Button
                key={sug}
                type="button"
                variant="secondary"
                size="sm"
                className="h-auto px-2 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddMultipleTags(tags, [sug], field);
                  setInputValue("");
                }}
                aria-label={`Add ${sug}`}
              >
                {sug}
                <Plus className="h-3 w-3 ml-1 opacity-70" />
              </Button>
            ))}
          </div>
        )}
        
        {/* Status indicators */}
        <div className="flex items-center justify-between mt-1">
          {maxTags && (
            <div className={cn(
              "text-xs transition-colors",
              tags.length >= maxTags ? "text-destructive" : "text-muted-foreground"
            )}>
              {tags.length}/{maxTags} tags
            </div>
          )}
          {/* {!allowDuplicates && tags.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Duplicates not allowed
            </div>
          )} */}
        </div>
      </div>
    );
  };

  return (
    <BaseFormField
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      disabled={disabled}
      className={className}
      labelClassName={labelClassName}
      value={propValue}
      onChange={propOnChange}
    >
      {renderTagInput}
    </BaseFormField>
  );
};

export default TagInput;

// PropTypes for better documentation
TagInput.defaultProps = {
  placeholder: "Add tag...",
  allowDuplicates: false,
  delimiter: ",",
  value: [],
}; 