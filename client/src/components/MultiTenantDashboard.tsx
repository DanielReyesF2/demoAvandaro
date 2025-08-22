import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Zap, 
  Droplets, 
  Recycle, 
  TrendingUp, 
  Calendar,
  FileText,
  Settings
} from "lucide-react";

interface TenantDashboardProps {
  clientSlug: string;
}

export default function MultiTenantDashboard({ clientSlug }: TenantDashboardProps) {
  // Fetch tenant info
  const { data: tenantInfo, isLoading: tenantLoading } = useQuery({
    queryKey: ['/api/tenant/info', clientSlug],
  });

  // Fetch tenant-specific data
  const { data: wasteData, isLoading: wasteLoading } = useQuery({
    queryKey: ['/api/waste-data'],
    enabled: !!tenantInfo
  });

  if (tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273949] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const clientConfig = {
    'cccm': {
      name: 'Club Campestre Ciudad de México',
      primaryColor: '#273949',
      secondaryColor: '#b5e951',
      description: 'Sistema integral de gestión ambiental'
    },
    'club-de-golf-avandaro': {
      name: 'Club de Golf Avándaro',
      primaryColor: '#0f4a3e',
      secondaryColor: '#7dd87d',
      description: 'Excelencia en sostenibilidad'
    },
    'rancho-avandaro': {
      name: 'Rancho Avándaro',
      primaryColor: '#4a3e0f',
      secondaryColor: '#e6d87d',
      description: 'Innovación en gestión ambiental'
    }
  }[clientSlug] || {
    name: 'Cliente Desconocido',
    primaryColor: '#273949',
    secondaryColor: '#b5e951',
    description: 'Sistema de gestión ambiental'
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard - {clientConfig.name}
          </h1>
          <p className="text-gray-600">
            Vista general del sistema ambiental para {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Residuos Totales</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847 kg</div>
              <p className="text-xs text-muted-foreground">
                +12% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energía Solar</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234 kWh</div>
              <p className="text-xs text-muted-foreground">
                +8% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agua Tratada</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,678 L</div>
              <p className="text-xs text-muted-foreground">
                +5% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Índice Circular</CardTitle>
              <Recycle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">
                Meta: 85% para 2026
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progreso Mensual</CardTitle>
                  <CardDescription>
                    Seguimiento de metas ambientales para {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reducción de Residuos</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: '67%',
                          backgroundColor: clientConfig.secondaryColor 
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximas Actividades</CardTitle>
                  <CardDescription>
                    Tareas y reportes pendientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Reporte Mensual</p>
                        <p className="text-xs text-gray-500">Vence en 5 días</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Auditoría Trimestral</p>
                        <p className="text-xs text-gray-500">Programada para próxima semana</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  name: 'Gestión de Residuos', 
                  icon: Leaf, 
                  route: `/${clientSlug}/registro-diario`,
                  description: 'Registro diario y trazabilidad' 
                },
                { 
                  name: 'Energía', 
                  icon: Zap, 
                  route: `/${clientSlug}/energia`,
                  description: 'Monitoreo solar y eficiencia' 
                },
                { 
                  name: 'Agua', 
                  icon: Droplets, 
                  route: `/${clientSlug}/agua`,
                  description: 'PTAR y sistema de lagunas' 
                },
                { 
                  name: 'Economía Circular', 
                  icon: Recycle, 
                  route: `/${clientSlug}/economia-circular`,
                  description: 'Índice de sustentabilidad' 
                }
              ].map((module) => (
                <Card 
                  key={module.name}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => window.location.href = module.route}
                >
                  <CardHeader className="text-center">
                    <div 
                      className="w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: clientConfig.primaryColor }}
                    >
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {module.name}
                    </CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reportes Disponibles</CardTitle>
                <CardDescription>
                  Genera reportes personalizados para {clientConfig.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                    style={{ borderColor: clientConfig.primaryColor }}
                  >
                    <h4 className="font-medium">Reporte Mensual</h4>
                    <p className="text-sm text-gray-600">Consolidado de todas las métricas</p>
                  </button>
                  <button 
                    className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                    style={{ borderColor: clientConfig.primaryColor }}
                  >
                    <h4 className="font-medium">Certificación TRUE</h4>
                    <p className="text-sm text-gray-600">Progreso hacia Zero Waste</p>
                  </button>
                  <button 
                    className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                    style={{ borderColor: clientConfig.primaryColor }}
                  >
                    <h4 className="font-medium">Dashboard Ejecutivo</h4>
                    <p className="text-sm text-gray-600">Métricas para la junta directiva</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Avanzados</CardTitle>
                <CardDescription>
                  Insights y tendencias para {clientConfig.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Analytics Personalizados
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Visualizaciones de datos específicas para {clientConfig.name}
                  </p>
                  <button 
                    className="px-4 py-2 text-white rounded-lg"
                    style={{ backgroundColor: clientConfig.primaryColor }}
                  >
                    Ver Analytics Completos
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}