"use server";

import { revalidatePath } from "next/cache";
import { normalizePhone } from "@/shared/kernel/phone";
import { getSessionUser } from "@/slices/auth/public-server";
import {
  ADDRESS_FIELDS,
  type AddressErrors,
  type AddressInput,
  type ProfileErrors,
  type ProfileInput,
  validateAddress,
  validateProfile,
} from "../domain/address";
import { accountRepository } from "./container";

export interface ProfileState {
  ok?: boolean;
  errors?: ProfileErrors;
  denied?: boolean;
}
export interface AddressState {
  ok?: boolean;
  errors?: AddressErrors;
  denied?: boolean;
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const refresh = () => revalidatePath("/[locale]/compte", "page");

export async function updateProfileAction(_prev: ProfileState, f: FormData): Promise<ProfileState> {
  const user = await getSessionUser();
  if (!user) return { denied: true };
  const input: ProfileInput = {
    firstName: str(f, "firstName"),
    lastName: str(f, "lastName"),
    phone: normalizePhone(str(f, "phone")),
  };
  const errors = validateProfile(input);
  if (Object.keys(errors).length > 0) return { errors };
  await accountRepository.updateProfile(user.id, input);
  refresh();
  return { ok: true };
}

export async function saveAddressAction(_prev: AddressState, f: FormData): Promise<AddressState> {
  const user = await getSessionUser();
  if (!user) return { denied: true };
  const input = Object.fromEntries(ADDRESS_FIELDS.map((k) => [k, str(f, k)])) as unknown as AddressInput;
  if (!input.country) input.country = "FR";
  input.phone = normalizePhone(input.phone);
  const errors = validateAddress(input);
  if (Object.keys(errors).length > 0) return { errors };
  const id = str(f, "id") || undefined;
  await accountRepository.saveAddress(user.id, input, id);
  refresh();
  return { ok: true };
}

export async function deleteAddressAction(f: FormData): Promise<void> {
  const user = await getSessionUser();
  const id = str(f, "id");
  if (!user || !id) return;
  await accountRepository.deleteAddress(user.id, id);
  refresh();
}

export async function setDefaultAddressAction(f: FormData): Promise<void> {
  const user = await getSessionUser();
  const id = str(f, "id");
  if (!user || !id) return;
  await accountRepository.setDefaultAddress(user.id, id);
  refresh();
}
