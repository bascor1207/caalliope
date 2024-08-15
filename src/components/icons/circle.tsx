import { type IconProps, SvgIcon } from "@/components/icons/_iconShared";

export default function Circle({ className, ...props }: IconProps) {
  return (
    <SvgIcon className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
    </SvgIcon>
  );
}
