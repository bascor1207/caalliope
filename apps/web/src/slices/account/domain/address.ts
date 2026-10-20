/** Domaine compte : adresses de livraison et informations du client. Pur. */
export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export type AddressInput = Omit<Address, "id" | "isDefault">;
export type AddressField = keyof AddressInput;
export type FieldError = "required" | "invalid-zip" | "invalid-phone";
export type AddressErrors = Partial<Record<AddressField, FieldError>>;

export interface ProfileInput {
  firstName: string;
  lastName: string;
  phone: string;
}
export type ProfileErrors = Partial<Record<keyof ProfileInput, FieldError>>;

const ZIP = /^\d{5}$/;
const PHONE = /^\+?[\d\s().-]{6,20}$/;

export const ADDRESS_FIELDS: AddressField[] = [
  "label",
  "firstName",
  "lastName",
  "line1",
  "line2",
  "zip",
  "city",
  "country",
  "phone",
];

export function validateAddress(input: Partial<AddressInput>): AddressErrors {
  const errors: AddressErrors = {};
  if (!input.firstName?.trim()) errors.firstName = "required";
  if (!input.lastName?.trim()) errors.lastName = "required";
  if (!input.line1?.trim()) errors.line1 = "required";
  if (!input.zip || !ZIP.test(input.zip.trim())) errors.zip = "invalid-zip";
  if (!input.city?.trim()) errors.city = "required";
  if (input.phone?.trim() && !PHONE.test(input.phone.trim())) errors.phone = "invalid-phone";
  return errors;
}

export function validateProfile(input: Partial<ProfileInput>): ProfileErrors {
  const errors: ProfileErrors = {};
  if (!input.firstName?.trim()) errors.firstName = "required";
  if (!input.lastName?.trim()) errors.lastName = "required";
  if (input.phone?.trim() && !PHONE.test(input.phone.trim())) errors.phone = "invalid-phone";
  return errors;
}

/** Lignes d'affichage d'une adresse (sans les champs vides). */
export const addressLines = (a: AddressInput): string[] =>
  [`${a.firstName} ${a.lastName}`.trim(), a.line1, a.line2, `${a.zip} ${a.city}`.trim(), a.country, a.phone].filter(
    Boolean,
  );

/** Choisit l'adresse par défaut, sinon la première. */
export const pickDefault = (addresses: Address[]): Address | null =>
  addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
