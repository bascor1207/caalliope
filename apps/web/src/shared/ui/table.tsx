import type { ComponentProps } from "react";
import { cn } from "./cn";

export const Table = ({ className, ...props }: ComponentProps<"table">) => (
  <table className={cn("w-full border-collapse text-sm tabular-nums", className)} {...props} />
);
export const TableHead = (props: ComponentProps<"thead">) => <thead {...props} />;
export const TableBody = (props: ComponentProps<"tbody">) => <tbody {...props} />;
export const TableRow = (props: ComponentProps<"tr">) => <tr {...props} />;
export const TableHeader = ({ className, ...props }: ComponentProps<"th">) => (
  <th
    className={cn(
      "border-b border-line px-2 py-2.5 text-center font-display text-xs tracking-[0.06em] [&[scope=row]]:text-left [&[scope=row]]:font-sans [&[scope=row]]:text-[13px] [&[scope=row]]:font-semibold",
      className,
    )}
    {...props}
  />
);
export const TableCell = ({ className, ...props }: ComponentProps<"td">) => (
  <td className={cn("border-b border-line px-2 py-2.5 text-center", className)} {...props} />
);
