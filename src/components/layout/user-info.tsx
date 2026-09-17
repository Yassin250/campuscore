import { UserAvatar } from "./user-avatar";
import { cn } from "@/lib/utils";

type UserInfoProps = {
  name: string;
  email: string;
  image?: string | null;
  /** Avatar size classes — default "h-10 w-10" */
  avatarClassName?: string;
  /** Text size variant */
  size?: "sm" | "default";
  /** Extra classes on the wrapper */
  className?: string;
};

export function UserInfo({
  name,
  email,
  image,
  avatarClassName = "h-10 w-10",
  size = "default",
  className,
}: UserInfoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <UserAvatar
        name={name}
        image={image}
        className={avatarClassName}
      />
      <div className="flex min-w-0 flex-col text-left">
        <span
          className={cn(
            "truncate font-medium text-foreground",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "truncate text-muted-foreground",
            size === "sm" ? "text-[10px]" : "text-xs"
          )}
        >
          {email}
        </span>
      </div>
    </div>
  );
}

UserInfo.displayName = "UserInfo";