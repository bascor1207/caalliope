"use client";

import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, useEffect, useRef } from "react";
import { cn } from "./cn";

interface Props extends Omit<ComponentPropsWithoutRef<"div">, "children" | "className"> {
  children: ReactNode;
  className?: string;
  delay?: 1 | 2 | 3;
  as?: ElementType;
}

/** Apparition au scroll. Sans JS, `.reveal` ne masque rien (voir `.js .reveal` dans globals.css). */
export function Reveal({ children, className, delay, as: Tag = "div", ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={cn("reveal", className)} data-delay={delay} {...rest}>
      {children}
    </Tag>
  );
}
