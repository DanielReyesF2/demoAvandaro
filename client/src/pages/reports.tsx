import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, PlusCircle, Calendar, BarChart, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function Reports() {
  const [clientFilter, setClientFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Mock reports data
  const reports = [
    { 
      id: 1, 
      name: 'Reporte Mensual - Octubre 2023', 
      type: 'monthly', 
      client: 'Empresa Sustentable S.A.', 
      clientId: 1,
      date: new Date(2023, 9, 31), 
      size: '2.4 MB' 
    },
    { 
      id: 2, 
      name: 'Análisis Trimestral Q3 2023', 
      type: 'quarterly', 
      client: 'EcoServicios SpA', 
      clientId: 2,
      date: new Date(2023, 9, 15), 
      size: '3.8 MB' 
    },
    { 
      id: 3, 
      name: 'Resumen Anual 2022', 
      type: 'annual', 
      client: 'Constructora Verde Ltda.',
      clientId: 3, 
      date: new Date(2023, 0, 15), 
      size: '5.1 MB' 
    },
    { 
      id: 4, 
      name: 'Reporte Mensual - Septiembre 2023', 
      type: 'monthly', 
      client: 'Empresa Sustentable S.A.', 
      clientId: 1,
      date: new Date(2023, 8, 30), 
      size: '2.2 MB' 
    },
  ];
  
  // Filter reports based on selected filters
  const filteredReports = reports.filter(report => {
    if (clientFilter !== 'all' && report.clientId.toString() !== clientFilter) return false;
    if (typeFilter !== 'all' && report.type !== typeFilter) return false;
    return true;
  });
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getReportTypeIcon = (type: string) => {
    switch(type) {
      case 'monthly':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'quarterly':
        return <BarChart className="h-4 w-4 text-purple-500" />;
      case 'annual':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getReportTypeBadge = (type: string) => {
    switch(type) {
      case 'monthly':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            Mensual
          </span>
        );
      case 'quarterly':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
            Trimestral
          </span>
        );
      case 'annual':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            Anual
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            Otro
          </span>
        );
    }
  };
  
  return (
    <AppLayout>
      <div className="p-5">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-anton text-gray-800 uppercase tracking-wider">Reportes</h1>
              <p className="mt-1 text-sm text-gray-500">Reportes de gestión de residuos</p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button size="sm" className="bg-lime hover:bg-lime-dark text-black">
                <PlusCircle className="w-4 h-4 mr-2" />
                Nuevo Reporte
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-anton tracking-wider flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los clientes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los clientes</SelectItem>
                      <SelectItem value="1">Empresa Sustentable S.A.</SelectItem>
                      <SelectItem value="2">EcoServicios SpA</SelectItem>
                      <SelectItem value="3">Constructora Verde Ltda.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="annual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-anton tracking-wider">Reportes Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredReports.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Nombre</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium flex items-center">
                          {getReportTypeIcon(report.type)}
                          <span className="ml-2">{report.name}</span>
                        </TableCell>
                        <TableCell>{report.client}</TableCell>
                        <TableCell>{getReportTypeBadge(report.type)}</TableCell>
                        <TableCell>{formatDate(report.date)}</TableCell>
                        <TableCell>{report.size}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="ml-2">Descargar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron reportes con los filtros seleccionados
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
