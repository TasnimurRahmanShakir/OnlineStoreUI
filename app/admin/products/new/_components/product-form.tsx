"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/ui/rich-text-editor";
import "@/app/quill-custom.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryOption } from "@/app/actions/categories";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  deleteVariantAction,
} from "@/app/actions/product";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

const variantSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  stockQuantity: z.coerce.number().int().min(0, "Stock must be positive"),
  image: z.any().optional(),
});

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  brand: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  discount: z.string().optional(),
  deliveryChargeInsideDhaka: z.coerce
    .number()
    .min(0, "Delivery charge must be positive or zero")
    .default(0),
  deliveryChargeOutsideDhaka: z.coerce
    .number()
    .min(0, "Delivery charge must be positive or zero")
    .default(0),
  isActive: z.boolean().default(true),
  baseImage: z.any().optional(),
  variants: z.array(variantSchema),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: any;
}

export default function ProductForm({
  categories,
  initialData,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || "",
          brand: initialData.brand || "",
          categoryId: initialData.categoryId || "",
          price: initialData.price || 0,
          discount: initialData.discount || "",
          deliveryChargeInsideDhaka: initialData.deliveryChargeInsideDhaka || 0,
          deliveryChargeOutsideDhaka:
            initialData.deliveryChargeOutsideDhaka || 0,
          isActive: initialData.isActive ?? true,
          baseImage: undefined, // Files can't be set programmatically easily
          variants:
            initialData.variants?.map((v: any) => ({
              ...v,
              image: undefined,
            })) || [],
        }
      : {
          name: "",
          description: "",
          brand: "",
          categoryId: "",
          price: 0,
          discount: "",
          deliveryChargeInsideDhaka: 0,
          deliveryChargeOutsideDhaka: 0,
          isActive: true, // Default to true for new products?
          baseImage: undefined,
          variants: [
            {
              color: "",
              size: "",
              stockQuantity: 0,
              image: undefined,
            },
          ],
        },
    mode: "onChange",
  });

  const router = useRouter();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openVariantDeleteDialog, setOpenVariantDeleteDialog] = useState(false);
  const [variantToDeleteIndex, setVariantToDeleteIndex] = useState<
    number | null
  >(null);

  async function onDeleteProduct() {
    try {
      const result = await deleteProductAction(initialData.id);
      if (result.success) {
        toast.success("Product deleted successfully");
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  }

  async function confirmDeleteVariant() {
    if (variantToDeleteIndex === null) return;

    const variantData = form.getValues(`variants.${variantToDeleteIndex}`);
    const variantId = variantData?.id;

    if (!variantId) return;

    try {
      const result = await deleteVariantAction(variantId);
      if (result.success) {
        toast.success("Variant deleted successfully");
        remove(variantToDeleteIndex);
      } else {
        toast.error(result.error || "Failed to delete variant");
      }
    } catch (error) {
      toast.error("Error deleting variant");
    } finally {
      setOpenVariantDeleteDialog(false);
      setVariantToDeleteIndex(null);
    }
  }

  function onRemoveVariant(index: number) {
    const variantData = form.getValues(`variants.${index}`);
    const variantId = variantData?.id;

    if (initialData && variantId) {
      setVariantToDeleteIndex(index);
      setOpenVariantDeleteDialog(true);
    } else {
      // Just remove from the form array
      remove(index);
    }
  }

  async function onSubmit(values: ProductFormValues) {
    const formData = new FormData();

    if (initialData) {
      formData.append("id", initialData.id);
    }

    console.log(values);
    formData.append("name", values.name);
    formData.append("brand", values.brand);
    formData.append("categoryId", values.categoryId);
    formData.append("description", values.description || "");
    formData.append("isActive", String(values.isActive));
    formData.append("price", values.price.toString());
    formData.append(
      "deliveryChargeInsideDhaka",
      values.deliveryChargeInsideDhaka.toString(),
    );
    formData.append(
      "deliveryChargeOutsideDhaka",
      values.deliveryChargeOutsideDhaka.toString(),
    );
    if (values.discount) {
      formData.append("discount", values.discount);
    }

    if (values.baseImage?.[0]) {
      formData.append("baseImage", values.baseImage[0]);
    }

    // Handle variants and their images
    values.variants.forEach((variant, index) => {
      formData.append(`variants[${index}].color`, variant.color);
      formData.append(`variants[${index}].size`, variant.size);
      formData.append(
        `variants[${index}].stockQuantity`,
        variant.stockQuantity.toString(),
      );

      if (variant.id) {
        formData.append(`variants[${index}].id`, variant.id);
      }

      if (variant.image?.[0]) {
        formData.append(`variants[${index}].image`, variant.image[0]);
      }
    });

    try {
      // TODO: Handle Update Action if initialData is present
      const result = initialData
        ? await updateProductAction(formData)
        : await createProductAction(formData);

      if (result.success) {
        toast.success(
          `Product ${result.data?.name || ""} ${initialData ? "updated" : "saved"} successfully!`,
        );
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Failed to save product");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Men's T-Shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Nike" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 25.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 10 or 10%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deliveryChargeInsideDhaka"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Charge (Inside Dhaka)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryChargeOutsideDhaka"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Charge (Outside Dhaka)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === "true")}
                    defaultValue={field.value ? "true" : "false"}
                    value={field.value ? "true" : "false"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baseImage"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Base Image</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        onChange(event.target.files && event.target.files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Product description..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Variants</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  color: "",
                  size: "",
                  stockQuantity: 0,
                  image: undefined,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Variant
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative grid gap-4 p-4 border rounded-md md:grid-cols-3 bg-muted/20"
              >
                <div className="absolute right-2 top-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveVariant(index)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`variants.${index}.color`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Red" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.size`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. S, M, 42..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.stockQuantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.image`}
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>
                        Variant Image{" "}
                        {initialData && (
                          <span>
                            (Current:{" "}
                            {initialData.variants[index]?.imageUrl
                              ? "Set"
                              : "None"}
                            )
                          </span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            onChange(event.target.files && event.target.files);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                No variants added. Click "Add Variant" to start.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <AlertDialog
            open={openVariantDeleteDialog}
            onOpenChange={setOpenVariantDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this variant.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDeleteVariant}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {initialData?.id && (
            <AlertDialog
              open={openDeleteDialog}
              onOpenChange={setOpenDeleteDialog}
            >
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  Delete Product
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the product and all its variants.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteProduct}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            type="submit"
            size="lg"
            className={initialData ? "" : "w-full md:w-auto ml-auto"}
          >
            {initialData ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
