import { DataTable } from "@/components/data-table"
import { getUsers } from "@/app/actions/users"
import { UserDialog } from "./user-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { columns } from "./columns"

import { User } from "@/lib/types"

export default async function UsersPage() {
  const result = await getUsers()
  const users = (result.success ? result.data : []) as User[]

  return (
    <div className="p-4">
      <div className="mx-auto max-w-7xl w-full space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage system users and their access levels.
            </p>
          </div>
          <UserDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </UserDialog>
        </header>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <DataTable columns={columns} data={users} searchKey="email" />
        </div>
      </div>
    </div>
  )
}
