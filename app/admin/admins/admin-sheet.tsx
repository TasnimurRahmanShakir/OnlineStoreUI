"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { createAdmin, updateAdmin } from "@/app/actions/admin";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

type AdminFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  isActive: boolean;
};

interface AdminSheetProps {
  isOpen: boolean;
  onClose: () => void;
  adminToEdit?: any | null; // If null, create mode
}

export function AdminSheet({ isOpen, onClose, adminToEdit }: AdminSheetProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminFormData>({
    defaultValues: {
      isActive: true,
    },
  });

  // Effect to reset/populate form
  useEffect(() => {
    if (adminToEdit) {
      setValue("fullName", adminToEdit.fullName);
      setValue("email", adminToEdit.email);
      setValue("phoneNumber", adminToEdit.phoneNumber);
      setValue("isActive", adminToEdit.isActive);
      setValue("password", ""); // Reset password field for security
    } else {
      reset({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        isActive: true, // Default active
      });
    }
  }, [adminToEdit, isOpen, reset, setValue]);

  const onSubmit = async (data: AdminFormData) => {
    try {
      let res;
      if (adminToEdit) {
        // Update
        res = await updateAdmin(adminToEdit.id, {
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password || undefined, // Only send if set
          isActive: data.isActive,
        });
      } else {
        // Create
        if (!data.password) {
          toast.error("Password is required for new admins");
          return;
        }
        res = await createAdmin(data);
      }

      if (res.success) {
        toast.success(
          adminToEdit
            ? "Admin updated successfully"
            : "Admin created successfully",
        );
        onClose();
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{adminToEdit ? "Edit Admin" : "Create Admin"}</SheetTitle>
          <SheetDescription>
            {adminToEdit
              ? "Update admin details. Leave password blank to keep current."
              : "Add a new administrator to the system."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          {/* Full Name - Read Only if Edit based on User request 'update only specific fields' ? 
              User said "admin update er jonno shudhu admin active inactive korte parbe, password dite parbe new. phone number change korte parbe. gmail change korte parbe"
              So Name is NOT actionable in Update? I'll make it readonly if editing.
          */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              {...register("fullName", { required: true })}
              disabled={!!adminToEdit} // Disable name edit if updating
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="+1234567890"
              {...register("phoneNumber")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {adminToEdit ? "New Password (Optional)" : "Password"}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              {...register("password")}
            />
          </div>

          {adminToEdit && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isActive"
                checked={watch("isActive")}
                onCheckedChange={(c) => setValue("isActive", c as boolean)}
              />
              <Label htmlFor="isActive">Active Account</Label>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button type="submit">
              {adminToEdit ? "Save Changes" : "Create Admin"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
