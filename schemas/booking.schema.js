import { z } from "zod";
import { objectIdStringSchema, coerceToIsoDateTimeStringRequired, optionalObjectIdString } from "@/lib/zod-utils";

// optionalObjectIdString imported from lib/zod-utils

export const bookingServiceItem = z.object({
  serviceId: objectIdStringSchema,
  serviceName: z.string().min(1),
  price: z.number().min(0),
  duration: z.number().min(1),
});

// date coercion imported from lib/zod-utils

export const bookingSchema = z.object({
  organizationId: optionalObjectIdString,
  parlourId: objectIdStringSchema,
  customerId: optionalObjectIdString,
  customerName: z.string().min(1),
  customerPhone: z.string().min(5),
  services: z.array(bookingServiceItem).min(1),
  serviceType: z.enum(['in-salon','at-home']).optional(),
  serviceAddress: z.string().optional(),
  appointmentDate: coerceToIsoDateTimeStringRequired,
  // Allow empty while date not chosen; enforce min when provided
  appointmentTime: z.string().min(4).or(z.literal("")),
  status: z.enum(['pending','confirmed','completed','cancelled']).optional(),
  paymentStatus: z.enum(['pending','paid','refunded']).optional(),
  paymentMethod: z.enum(['cash','bkash','nagad','bank','online']).optional(),
  totalAmount: z.number().min(0),
  totalDuration: z.number().min(1),
  additionalCost: z.number().optional(),
  additionalCostReason: z.string().optional(),
  notes: z.string().optional(),
});

// Alias to match API contract naming if needed
export const bookingCreateBody = bookingSchema;


