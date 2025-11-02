import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1),
  qty: z.string().min(1)
});

export const stepSchema = z.object({
  t: z.number().nonnegative(),
  text: z.string().min(1)
});

export const recipeSchema = z.object({
  ingredients: z.array(ingredientSchema),
  steps: z.array(stepSchema)
});

export const uploadSchema = z.object({
  title: z.string().min(3).max(120),
  tags: z.array(z.string().min(1)).max(10),
  recipe: recipeSchema,
  fileName: z.string().min(1),
  thumbUrl: z.string().url().optional()
});
