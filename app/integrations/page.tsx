import { MainLayout } from "@/components/layout/main-layout"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { getIntegrations } from "@/app/actions/integrations"
import { IntegrationDialog } from "./integration-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getUsers } from "@/app/actions/users"

export default async function IntegrationsPage() {
  const integrationsResult = await getIntegrations()
  const usersResult = await getUsers()
  
  const integrations = integrationsResult.success ? integrationsResult.data : []
  const users = usersResult.success ? usersResult.data : []

  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div>
            <h1 className="text-2xl font-semibold">Integrations</h1>
            <p className="text-sm text-muted-foreground">
              Manage external platform integrations (Email, ClickUp, Todoist)
            </p>
          </div>
          <IntegrationDialog userIds={users}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
          </IntegrationDialog>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <DataTable columns={columns} data={integrations} searchKey="platform" />
        </div>
      </div>
    </MainLayout>
  )
}

