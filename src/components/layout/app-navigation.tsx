import {
  BriefcaseBusiness,
  CalendarDays,
  Columns3,
  LayoutDashboard,
} from "lucide-react";

import type { AppNavigationItem } from "./app-shell";

export function appNavigation(
  active: "applications" | "calendar" | "dashboard" | "kanban",
) {
  return [
    {
      active: active === "dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard aria-hidden="true" size={18} />,
      label: "Dashboard",
    },
    {
      active: active === "applications",
      href: "/applications",
      icon: <BriefcaseBusiness aria-hidden="true" size={18} />,
      label: "Applications",
    },
    {
      active: active === "kanban",
      href: "/kanban",
      icon: <Columns3 aria-hidden="true" size={18} />,
      label: "Kanban",
    },
    {
      active: active === "calendar",
      href: "/calendar",
      icon: <CalendarDays aria-hidden="true" size={18} />,
      label: "Calendar",
    },
  ] satisfies AppNavigationItem[];
}
