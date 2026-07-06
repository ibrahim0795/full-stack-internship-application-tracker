import { BriefcaseBusiness, LayoutDashboard } from "lucide-react";

import type { AppNavigationItem } from "./app-shell";

export function appNavigation(active: "applications" | "dashboard") {
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
  ] satisfies AppNavigationItem[];
}
