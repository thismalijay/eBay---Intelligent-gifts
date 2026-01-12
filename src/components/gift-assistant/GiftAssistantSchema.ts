import { z } from "zod";

export const GiftAssistantSchema = z.object({
  occasion: z.string().min(1, "Please choose an occasion to continue."),
  occasionText: z.string().optional(),
  relationship: z.string().min(1, "Please select a relationship."),
  ageRange: z.string().min(1, "Please select an age range."),
  interests: z.array(z.string()).optional(), // Optional, hint if none selected
  interestFreeText: z.string().optional(),
  budgetMin: z.number().min(5, "Budget minimum must be at least 5."),
  budgetMax: z.number().min(5, "Budget maximum must be at least 5.").refine((max, { parent }) => max >= parent.budgetMin, "Budget maximum must be greater than or equal to minimum."),
  giftTone: z.string().min(1, "Please select a gift style."),
});

export type GiftAssistantFormData = z.infer<typeof GiftAssistantSchema>;