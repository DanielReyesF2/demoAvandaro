import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Users, UserPlus, Edit, Trash2, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Client } from '@shared/schema';

export default function Clients() {
  // Fetch clients
  const { data: clients, isLoading } = useQuery({
    queryKey: ['/api/clients'],
    refetchOnWindowFocus: false
  });
  
  return (
    <AppLayout>
      <div className="p-5">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-anton text-gray-800 uppercase tracking-wider">Clientes</h1>
              <p className="mt-1 text-sm text-gray-500">Administra los clientes de la plataforma</p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button size="sm" className="bg-lime hover:bg-lime-dark text-black">
                <UserPlus className="w-4 h-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>
          </div>
          
          {/* Clients List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-anton tracking-wider flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Listado de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                </div>
              ) : clients && clients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client: Client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay clientes registrados
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase">Total Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{clients?.length || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase">Documentos Procesados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase">Residuos Gestionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">142 ton</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
