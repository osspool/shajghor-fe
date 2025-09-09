import { z } from "zod";
import { optionalObjectIdString } from "@/lib/zod-utils";

// optionalObjectIdString imported from lib/zod-utils

export const organizationSchema = z.object({
  name: z.string().min(1),
  ownerId: optionalObjectIdString, // required in DB, but super-admin may set it later; keep optional in form
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  billingPrice: z.number().min(0).optional(),
  billingCurrency: z.string().optional(),
  // Accept Date from DateInput and string (ISO) – normalized on submit
  lastPaidAt: z.union([z.date(), z.string()]).optional(),
  lastPaidMethod: z.string().optional(),
  billingNotes: z.string().optional(),
  isActive: z.boolean().optional(),
});


