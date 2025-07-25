"use client";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, FileVideo, Layout, Settings, LogOut, Users, Presentation, Wand2, HelpCircle, BarChart } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname() ?? "";

  // If on enterprise dashboard, do not render this layout
  if (pathname.startsWith("/dashboard/enterprise")) {
    return <>{children}</>;
  }

  const getDashboardHome = () => {
    if (!user) return "/dashboard";
    switch (user.plan) {
      case "pro":
        return "/dashboard/pro";
      case "enterprise":
        return "/dashboard/enterprise";
      default:
        return "/dashboard";
    }
  };

  const navigation = [
    { name: "Home", href: getDashboardHome(), icon: Home },
    { name: "Templates", href: "/dashboard/templates", icon: Wand2 },
    { name: "Brand Kits", href: "/dashboard/brand-kits", icon: Presentation },
    { name: "Usage", href: "/dashboard/usage", icon: BarChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-orange-50 to-muse-orange/10">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r flex flex-col py-6 px-4 min-h-screen">
        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition text-left w-full ${
                  active
                    ? "bg-gradient-to-r from-muse-red to-muse-orange text-white shadow"
                    : "text-gray-700 hover:bg-orange-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-2 border-t border-gray-200" />

          {/* User Profile & Logout */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg text-gray-600">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
            <Button
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition"
              variant="outline"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </nav>
      </aside>
      {/* Main content */}
      <div className="flex-1">
        <main className="py-6">
          <div className="px-6">{children}</div>
        </main>
      </div>
    </div>
  );
} 