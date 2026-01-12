import { z } from "zod";

export const GiftAssistantSchema = z.object({
  relationship: z.string().min(1, "Please choose a relationship to continue."),
  relationshipText: z.string().optional(), // For 'Other' relationship
  ageRange: z.string().min(1, "Please select an age range."),
  gender: z.string().optional(), // Nouveau champ pour le sexe
  occasion: z.array(z.string()).optional(), // Multi-select, optional
  personality: z.array(z.string()).optional(), // Multi-select, optional
  interests: z.array(z.string()).optional(), // Multi-select, optional
  interestFreeText: z.string().optional(),
  budget: z.string().min(1, "Please select a budget range."), // Now a string for presets
  giftStyle: z.string().min(1, "Please choose a gift style."),
  riskTolerance: z.boolean().optional(),
});

export type GiftAssistantFormData = z.infer<typeof GiftAssistantSchema>;