import { z } from "zod";
import { coerceToIsoDateTimeString, objectIdStringSchema, optionalObjectIdString } from "@/lib/zod-utils";

// optionalObjectIdString imported from lib/zod-utils

// date coercion imported from lib/zod-utils

export const subscriptionSchema = z.object({
  organizationId: objectIdStringSchema,
  planName: z.string().optional(),
  price: z.number().min(0),
  currency: z.string().optional(),
  billingCycle: z.enum(["monthly","quarterly","yearly","custom"]).optional(),
  status: z.enum(["active","inactive","pending","expired"]).optional(),
  paymentRequest: z.object({
    method: z.string().optional(),
    senderAccount: z.string().optional(),
    reference: z.string().optional(),
    amount: z.number().optional(),
    transactionDate: coerceToIsoDateTimeString,
    notes: z.string().optional(),
  }).optional(),
  verifiedAt: coerceToIsoDateTimeString,
  verifiedBy: optionalObjectIdString,
  periodStart: coerceToIsoDateTimeString,
  periodEnd: coerceToIsoDateTimeString,
});

export const subscriptionCreateBody = subscriptionSchema;


