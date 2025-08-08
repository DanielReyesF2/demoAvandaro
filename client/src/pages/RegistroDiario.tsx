import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Save, 
  Recycle,
  Leaf,
  RotateCcw,
  Trash2,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Weight,
  MapPin
} from 'lucide-react';

interface DailyWasteEntry {
  type: 'recycling' | 'compost' | 'reuse' | 'landfill';
  material: string;
  kg: number;
  location: string;
  notes?: string;
}

export default function RegistroDiario() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Configuración de materiales por tipo
  const materialOptions = {
    recycling: [
      'Papel Mixto',
      'Papel de oficina', 
      'Revistas',
      'Periódico',
      'Cartón',
      'PET',
      'Plástico Duro',
      'HDPE',
      'Tin Can',
      'Aluminio',
      'Vidrio',
      'Fierro',
      'Residuo electrónico'
    ],
    compost: [
      'Poda San Sebastián',
      'Jardinería',
      'Residuos de cocina',
      'Restos orgánicos'
    ],
    reuse: [
      'Vidrio donación',
      'Mobiliario',
      'Equipos reutilizables'
    ],
    landfill: [
      'Orgánico',
      'Inorgánico'
    ]
  };

  // Opciones de ubicación en el club
  const locationOptions = [
    'Comedor Principal',
    'Casa Club',
    'Área de Piscinas',
    'Canchas de Tenis',
    'Campo de Golf',
    'Jardines',
    'Área Administrativa',
    'Cocina',
    'Mantenimiento',
    'Área de Servicios'
  ];

  // Obtener totales del día actual para mostrar progreso
  const today = new Date().toISOString().split('T')[0];
  const { data: dailyTotals } = useQuery({
    queryKey: ['/api/daily-totals', today],
    queryFn: async () => {
      const response = await fetch(`/api/daily-totals/${today}`);
      if (!response.ok) throw new Error('Failed to fetch daily totals');
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  // Mutación para guardar entrada diaria
  const saveMutation = useMutation({
    mutationFn: async (entry: DailyWasteEntry) => {
      const response = await fetch('/api/daily-waste', {
        method: 'POST',
        body: JSON.stringify({
          ...entry,
          date: new Date().toISOString(),
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to save entry');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "✅ Registro guardado",
        description: "Los datos se han actualizado en tiempo real en todos los reportes",
      });
      
      // Limpiar formulario
      setSelectedType('');
      setSelectedMaterial('');
      setWeight('');
      setLocation('');
      setNotes('');
      
      // Invalidar queries para actualizar datos
      queryClient.invalidateQueries({ queryKey: ['/api/daily-totals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/waste-excel'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudo guardar el registro",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedType || !selectedMaterial || !weight || !location) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const entry: DailyWasteEntry = {
      type: selectedType as 'recycling' | 'compost' | 'reuse' | 'landfill',
      material: selectedMaterial,
      kg: parseFloat(weight),
      location,
      notes: notes || undefined
    };

    saveMutation.mutate(entry);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recycling': return <Recycle className="h-5 w-5 text-emerald-600" />;
      case 'compost': return <Leaf className="h-5 w-5 text-amber-600" />;
      case 'reuse': return <RotateCcw className="h-5 w-5 text-blue-600" />;
      case 'landfill': return <Trash2 className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recycling': return 'border-emerald-200 bg-emerald-50';
      case 'compost': return 'border-amber-200 bg-amber-50';
      case 'reuse': return 'border-blue-200 bg-blue-50';
      case 'landfill': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-anton uppercase tracking-wide text-navy">
                  Registro Diario de Residuos
                </h1>
                <p className="text-gray-600 mt-1">
                  Captura datos en tiempo real - Sin papeles, sin esperas
                </p>
              </div>
              
              <div className="flex items-center gap-2 bg-lime-100 text-navy px-4 py-2 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString('es-MX', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario de registro */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Weight className="h-5 w-5" />
                    Nuevo Registro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tipo de residuo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Residuo *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'recycling', label: 'Reciclaje', icon: Recycle, color: 'emerald' },
                        { value: 'compost', label: 'Composta', icon: Leaf, color: 'amber' },
                        { value: 'reuse', label: 'Reuso', icon: RotateCcw, color: 'blue' },
                        { value: 'landfill', label: 'Relleno', icon: Trash2, color: 'red' }
                      ].map(({ value, label, icon: Icon, color }) => (
                        <button
                          key={value}
                          onClick={() => {
                            setSelectedType(value);
                            setSelectedMaterial(''); // Reset material when type changes
                          }}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            selectedType === value 
                              ? `border-${color}-500 bg-${color}-50` 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Icon className={`h-6 w-6 ${
                              selectedType === value ? `text-${color}-600` : 'text-gray-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              selectedType === value ? `text-${color}-800` : 'text-gray-600'
                            }`}>
                              {label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Material específico */}
                  {selectedType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Material Específico *
                      </label>
                      <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialOptions[selectedType as keyof typeof materialOptions]?.map((material) => (
                            <SelectItem key={material} value={material}>
                              {material}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Peso */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Peso (kg) *
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="0.0"
                      className="text-lg"
                    />
                  </div>

                  {/* Ubicación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación en el Club *
                    </label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="¿Dónde se generó el residuo?" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationOptions.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {loc}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notas opcionales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas adicionales (opcional)
                    </label>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Observaciones, condiciones especiales, etc."
                    />
                  </div>

                  {/* Botón de guardar */}
                  <Button
                    onClick={handleSubmit}
                    disabled={saveMutation.isPending || !selectedType || !selectedMaterial || !weight || !location}
                    className="w-full bg-lime-500 hover:bg-lime-600 text-navy text-lg py-6"
                  >
                    {saveMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-navy border-t-transparent"></div>
                        Guardando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        Registrar Residuo
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Panel de totales del día */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Totales de Hoy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dailyTotals ? (
                    <>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Recycle className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium">Reciclaje</span>
                          </div>
                          <span className="font-bold text-emerald-700">
                            {(dailyTotals.recycling || 0).toFixed(1)} kg
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-medium">Composta</span>
                          </div>
                          <span className="font-bold text-amber-700">
                            {(dailyTotals.compost || 0).toFixed(1)} kg
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <RotateCcw className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Reuso</span>
                          </div>
                          <span className="font-bold text-blue-700">
                            {(dailyTotals.reuse || 0).toFixed(1)} kg
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium">Relleno</span>
                          </div>
                          <span className="font-bold text-red-700">
                            {(dailyTotals.landfill || 0).toFixed(1)} kg
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center p-3 bg-navy/5 rounded-lg">
                          <span className="text-sm font-bold text-navy">Total del día</span>
                          <span className="text-lg font-bold text-navy">
                            {((dailyTotals.recycling || 0) + (dailyTotals.compost || 0) + (dailyTotals.reuse || 0) + (dailyTotals.landfill || 0)).toFixed(1)} kg
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">Sin registros hoy</p>
                      <p className="text-gray-500 text-xs">¡Haz el primer registro!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ventajas vs proceso actual */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lime-700">
                    <CheckCircle className="h-5 w-5" />
                    Ventajas vs Proceso Actual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Datos en tiempo real</span>
                    </div>
                    <div className="flex items-center gap-3 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Sin papeles ni escaneos</span>
                    </div>
                    <div className="flex items-center gap-3 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Reportes automáticos</span>
                    </div>
                    <div className="flex items-center gap-3 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Trazabilidad completa</span>
                    </div>
                    <div className="flex items-center gap-3 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Alertas automáticas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}