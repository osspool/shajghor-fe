import { z } from "zod";

export const serviceBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be at least 0"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  category: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional(),
  isDiscount: z.boolean().optional(),
});

export const serviceCreateSchema = serviceBaseSchema.extend({
  parlourId: z.string().min(1, "Parlour is required"),
});

export const serviceUpdateSchema = serviceBaseSchema.partial();


