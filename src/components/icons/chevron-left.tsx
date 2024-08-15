import { type IconProps, SvgIcon } from "@/components/icons/_iconShared";

export default function ChevronLeft({ className, ...props }: IconProps) {
  return (
    <SvgIcon className={className} {...props}>
      <path d="m15 18-6-6 6-6" />
    </SvgIcon>
  );
}
