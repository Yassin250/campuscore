import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { initials as getInitials } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  image?: string | null;
  /** Tailwind size classes — default "h-9 w-9" */
  className?: string;
  /** Optional fallback string. Defaults to initials from `name`. */
  fallback?: string;
};

export function UserAvatar({
  name,
  image,
  className,
  fallback,
}: UserAvatarProps) {
  return (
    <Avatar className={cn("h-9 w-9", className)}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback>{fallback ?? getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}

UserAvatar.displayName = "UserAvatar";