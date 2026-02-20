import { z } from "zod/v4";

export const accountSchema = z.object({
  name: z.string().min(1, "取引先名は必須です"),
  industry: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  address: z.string().optional(),
  description: z.string().optional(),
  annualRevenue: z.number().nonnegative().optional(),
  employees: z.number().int().nonnegative().optional(),
});

export const contactSchema = z.object({
  firstName: z.string().min(1, "名は必須です"),
  lastName: z.string().min(1, "姓は必須です"),
  email: z
    .string()
    .email("有効なメールアドレスを入力してください")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  accountId: z.string().optional(),
});

export const dealSchema = z.object({
  name: z.string().min(1, "商談名は必須です"),
  amount: z.number().nonnegative().optional(),
  stage: z.string().min(1, "ステージは必須です"),
  probability: z.number().min(0).max(100),
  closeDate: z.string().optional(),
  description: z.string().optional(),
  accountId: z.string().optional(),
  contactId: z.string().optional(),
});

export const activitySchema = z.object({
  type: z.string().min(1, "種別は必須です"),
  subject: z.string().min(1, "件名は必須です"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.string().optional(),
  accountId: z.string().optional(),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type DealFormValues = z.infer<typeof dealSchema>;
export type ActivityFormValues = z.infer<typeof activitySchema>;
