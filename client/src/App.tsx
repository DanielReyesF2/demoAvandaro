import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Documents from "@/pages/documents";
import Analysis from "@/pages/analysis";
import DataEntry from "@/pages/DataEntry";
import ResiduosExcel from "@/pages/ResiduosExcel";
import RegistroDiario from "@/pages/RegistroDiario";
import HistorialMensual from "@/pages/HistorialMensual";
import Energia from "@/pages/Energia";
import Agua from "@/pages/Agua";
import EconomiaCircular from "@/pages/EconomiaCircular";
import DataExport from "@/pages/DataExport";
import MultiTenantDashboard from "@/components/MultiTenantDashboard";
import TenantSidebar from "@/components/TenantSidebar";
import { Leaf, Droplets, Zap, Recycle } from "lucide-react";

// Temporary simple components until we fix the imports  
const AdminDashboard = () => <div className="p-8">Admin Dashboard - Coming Soon</div>;
const ClientSelector = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
    {/* Header */}
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-[#b5e951] p-3 rounded-xl mr-4">
              <Leaf className="h-8 w-8 text-[#273949]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">ECONOVA</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema Integral de Gestión Ambiental Multi-Tenant
          </p>
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Droplets className="h-4 w-4 mr-1 text-blue-500" />
              <span>Gestión de Agua</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1 text-yellow-500" />
              <span>Eficiencia Energética</span>
            </div>
            <div className="flex items-center">
              <Recycle className="h-4 w-4 mr-1 text-green-500" />
              <span>Economía Circular</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Selecciona tu Cliente
          </h2>
          <p className="text-lg text-gray-600">
            Accede al dashboard ambiental de tu organización
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* CCCM Card */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#273949]/5 to-[#b5e951]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative p-8">
              {/* Logo/Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#273949] to-[#1e2a35] rounded-xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              
              {/* Content */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Club Campestre Ciudad de México
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Sistema líder en gestión sustentable
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#273949]">72%</div>
                    <div className="text-xs text-gray-600">Índice Circular</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">TRUE</div>
                    <div className="text-xs text-gray-600">Zero Waste</div>
                  </div>
                </div>
              </div>
              
              {/* Button */}
              <button 
                onClick={() => window.location.href = '/cccm/dashboard'}
                className="w-full bg-gradient-to-r from-[#273949] to-[#1e2a35] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#1e2a35] hover:to-[#273949] transition-all duration-300 transform group-hover:scale-105 shadow-lg"
              >
                Acceder al Dashboard
              </button>
            </div>
          </div>

          {/* Club Avándaro Card */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative p-8">
              {/* Logo/Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              
              {/* Content */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Club de Golf Avándaro
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Excelencia en sostenibilidad
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-emerald-600">65%</div>
                    <div className="text-xs text-gray-600">Índice Circular</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className="text-xs text-gray-600">Agua Reciclada</div>
                  </div>
                </div>
              </div>
              
              {/* Button */}
              <button 
                onClick={() => window.location.href = '/club-de-golf-avandaro/dashboard'}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300 transform group-hover:scale-105 shadow-lg"
              >
                Acceder al Dashboard
              </button>
            </div>
          </div>

          {/* Rancho Avándaro Card */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative p-8">
              {/* Logo/Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              
              {/* Content */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Rancho Avándaro
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Innovación en gestión ambiental
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-amber-600">58%</div>
                    <div className="text-xs text-gray-600">Índice Circular</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-orange-600">320</div>
                    <div className="text-xs text-gray-600">kW Solar</div>
                  </div>
                </div>
              </div>
              
              {/* Button */}
              <button 
                onClick={() => window.location.href = '/rancho-avandaro/dashboard'}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-700 hover:to-amber-600 transition-all duration-300 transform group-hover:scale-105 shadow-lg"
              >
                Acceder al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <div className="mb-4 md:mb-0">
            <p>© 2025 ECONOVA. Sistema Multi-Tenant de Gestión Ambiental.</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Sistema Operativo</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>3 Clientes Activos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Tenant wrapper with navigation
interface TenantWrapperProps {
  clientSlug: string;
  children: React.ReactNode;
}
const TenantWrapper = ({ clientSlug, children }: TenantWrapperProps) => (
  <div data-tenant={clientSlug} className="flex h-screen">
    <TenantSidebar clientSlug={clientSlug} />
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
);

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      
      {/* Client Selector (landing page) */}
      <Route path="/" component={ClientSelector} />
      
      {/* Tenant Routes - Direct route matching */}
      <Route path="/cccm/dashboard">
        <TenantWrapper clientSlug="cccm">
          <Dashboard />
        </TenantWrapper>
      </Route>
      <Route path="/cccm/registro-diario">
        <TenantWrapper clientSlug="cccm">
          <RegistroDiario />
        </TenantWrapper>
      </Route>
      <Route path="/cccm/historial-mensual">
        <TenantWrapper clientSlug="cccm">
          <HistorialMensual />
        </TenantWrapper>
      </Route>
      <Route path="/cccm/trazabilidad-residuos">
        <TenantWrapper clientSlug="cccm">
          <ResiduosExcel />
        </TenantWrapper>
      </Route>
      <Route path="/cccm/energia">
        <TenantWrapper clientSlug="cccm">
          <Energia />
        </TenantWrapper>
      </Route>
      <Route path="/cccm/agua">
        <TenantWrapper clientSlug="cccm">
          <Agua />
        </TenantWrapper>
      </Route>
      <Route path="/cccm/economia-circular">
        <TenantWrapper clientSlug="cccm">
          <EconomiaCircular />
        </TenantWrapper>
      </Route>
      
      {/* Club Avándaro Routes */}
      <Route path="/club-de-golf-avandaro/dashboard">
        <TenantWrapper clientSlug="club-de-golf-avandaro">
          <Dashboard />
        </TenantWrapper>
      </Route>
      <Route path="/club-de-golf-avandaro/registro-diario">
        <TenantWrapper clientSlug="club-de-golf-avandaro">
          <RegistroDiario />
        </TenantWrapper>
      </Route>
      <Route path="/club-de-golf-avandaro/energia">
        <TenantWrapper clientSlug="club-de-golf-avandaro">
          <Energia />
        </TenantWrapper>
      </Route>
      <Route path="/club-de-golf-avandaro/agua">
        <TenantWrapper clientSlug="club-de-golf-avandaro">
          <Agua />
        </TenantWrapper>
      </Route>
      
      {/* Rancho Avándaro Routes */}
      <Route path="/rancho-avandaro/dashboard">
        <TenantWrapper clientSlug="rancho-avandaro">
          <Dashboard />
        </TenantWrapper>
      </Route>
      <Route path="/rancho-avandaro/registro-diario">
        <TenantWrapper clientSlug="rancho-avandaro">
          <RegistroDiario />
        </TenantWrapper>
      </Route>
      <Route path="/rancho-avandaro/energia">
        <TenantWrapper clientSlug="rancho-avandaro">
          <Energia />
        </TenantWrapper>
      </Route>
      <Route path="/rancho-avandaro/agua">
        <TenantWrapper clientSlug="rancho-avandaro">
          <Agua />
        </TenantWrapper>
      </Route>
      
      {/* Legacy routes for backwards compatibility (redirect to CCCM) */}
      <Route path="/registro-diario">
        {() => {
          window.location.href = "/cccm/registro-diario";
          return null;
        }}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
