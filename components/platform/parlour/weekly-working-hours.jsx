"use client";

import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form-utils/form-input";
import SwitchInput from "@/components/form-utils/switch-input";

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export function WeeklyWorkingHours({ form, disabled = false }) {
  const values = form.watch("workingHours") || {};

  const copyTimesToAll = useCallback((fromKey) => {
    const source = values?.[fromKey] || {};
    if (!source?.startTime || !source?.endTime) return;
    DAYS.forEach(({ key }) => {
      form.setValue(`workingHours.${key}.startTime`, source.startTime, { shouldDirty: true });
      form.setValue(`workingHours.${key}.endTime`, source.endTime, { shouldDirty: true });
    });
  }, [values, form]);

  const dayBlocks = useMemo(() => DAYS.map(({ key, label }) => (
    <div key={key} className="rounded-md border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SwitchInput
            control={form.control}
            name={`workingHours.${key}.isOpen`}
            label={label}
            labelPosition="right"
            disabled={disabled}
          />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={(e) => { e.preventDefault(); copyTimesToAll(key); }} disabled={disabled}>
          Copy to All
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-sm text-muted-foreground">From:</div>
        <FormInput
          control={form.control}
          name={`workingHours.${key}.startTime`}
          type="time"
          inputClassName="w-[130px]"
          disabled={disabled}
          transform={{ input: (v) => v ?? "", output: (v) => v ?? "" }}
        />
        <div className="text-sm text-muted-foreground">To:</div>
        <FormInput
          control={form.control}
          name={`workingHours.${key}.endTime`}
          type="time"
          inputClassName="w-[130px]"
          disabled={disabled}
          transform={{ input: (v) => v ?? "", output: (v) => v ?? "" }}
        />
      </div>
    </div>
  )), [form, disabled, copyTimesToAll]);

  return (
    <div className="space-y-4">
      {dayBlocks}
    </div>
  );
}


