import * as z from 'zod';
import { EMPLOYEE_ROLE_VALUES } from '@/constants/platform-constants';

export const employeeCreateBody = z.object({
  userId: z.string(),
  parlourId: z.string(),
  role: z.enum(EMPLOYEE_ROLE_VALUES).optional(),
  title: z.string().optional(),
  active: z.boolean().optional(),
  salaryAmount: z.number().min(0).optional(),
  salaryCurrency: z.string().optional(),
  salaryNotes: z.string().optional(),
});

export const employeeUpdateBody = employeeCreateBody.partial();


