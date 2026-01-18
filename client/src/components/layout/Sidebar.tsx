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
      flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group
      ${
        isActive 
          ? "bg-accent-green/10 text-accent-green font-medium shadow-premium-sm" 
          : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
      }
    `}>
      <div className="flex items-center gap-3">
        <span className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
        <span className="text-sm font-medium">{children}</span>
      </div>
      {hasArrow && (
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isActive ? 'translate-x-0 opacity-100' : 'group-hover:translate-x-0.5 opacity-0 group-hover:opacity-100'}`} />
      )}
    </Link>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  const [selectedCompany, setSelectedCompany] = useState("Rancho Avandaro");
  
  return (
    <div className="flex flex-col w-72 bg-white border-r border-subtle h-screen shadow-premium-sm">
      {/* Logo Grupo Avandaro */}
      <div className="flex items-center justify-center h-24 px-4 border-b border-subtle bg-gradient-to-br from-white to-gray-50/50">
        <img 
          src="/descarga (1).png" 
          alt="Grupo Avandaro" 
          className="h-16 w-auto object-contain"
        />
      </div>
      
      {/* Barra de búsqueda - Premium */}
      <div className="p-5 border-b border-subtle bg-white">
        <SearchBar />
        <p className="text-xs text-gray-500 mt-3 text-center leading-relaxed">
          Pregunta lo que quieras sobre tus datos
        </p>
      </div>
      
      {/* Selector de Empresa - Premium */}
      <div className="p-5 border-b border-subtle bg-white">
        <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">
          EMPRESA
        </div>
        <CompanyToggle
          options={["Rancho Avandaro", "Club Avandaro"]}
          defaultValue={selectedCompany}
          onChange={setSelectedCompany}
        />
      </div>
      
      {/* Navigation - Premium */}
      <nav className="flex-1 pt-6 px-5 pb-4 overflow-y-auto bg-white">
        <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">
          PRINCIPAL
        </div>
        <div className="space-y-1.5 mb-8">
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
        
        <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4 mt-8">
          SISTEMA
        </div>
        <div className="space-y-1.5">
          <SidebarItem 
            to="/documents" 
            icon={<Settings className="w-4 h-4" />} 
            isActive={location === "/documents"}
            hasArrow={false}
          >
            Administración
          </SidebarItem>
        </div>
      </nav>
      
      {/* Cerrar sesión - Premium */}
      <div className="p-5 border-t border-subtle bg-white">
        <button className="flex items-center gap-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 w-full px-3 py-2 rounded-lg hover:bg-gray-100/80">
          <LogOut className="w-4 h-4" />
          <span>→ Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
