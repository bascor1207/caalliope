import { type IconProps, SvgIcon } from "@/components/icons/_iconShared";

export default function SettingsIcon({ className, ...props }: IconProps) {
  return (
    <SvgIcon className={className} {...props}>
      <path d="M12.22 2h-.44a2 2 0 0-2 2v.18a2 1-1 1.73l-.43.25a2 1-2 0l-.15-.08a2 0-2.73.73l-.22.38a2 .73 2.73l.15.1a2 1 1.72v.51a2 1.74l-.15.09a2 0-.73 2.73l.22.38a2 2.73.73l.15-.08a2 0l.43.25a2 1.73V20a2 2h.44a2 2-2v-.18a2 1-1.73l.43-.25a2 0l.15.08a2 2.73-.73l.22-.39a2 0-.73-2.73l-.15-.08a2 1-1-1.74v-.5a2 1-1.74l.15-.09a2 .73-2.73l-.22-.38a2 0-2.73-.73l-.15.08a2 0l-.43-.25a2 1-1-1.73V4a2 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </SvgIcon>
  );
}
