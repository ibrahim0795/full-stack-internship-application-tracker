import {
  BriefcaseBusiness,
  CalendarDays,
  Columns3,
  LayoutDashboard,
  MessagesSquare,
} from "lucide-react";

import type { AppNavigationItem } from "./app-shell";

export function appNavigation(
  active: "applications" | "calendar" | "dashboard" | "interviews" | "kanban",
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
    {
      active: active === "interviews",
      href: "/interviews",
      icon: <MessagesSquare aria-hidden="true" size={18} />,
      label: "Interviews",
    },
  ] satisfies AppNavigationItem[];
}
