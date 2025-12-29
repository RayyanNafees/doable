import { MainLayout } from "@/components/layout/main-layout"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { getUsers } from "@/app/actions/users"
import { UserDialog } from "./user-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function UsersPage() {
  const result = await getUsers()
  const users = result.success ? result.data : []

  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div>
            <h1 className="text-2xl font-semibold">Users</h1>
            <p className="text-sm text-muted-foreground">
              Manage users and their psychological profiles
            </p>
          </div>
          <UserDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </UserDialog>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <DataTable columns={columns} data={users} searchKey="email" />
        </div>
      </div>
    </MainLayout>
  )
}

