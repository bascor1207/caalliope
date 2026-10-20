"use client";

import { type ComponentProps, useState } from "react";
import { formatPhone } from "@/shared/kernel/phone";
import { Input } from "./input";

/** Champ téléphone : se formate avec l'indicatif international en quittant le champ (+33 6 52 59 92 71). */
export function PhoneInput({ defaultValue, ...props }: Omit<ComponentProps<typeof Input>, "type" | "value">) {
  const [value, setValue] = useState(formatPhone(String(defaultValue ?? "")));
  return (
    <Input
      {...props}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="+33 6 12 34 56 78"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => setValue((v) => formatPhone(v) || v.trim())}
    />
  );
}
