import AppLayout from '@/components/layout/AppLayout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Download, Trash2, Upload, FileText } from 'lucide-react';
import FileUploader from '@/components/FileUploader';

export default function Documents() {
  // Fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ['/api/documents'],
    refetchOnWindowFocus: false
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };
  
  return (
    <AppLayout>
      <div className="p-5">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-anton text-gray-800 uppercase tracking-wider">Documentos</h1>
              <p className="mt-1 text-sm text-gray-500">Gestiona los documentos de residuos</p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button size="sm" className="bg-lime hover:bg-lime-dark text-black">
                <Upload className="w-4 h-4 mr-2" />
                Cargar Documento
              </Button>
            </div>
          </div>
          
          {/* File Uploader */}
          <FileUploader />
          
          {/* Documents Table */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-anton tracking-wider">Documentos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                </div>
              ) : documents && documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Nombre</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Fecha de Carga</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc: any) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-red-500 mr-2" />
                            {doc.fileName}
                          </div>
                        </TableCell>
                        <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                        <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                        <TableCell>
                          {doc.processed ? (
                            doc.processingError ? (
                              <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                Error
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Procesado
                              </span>
                            )
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              Pendiente
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay documentos disponibles
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
