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
// Temporary simple components until we fix the imports
const AdminDashboard = () => <div className="p-8">Admin Dashboard - Coming Soon</div>;
const ClientSelector = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-8">ECONOVA - Selecciona tu Cliente</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">Club Campestre Ciudad de México</h3>
          <button 
            onClick={() => window.location.href = '/cccm/dashboard'}
            className="bg-[#273949] text-white px-4 py-2 rounded w-full"
          >
            Acceder
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">Club de Golf Avándaro</h3>
          <button 
            onClick={() => window.location.href = '/club-de-golf-avandaro/dashboard'}
            className="bg-[#273949] text-white px-4 py-2 rounded w-full"
          >
            Acceder
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">Rancho Avándaro</h3>
          <button 
            onClick={() => window.location.href = '/rancho-avandaro/dashboard'}
            className="bg-[#273949] text-white px-4 py-2 rounded w-full"
          >
            Acceder
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Simple tenant wrapper
interface TenantWrapperProps {
  clientSlug: string;
  children: React.ReactNode;
}
const TenantWrapper = ({ clientSlug, children }: TenantWrapperProps) => (
  <div data-tenant={clientSlug}>
    <div className="bg-blue-100 p-2 text-sm text-center">
      Cliente activo: <strong>{clientSlug}</strong>
    </div>
    {children}
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
      
      {/* Rancho Avándaro Routes */}
      <Route path="/rancho-avandaro/dashboard">
        <TenantWrapper clientSlug="rancho-avandaro">
          <Dashboard />
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
