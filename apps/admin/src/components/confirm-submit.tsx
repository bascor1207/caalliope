"use client";

import type { ReactNode } from "react";

/** Bouton d'envoi qui demande confirmation avant de soumettre son formulaire. */
export function ConfirmSubmit({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
