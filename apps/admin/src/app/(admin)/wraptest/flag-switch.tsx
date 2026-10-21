"use client";
import { setFlagValue } from "@/app/actions";
import { OptimisticSwitch } from "@/components/optimistic-switch";
export function FlagSwitch({ flagKey, checked }: { flagKey: string; checked: boolean }) {
  return <OptimisticSwitch checked={checked} label={flagKey} action={(next) => setFlagValue(flagKey, next)} successMessage={() => "ok"} />;
}
