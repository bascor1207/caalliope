import { type IconProps, SvgIcon } from '@/components/icons/_iconShared';

export default function ArrowRight({ className, ...props }: IconProps) {
  return (
    <SvgIcon className={className} {...props}>
      <path d='M5 12h14' />
      <path d='m12 5 7 7-7' />
    </SvgIcon>
  );
}
