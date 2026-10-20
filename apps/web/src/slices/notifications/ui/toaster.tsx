"use client";

import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { eventBus } from "@/shared/event-bus";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectToasts, type Toast, toastDismissed } from "../application/notifications.slice";

const TTL = 3200;

function ToastItem({ toast }: { toast: Toast }) {
  const t = useTranslations("notifications");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const id = window.setTimeout(() => dispatch(toastDismissed({ id: toast.id })), TTL);
    return () => window.clearTimeout(id);
  }, [dispatch, toast.id]);

  const message =
    toast.kind === "cart-added"
      ? t("cartAdded", toast.params)
      : toast.kind === "order-placed"
        ? t("orderPlaced", toast.params)
        : toast.kind === "message"
          ? toast.params.text
          : t("subscribed");
  const error = toast.kind === "message" && toast.tone === "error";

  return (
    <div
      className={`flex items-center gap-2.5 rounded-full px-[18px] py-3 text-sm font-medium shadow-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-400 ${error ? "bg-danger text-white" : "bg-success text-white"}`}
    >
      {error ? (
        <XCircleIcon className="size-4 shrink-0" aria-hidden="true" />
      ) : (
        <CheckCircle2Icon className="size-4 shrink-0" aria-hidden="true" />
      )}
      {message}
      {"action" in toast && toast.action === "open-cart" && (
        <button
          type="button"
          className="underline underline-offset-[3px]"
          onClick={() => eventBus.publish("cart.open-requested", {})}
        >
          {t("viewCart")}
        </button>
      )}
    </div>
  );
}

export function Toaster() {
  const toasts = useAppSelector(selectToasts);
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-100 flex flex-col items-center gap-2 px-4"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
