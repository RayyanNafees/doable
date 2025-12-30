"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

const routeMap: Record<string, string> = {
  "/dashboard": "Today",
  "/dashboard/tasks": "All Tasks",
  "/dashboard/matrix": "Eisenhower Matrix",
  "/dashboard/pomodoro": "Reverse Pomodoro",
  "/dashboard/assistant": "AI Assistant",
  "/dashboard/calendar": "Calendar",
  "/dashboard/projects": "Project Management",
  "/dashboard/projects/planner": "AI Project Planner",
  "/dashboard/quiz": "Ikigai Quiz",
  "/dashboard/profile": "Psychology Profile",
  "/dashboard/integrations": "Integrations",
  "/dashboard/employees": "Employees",
  "/dashboard/users": "Users",
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname()
  const currentPage = routeMap[pathname] || "Dashboard"

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">
            Doable
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
