import { BriefcaseBusiness, Columns3, LayoutDashboard } from "lucide-react";

import type { AppNavigationItem } from "./app-shell";

export function appNavigation(active: "applications" | "dashboard" | "kanban") {
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
  ] satisfies AppNavigationItem[];
}
