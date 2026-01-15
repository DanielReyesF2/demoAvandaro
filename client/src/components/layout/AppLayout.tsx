import { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Determinar breadcrumbs y título según la ruta
  const getBreadcrumbs = () => {
    if (location === "/") {
      return [{ label: "Inicio" }, { label: "Dashboard" }];
    }
    return [{ label: "Inicio", href: "/" }, { label: location.replace("/", "").replace(/-/g, " ") }];
  };

  const getTitle = () => {
    if (title) return title;
    if (location === "/") return "Dashboard Ejecutivo";
    return "Dashboard";
  };

  const getSubtitle = () => {
    if (subtitle) return subtitle;
    if (location === "/") return "Vista general de KPIs y métricas de ventas - Econova";
    return "";
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 flex z-20 w-64 transition-transform duration-300 ease-in-out transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:hidden`}>
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden bg-white">
        {/* Header superior */}
        <header className="hidden md:block border-b border-subtle bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Breadcrumbs items={getBreadcrumbs()} />
              <h1 className="text-2xl font-semibold text-gray-900 mt-3 tracking-tight">
                {getTitle()}
              </h1>
              {getSubtitle() && (
                <p className="text-sm text-gray-600 mt-1.5">
                  {getSubtitle()}
                </p>
              )}
            </div>
            {/* Icono Econova circular */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-green flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Econova</span>
            </div>
          </div>
        </header>

        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between h-16 bg-white border-b border-subtle px-4">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar}>
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="w-8 h-8 rounded-full bg-accent-green flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Econova</span>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
