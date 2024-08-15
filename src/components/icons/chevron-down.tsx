import { type IconProps, SvgIcon } from '@/components/icons/_iconShared';

export default function ChevronDown({ className, ...props }: IconProps) {
  return (
    <SvgIcon className={className} {...props}>
      <path d='M8 10l4 4 4-4' />
    </SvgIcon>
  );
}
