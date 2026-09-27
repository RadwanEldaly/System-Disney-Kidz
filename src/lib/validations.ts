import { z } from 'zod';

export const systemSettingSchema = z.object({
  category: z.string().min(1, "Category is required"),
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  isSecret: z.boolean().default(false),
  description: z.string().optional(),
});

export type SystemSettingInput = z.infer<typeof systemSettingSchema>;

export const orderStatusDefSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  orderIndex: z.number().int().default(0),
  isDefault: z.boolean().default(false),
});

export type OrderStatusDefInput = z.infer<typeof orderStatusDefSchema>;

export const productSchema = z.object({
  shopifyProductId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean().default(true),
  variants: z.array(z.object({
    shopifyVariantId: z.string().optional(),
    name: z.string().min(1, "Variant name is required"),
    size: z.string().optional(),
    price: z.number().min(0, "Price must be >= 0"),
    sku: z.string().optional(),
  })).optional()
});

export type ProductInput = z.infer<typeof productSchema>;
