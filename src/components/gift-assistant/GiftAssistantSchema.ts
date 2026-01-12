import { z } from "zod";

export const GiftAssistantSchema = z.object({
  occasion: z.string().min(1, "Please choose an occasion to continue."),
  occasionText: z.string().optional(),
  relationship: z.string().min(1, "Please select a relationship."),
  gender: z.string().optional(),
  ageRange: z.string().min(1, "Please select an age range."),
  personality: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  interestFreeText: z.string().optional(),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  giftTone: z.string().min(1, "Please select a gift tone."),
  allowPersonalization: z.boolean(),
});

export type GiftAssistantFormData = z.infer<typeof GiftAssistantSchema>;