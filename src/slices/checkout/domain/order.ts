import { type Totals, totalsFor } from "@/shared/kernel/shipping-policy";

/** Domaine checkout : validation et construction de commande, pur. Les erreurs sont des codes, traduits par l'UI. */
export interface Customer {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  zip: string;
  city: string;
}

export type PaymentMethod = "card" | "applepay" | "paypal";
export const PAYMENT_METHODS: PaymentMethod[] = ["card", "applepay", "paypal"];

export interface OrderLineInput {
  productId: string;
  colorKey: string;
  size: string;
  qty: number;
}

export interface OrderLine extends OrderLineInput {
  name: string;
  unitPrice: number;
}

export interface Order extends Totals {
  ref: string;
  customer: Customer;
  payment: PaymentMethod;
  lines: OrderLine[];
  createdAt: string;
}

export type CustomerField = keyof Customer;
export type ErrorCode =
  | "invalid-email"
  | "required"
  | "invalid-zip"
  | "empty-cart"
  | "unknown-product"
  | "unavailable-color"
  | "unavailable-size"
  | "invalid-qty"
  | "network";

export type ValidationErrors = Partial<Record<CustomerField | "cart", ErrorCode>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP = /^\d{5}$/;

export function validateCustomer(customer: Partial<Customer>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!customer.email || !EMAIL.test(customer.email)) errors.email = "invalid-email";
  if (!customer.firstName?.trim()) errors.firstName = "required";
  if (!customer.lastName?.trim()) errors.lastName = "required";
  if (!customer.address?.trim()) errors.address = "required";
  if (!customer.zip || !ZIP.test(customer.zip)) errors.zip = "invalid-zip";
  if (!customer.city?.trim()) errors.city = "required";
  return errors;
}

export const isValidQty = (qty: number) => Number.isInteger(qty) && qty >= 1 && qty <= 10;

export const hasErrors = (errors: ValidationErrors) => Object.keys(errors).length > 0;

export function buildOrder(input: {
  ref: string;
  customer: Customer;
  payment: PaymentMethod;
  lines: OrderLine[];
  now: Date;
}): Order {
  return {
    ref: input.ref,
    customer: input.customer,
    payment: input.payment,
    lines: input.lines,
    ...totalsFor(input.lines),
    createdAt: input.now.toISOString(),
  };
}
