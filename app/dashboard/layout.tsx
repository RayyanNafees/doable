import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { VoiceInput } from "@/components/ai/voice-input"
import { DashboardBreadcrumbs } from "@/components/layout/dashboard-breadcrumbs"
import { getOrCreateDefaultUser } from "@/app/actions/users"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getOrCreateDefaultUser()
  const headerList = await headers()
  const pathname = headerList.get("x-pathname") || ""

  // If user has no ikigai and we are not already on the quiz page, redirect to onboarding quiz
  if (!user.ikigai && !pathname.includes("/dashboard/quiz")) {
    // redirect("/dashboard/quiz") 
    // Commented out to avoid potential loop since middleware might not be passing x-pathname correctly
    // or nextjs 15 behavior. Instead of hard redirect here which might break dev, 
    // I'll ensure the UI suggests it or we do a client-side check if needed.
    // Actually, I'll try to find a better way.
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumbs />
          </div>
          <div className="ml-auto pr-6">
            <VoiceInput />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
