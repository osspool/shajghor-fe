// schemas/parlour.schema.js
import { z } from "zod";
import { objectIdStringSchema, optionalObjectIdString } from "@/lib/zod-utils";

// objectIdStringSchema and optionalObjectIdString imported from lib/zod-utils

// Working hours item (best-effort structure)
export const workingHoursItem = z.object({
  isOpen: z.boolean().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

// Parlour form schema based on provided contract
export const parlourSchema = z.object({
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/i, "Slug can contain letters, numbers, dashes"),
  name: z.string().min(1),
  branch: z.string().optional(),
  ownerId: optionalObjectIdString,
  organizationId: optionalObjectIdString,
  address: z
    .object({
      address: z.string().optional(),
      city: z.string().optional(),
      area: z.string().optional(),
      zipCode: z.string().optional(),
      coordinates: z.tuple([z.number(), z.number()]).optional(),
    })
    .optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  coverImage: z.string().optional(),
  socialLinks: z.record(z.string()).optional(),
  // Helper to accept empty string as undefined for optional URL fields
  socialMediaUrl: z
    .object({
      instagram: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().url().optional()
      ),
      facebook: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().url().optional()
      ),
      tiktok: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().url().optional()
      ),
      youtube: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().url().optional()
      ),
      website: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().url().optional()
      ),
    })
    .optional(),
  workingHours: z.record(workingHoursItem).optional(),
  breaks: z
    .array(z.object({ startTime: z.string(), endTime: z.string() }))
    .optional(),
  providerType: z.enum(["salon", "artist"]).optional(),
  serviceLocationMode: z.enum(["in-salon", "at-home", "both"]).optional(),
  serviceTypes: z.array(z.string()).optional(),
  // Tags for search and discovery
  tags: z.array(z.string()).default([]).optional(),
  capacity: z.number().min(1).optional(),
  slotDurationMinutes: z.number().min(5).optional(),
  leadTimeMinutes: z.number().min(0).optional(),
  dailyCutoffTime: z.string().optional(),
  isActive: z.boolean().optional(),
  hasOffers: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  offerText: z.string().optional(),
  about: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      features: z.array(z.string()).max(6).optional(),
    })
    .optional(),
  portfolio: z.array(z.string()).max(4).optional(),
  advert: z
    .object({
      running: z.boolean().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      adImage: z.string().optional(),
      adLink: z.string().optional(),
      adText: z.string().optional(),
      adButtonText: z.string().optional(),
    })
    .optional(),
});
