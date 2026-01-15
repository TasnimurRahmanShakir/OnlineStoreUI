"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categorySchema, CategoryFormValues, Category } from "@/lib/types";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/app/actions/categories";
import { usePathname, useSearchParams } from "next/navigation";

interface CategoryDialogProps {
  categories: Category[];
  initialData?: Category;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CategoryDialog({
  initialData,
  categories,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: CategoryDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isOpen = controlledIsOpen ?? internalIsOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalIsOpen;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      imageUrl: "",
      parentId: "none",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        slug: initialData.slug,
        imageUrl: initialData.imageUrl || "",
        parentId: initialData.parentId || "none",
      });
    } else {
      form.reset({
        name: "",
        slug: "",
        imageUrl: "",
        parentId: "none",
      });
    }
  }, [initialData, form, isOpen]);

  async function onSubmit(values: CategoryFormValues) {
    const payload = {
      ...values,
      parentId: values.parentId === "none" ? undefined : values.parentId,
    };

    const currentPath = `${pathname}?${searchParams.toString()}`;

    let result;
    if (initialData) {
      result = await updateCategoryAction(initialData.id, payload, currentPath);
    } else {
      result = await createCategoryAction(payload);
    }

    if (result.success) {
      toast.success(
        `Category ${initialData ? "updated" : "created"} successfully!`
      );
      onOpenChange(false);
      if (!initialData) form.reset();
    } else {
      form.setError("root", {
        message:
          result.error ||
          `Failed to ${initialData ? "update" : "create"} category`,
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {!initialData && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update category details."
              : "Add a new category to your store."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="T-Shirt, Shoes, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ... Other fields (Slug, ImageUrl) ... */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="mens-shoes, womens-shoes, mens-clothing, womens-clothing"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/image.jpg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {categories
                        ?.filter((cat) => cat.id !== initialData?.id) // Prevent selecting self as parent
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="text-red-500 text-sm">
                {form.formState.errors.root.message}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Saving..."
                : initialData
                ? "Update Category"
                : "Save Category"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
