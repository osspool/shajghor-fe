import { z } from "zod";
import { coerceToIsoDateTimeString, objectIdStringSchema, optionalObjectIdString } from "@/lib/zod-utils";
import { TRANSACTION_CATEGORY_VALUES, TRANSACTION_TYPE_VALUES, TRANSACTION_CATEGORIES } from "@/constants/booking-constants";

// optionalObjectIdString imported from lib/zod-utils

// date coercion imported from lib/zod-utils

export const transactionPaymentDetails = z.object({
  provider: z.string().optional(),
  walletNumber: z.string().optional(),
  transactionId: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  senderName: z.string().optional(),
}).optional();

export const transactionSchema = z.object({
  organizationId: objectIdStringSchema,
  parlourId: objectIdStringSchema,
  bookingId: optionalObjectIdString,
  customerId: optionalObjectIdString,
  handledBy: optionalObjectIdString,
  type: z.enum(TRANSACTION_TYPE_VALUES),
  category: z.enum(TRANSACTION_CATEGORY_VALUES).optional(),
  amount: z.number().min(0),
  method: z.enum(['cash', 'bkash', 'nagad', 'bank', 'online']),
  paymentDetails: transactionPaymentDetails,
  reference: z.string().optional(),
  notes: z.string().optional(),
  date: coerceToIsoDateTimeString,
}).superRefine((data, ctx) => {
  // If category is booking then bookingId is required
  if (data.category === TRANSACTION_CATEGORIES.BOOKING && !data.bookingId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Booking ID is required for booking category',
      path: ['bookingId'],
    });
  }
});

export const transactionCreateBody = transactionSchema;


