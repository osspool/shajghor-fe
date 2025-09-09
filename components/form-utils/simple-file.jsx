"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const SimpleFile = ({
  control,
  name,
  label,
  fileRef,
  description,
  disabled,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div>
              <FormLabel>{label}</FormLabel>

              <Input
                type="file"
                placeholder="Add file"
                {...fileRef}
                disabled={disabled}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SimpleFile;
