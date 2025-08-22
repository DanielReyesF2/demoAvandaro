import { Link, useLocation } from "wouter";
import { 
  Home,
  Leaf, 
  Zap, 
  Droplets, 
  Recycle,
  Calendar,
  FileText,
  BarChart3,
  Upload,
  Download,
  Settings,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TenantSidebarProps {
  clientSlug: string;
}

export default function TenantSidebar({ clientSlug }: TenantSidebarProps) {
  const [location] = useLocation();

  const clientConfig = {
    'cccm': {
      name: 'CCCM',
      fullName: 'Club Campestre Ciudad de México',
      primaryColor: '#273949',
      secondaryColor: '#b5e951'
    },
    'club-de-golf-avandaro': {
      name: 'Avándaro Golf',
      fullName: 'Club de Golf Avándaro',
      primaryColor: '#0f4a3e',
      secondaryColor: '#7dd87d'
    },
    'rancho-avandaro': {
      name: 'Rancho Avándaro',
      fullName: 'Rancho Avándaro',
      primaryColor: '#4a3e0f',
      secondaryColor: '#e6d87d'
    }
  }[clientSlug] || {
    name: 'Cliente',
    fullName: 'Cliente Desconocido',
    primaryColor: '#273949',
    secondaryColor: '#b5e951'
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: `/${clientSlug}/dashboard`,
      description: 'Panel principal'
    },
    {
      name: 'Residuos',
      icon: Leaf,
      path: `/${clientSlug}/registro-diario`,
      description: 'Gestión de residuos',
      children: [
        { name: 'Registro Diario', path: `/${clientSlug}/registro-diario`, icon: Calendar },
        { name: 'Historial Mensual', path: `/${clientSlug}/historial-mensual`, icon: FileText },
        { name: 'Trazabilidad', path: `/${clientSlug}/trazabilidad-residuos`, icon: BarChart3 }
      ]
    },
    {
      name: 'Energía',
      icon: Zap,
      path: `/${clientSlug}/energia`,
      description: 'Monitoreo energético'
    },
    {
      name: 'Agua',
      icon: Droplets,
      path: `/${clientSlug}/agua`,
      description: 'Gestión hídrica'
    },
    {
      name: 'Economía Circular',
      icon: Recycle,
      path: `/${clientSlug}/economia-circular`,
      description: 'Índice sustentabilidad'
    }
  ];

  const utilityItems = [
    {
      name: 'Documentos',
      icon: FileText,
      path: `/${clientSlug}/documents`,
      description: 'Archivos y reportes'
    },
    {
      name: 'Análisis',
      icon: BarChart3,
      path: `/${clientSlug}/analysis`,
      description: 'Analytics avanzados'
    },
    {
      name: 'Exportar Datos',
      icon: Download,
      path: `/${clientSlug}/export`,
      description: 'Descargas y CSV'
    }
  ];

  const isActive = (path: string) => location === path;
  const isParentActive = (item: any) => {
    if (isActive(item.path)) return true;
    return item.children?.some((child: any) => isActive(child.path));
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div 
        className="p-6 text-white"
        style={{ backgroundColor: clientConfig.primaryColor }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-black font-bold"
            style={{ backgroundColor: clientConfig.secondaryColor }}
          >
            {clientConfig.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-bold text-lg">{clientConfig.name}</h1>
            <p className="text-xs opacity-80">ECONOVA Multi-Tenant</p>
          </div>
        </div>
        
        <Badge 
          className="text-xs px-2 py-1"
          style={{ 
            backgroundColor: `${clientConfig.secondaryColor}20`,
            color: clientConfig.secondaryColor,
            border: `1px solid ${clientConfig.secondaryColor}40`
          }}
        >
          /{clientSlug}
        </Badge>
      </div>

      {/* Back to client selector */}
      <div className="p-4 border-b border-gray-100">
        <Link href="/">
          <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cambiar Cliente
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const parentActive = isParentActive(item);
            return (
              <div key={item.name}>
                <Link href={item.path}>
                  <Button
                    variant={parentActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      parentActive 
                        ? 'text-white shadow-sm' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    style={parentActive ? { 
                      backgroundColor: clientConfig.primaryColor 
                    } : {}}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.children && (
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        parentActive ? 'rotate-90' : ''
                      }`} />
                    )}
                  </Button>
                </Link>
                
                {/* Submenu */}
                {item.children && parentActive && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                    {item.children.map((child: any) => (
                      <Link key={child.name} href={child.path}>
                        <Button
                          variant={isActive(child.path) ? "secondary" : "ghost"}
                          size="sm"
                          className={`w-full justify-start text-xs ${
                            isActive(child.path)
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          <child.icon className="w-3 h-3 mr-2" />
                          {child.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Separator className="my-6" />

        {/* Utility Items */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            Herramientas
          </h3>
          {utilityItems.map((item) => (
            <Link key={item.name} href={item.path}>
              <Button
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  isActive(item.path)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                <div className="flex-1 text-left">
                  <div className="text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <div className="font-semibold">{clientConfig.fullName}</div>
          <div className="mt-1">Sistema Ambiental Multi-Tenant</div>
        </div>
      </div>
    </div>
  );
}