"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/DataTable";

import { type User } from "@/features/users";

import { useUpdateUserRoleMutation } from "@/services/userApi";

const userColumn: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const [updateUser] = useUpdateUserRoleMutation();
      const user = row.original;
      const [userRole, setUserRole] = useState(user.role);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              {userRole}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Edit User Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={userRole}
              onValueChange={setUserRole}
            >
              <DropdownMenuRadioItem
                onClick={() => updateUser({ ...user, role: "ADMIN" })}
                value="ADMIN"
              >
                Admin
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                onClick={() => updateUser({ ...user, role: "USER" })}
                value="USER"
              >
                User
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "url",
    header: "Url",
  },
  {
    accessorKey: "bio",
    header: "Biography",
  },
];

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <DataTable
      columns={userColumn}
      data={users}
      placeholder="Search by name"
      filterBy="name"
    />
  );
};

export default UserTable;
