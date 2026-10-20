/**
 * Numéros de téléphone : normalisation E.164 (+33652599271) et affichage lisible (+33 6 52 59 92 71).
 * Pur, sans dépendance ; France par défaut, tout indicatif international accepté.
 */
export function normalizePhone(raw: string, defaultCountry = "33"): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const plus = trimmed.startsWith("+");
  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  if (plus) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 9) return `+${defaultCountry}${digits}`;
  if (digits.startsWith(defaultCountry) && digits.length === defaultCountry.length + 9) return `+${digits}`;
  return `+${defaultCountry}${digits}`;
}

const pairs = (s: string) => s.match(/.{1,2}/g)?.join(" ") ?? s;

/** Affichage : France « +33 6 52 59 92 71 », autres pays « +44 7700 900 123 » (groupes de 3-4). */
export function formatPhone(value: string, defaultCountry = "33"): string {
  const e164 = normalizePhone(value, defaultCountry);
  if (!e164) return "";
  const digits = e164.slice(1);
  if (digits.startsWith("33") && digits.length === 11) return `+33 ${digits[2]} ${pairs(digits.slice(3))}`;
  const cc = digits.length > 10 ? digits.slice(0, 2) : digits.slice(0, 2);
  const rest = digits.slice(cc.length);
  const groups = rest.length > 8 ? rest.match(/.{1,4}(?=(.{3})*$)|.+/g) : rest.match(/.{1,3}/g);
  return `+${cc} ${(groups ?? [rest]).join(" ")}`.trim();
}
