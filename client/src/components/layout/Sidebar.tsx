import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Table,
  Droplets,
  Zap,
  FileText,
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { CompanyToggle } from "@/components/ui/company-toggle";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  hasArrow?: boolean;
}

const SidebarItem = ({ to, icon, children, isActive, hasArrow = false }: SidebarItemProps) => {
  return (
    <Link href={to} className={`
      flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors
      ${
        isActive 
          ? "bg-accent-green/10 text-accent-green font-medium" 
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      }
    `}>
      <div className="flex items-center gap-3">
        <span className="w-5 h-5">{icon}</span>
        <span className="text-sm">{children}</span>
      </div>
      {hasArrow && (
        <ChevronRight className="w-4 h-4 text-gray-400" />
      )}
    </Link>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  const [selectedCompany, setSelectedCompany] = useState("Rancho Avandaro");
  
  return (
    <div className="flex flex-col w-72 bg-sidebar border-r border-subtle h-screen">
      {/* Icono Econova circular pequeño */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-subtle">
        <div className="w-10 h-10 rounded-full bg-accent-green flex items-center justify-center">
          <span className="text-white font-bold text-lg">E</span>
        </div>
      </div>
      
      {/* Barra de búsqueda */}
      <div className="p-4 border-b border-subtle">
        <SearchBar />
        <p className="text-xs text-gray-500 mt-2 text-center">
          Pregunta lo que quieras sobre tus datos
        </p>
      </div>
      
      {/* Selector de Empresa */}
      <div className="p-4 border-b border-subtle">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          EMPRESA
        </div>
        <CompanyToggle
          options={["Rancho Avandaro", "Club Avandaro"]}
          defaultValue={selectedCompany}
          onChange={setSelectedCompany}
        />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 pt-6 px-4 pb-4 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          PRINCIPAL
        </div>
        <div className="space-y-1 mb-6">
          <SidebarItem 
            to="/" 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            isActive={location === "/"}
            hasArrow={false}
          >
            Dashboard
          </SidebarItem>
          <SidebarItem 
            to="/trazabilidad-residuos" 
            icon={<Table className="w-5 h-5" />} 
            isActive={location === "/trazabilidad-residuos" || location === "/registro-diario"}
            hasArrow={true}
          >
            Trazabilidad
          </SidebarItem>
          <SidebarItem 
            to="/agua" 
            icon={<Droplets className="w-5 h-5" />} 
            isActive={location === "/agua"}
            hasArrow={true}
          >
            Agua
          </SidebarItem>
          <SidebarItem 
            to="/energia" 
            icon={<Zap className="w-5 h-5" />} 
            isActive={location === "/energia"}
            hasArrow={true}
          >
            Energía
          </SidebarItem>
          <SidebarItem 
            to="/reports" 
            icon={<FileText className="w-5 h-5" />} 
            isActive={location === "/reports"}
            hasArrow={false}
          >
            Reportes
          </SidebarItem>
        </div>
        
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 mt-6">
          SISTEMA
        </div>
        <div className="space-y-1">
          <SidebarItem 
            to="/documents" 
            icon={<Settings className="w-5 h-5" />} 
            isActive={location === "/documents"}
            hasArrow={false}
          >
            Administración
          </SidebarItem>
        </div>
      </nav>
      
      {/* Cerrar sesión */}
      <div className="p-4 border-t border-subtle">
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors w-full">
          <LogOut className="w-4 h-4" />
          <span>→ Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
