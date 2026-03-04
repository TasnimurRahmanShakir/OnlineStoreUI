"use server";

import { api } from "@/lib/api-client";
import { Address, UserProfile } from "@/lib/types";

export async function getUserProfileAction() {
  try {
    const result = await api.get<UserProfile>("/User/profile");
    if (result.success && result.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = result.data;
      return {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        addresses: data.address
          ? [
              {
                id: data.address.guid,
                addressLine: data.address.addressLine,
                label: data.address.label,
                isDefault: true,
              },
            ]
          : [],
      };
    }
    return null;
  } catch {
    // Guest user - no authentication, return null
    return null;
  }
}

export async function getUserAddressesAction() {
  const result = await api.get<Address[]>("/Address");
  if (result.success && result.data) {
    return result.data;
  }
  return [];
}
