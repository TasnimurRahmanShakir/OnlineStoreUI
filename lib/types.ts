import { z } from "zod";

export type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  parentName?: string | null;
  parentId?: string;
  createdAt?: string;
};

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  imageUrl: z.string().optional(),
  parentId: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export type ApiResponse<T> = {
  message: string;
  result: T;
};
