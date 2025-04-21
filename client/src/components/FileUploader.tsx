import { useState, useRef } from 'react';
import { Upload, Eye, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  clientId?: number;
}

interface UploadedFile {
  id: number;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
}

export default function FileUploader({ clientId }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest('POST', '/api/documents/upload', undefined, {
        body: formData,
        headers: {} // Let the browser set the content-type with boundary
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Archivo cargado correctamente",
        description: "El documento se ha procesado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/waste-data'] });
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    },
    onError: (error) => {
      toast({
        title: "Error al cargar el archivo",
        description: error.message || "No se pudo procesar el documento",
        variant: "destructive"
      });
    }
  });
  
  // Since we can't directly upload files, we'll simulate the recent uploads
  const recentUploads = [
    {
      id: 1,
      fileName: "Informe_Octubre_2023.pdf",
      fileSize: 3.2 * 1024 * 1024, // 3.2 MB
      uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: 2,
      fileName: "Reporte_Trimestral_Q3.pdf",
      fileSize: 5.7 * 1024 * 1024, // 5.7 MB
      uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    }
  ] as UploadedFile[];
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (files: FileList) => {
    const file = files[0];
    
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      toast({
        title: "Formato incorrecto",
        description: "Solo se permiten archivos PDF",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Archivo demasiado grande",
        description: "El archivo no debe exceder 10MB",
        variant: "destructive"
      });
      return;
    }
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', (clientId || 1).toString()); // Use provided clientId or default to 1
    
    // Upload the file
    uploadMutation.mutate(formData);
  };
  
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };
  
  const formatRelativeTime = (date: Date): string => {
    const diffInDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    return `Hace ${Math.floor(diffInDays / 30)} meses`;
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-anton uppercase tracking-wider text-gray-800 mb-4">Carga de Documentos</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
          dragActive ? 'border-navy bg-navy bg-opacity-5' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 text-gray-400 mb-3" />
        <p className="mb-2 text-sm text-gray-600">
          {uploadMutation.isPending ? (
            "Procesando archivo..."
          ) : (
            "Arrastra los archivos PDF aquí o"
          )}
        </p>
        <button 
          className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-md hover:bg-navy-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy"
          onClick={onButtonClick}
          disabled={uploadMutation.isPending}
        >
          Examinar archivos
        </button>
        <p className="mt-2 text-xs text-gray-500">PDF hasta 10MB</p>
      </div>
      
      {/* Recent Uploads */}
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Archivos recientes</h3>
        <ul className="divide-y divide-gray-200">
          {recentUploads.map((file) => (
            <li key={file.id} className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"/>
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-800">{file.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.fileSize)} - Subido {formatRelativeTime(file.uploadDate)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-navy">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="text-gray-500 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
