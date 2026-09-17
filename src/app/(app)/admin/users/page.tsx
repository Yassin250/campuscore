"use client";

import { UserPlus } from "lucide-react";

import { ListView } from "@/components/patterns/list-view";
import { UsersTable } from "@/components/views/admin/users-table";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/notifications/toast-helpers";
import { ROUTES } from "@/lib/constants";

export default function AdminUsersPage() {
  const handleInvite = () => {
    notify.info(
      "Invite coming soon",
      "User invitations will be available once the backend is wired."
    );
  };

  return (
    <ListView
      title="Users"
      description="All users across the platform."
      breadcrumbs={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Users" },
      ]}
      actions={
        <Button onClick={handleInvite}>
          <UserPlus className="h-4 w-4" />
          Invite user
        </Button>
      }
    >
      <UsersTable />
    </ListView>
  );
}