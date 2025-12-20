import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Botão Hamburguer (apenas mobile) */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center gap-3 border-b border-border bg-card p-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-foreground">Admin Panel</h1>
      </div>

      {/* Main Content */}
      <main className="min-h-screen p-4 pt-20 lg:ml-64 lg:p-6 lg:pt-6">
        <Outlet />
      </main>
    </div>
  );
}
