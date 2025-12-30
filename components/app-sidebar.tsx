"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "User",
    email: "user@doable.ai",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Tasks",
      url: "/dashboard/tasks",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Today",
          url: "/dashboard",
        },
        {
          title: "All Tasks",
          url: "/dashboard/tasks",
        },
        {
          title: "Calendar",
          url: "/dashboard/calendar",
        },
      ],
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: Frame,
      items: [
        {
          title: "Management",
          url: "/dashboard/projects",
        },
        {
          title: "AI Planner",
          url: "/dashboard/projects/planner",
        },
      ],
    },
    {
      title: "Focus & Productivity",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "AI Assistant",
          url: "/dashboard/assistant",
        },
        {
          title: "Eisenhower Matrix",
          url: "/dashboard/matrix",
        },
      ],
    },
    {
      title: "Self Discovery",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Ikigai Quiz",
          url: "/dashboard/quiz",
        },
      ],
    },
    {
      title: "Settings & Team",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Integrations",
          url: "/dashboard/integrations",
        },
        {
          title: "Employees",
          url: "/dashboard/employees",
        },
        {
          title: "Users",
          url: "/dashboard/users",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Personal Goals",
      url: "#",
      icon: Frame,
    },
    {
      name: "Work Projects",
      url: "#",
      icon: PieChart,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Doable</span>
                  <span className="truncate text-xs">AI Productivity</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
