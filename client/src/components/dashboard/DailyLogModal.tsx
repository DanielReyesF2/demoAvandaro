import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ClipboardList,
  User,
  MapPin,
  Trash2,
  Scale,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Recycle,
  Leaf,
  Package,
  Truck,
  Clock,
  Building2,
  ChefHat,
  Trees,
  Home,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos de datos
interface WasteEntry {
  type: string;
  category: string;
  quantity: number;
  unit: string;
}

interface DailyRecord {
  id: string;
  timestamp: Date;
  responsible: string;
  area: string;
  areaIcon: React.ReactNode;
  entries: WasteEntry[];
}

// Datos de áreas y responsables del Club Avándaro
const AREAS_DATA = [
  {
    id: 'club-residencial',
    name: 'Club Residencial Avándaro',
    icon: <Home className="w-5 h-5" />,
    responsibles: ['María González', 'Roberto Sánchez', 'Ana Martínez'],
  },
  {
    id: 'campo-golf',
    name: 'Campo de Golf',
    icon: <Trees className="w-5 h-5" />,
    responsibles: ['Carlos Mendoza', 'Luis Hernández', 'Patricia Ruiz'],
  },
  {
    id: 'restaurante-principal',
    name: 'Restaurante La Terraza',
    icon: <ChefHat className="w-5 h-5" />,
    responsibles: ['Chef Miguel Torres', 'Sofía López', 'David García'],
  },
  {
    id: 'restaurante-golf',
    name: 'Restaurante Casa Club',
    icon: <ChefHat className="w-5 h-5" />,
    responsibles: ['Chef Andrea Flores', 'Fernando Díaz', 'Laura Vega'],
  },
  {
    id: 'mantenimiento',
    name: 'Mantenimiento General',
    icon: <Building2 className="w-5 h-5" />,
    responsibles: ['Jorge Ramírez', 'Eduardo Castro', 'Ricardo Morales'],
  },
  {
    id: 'eventos',
    name: 'Salón de Eventos',
    icon: <Users className="w-5 h-5" />,
    responsibles: ['Gabriela Jiménez', 'Alejandro Herrera', 'Monica Reyes'],
  },
];

const WASTE_TYPES = [
  {
    id: 'reciclables',
    name: 'Reciclables',
    icon: <Recycle className="w-5 h-5 text-teal-500" />,
    color: 'bg-teal-50 border-teal-200 text-teal-700',
    categories: ['PET', 'Cartón', 'Vidrio', 'Aluminio', 'Papel', 'Plástico HDPE'],
  },
  {
    id: 'organicos',
    name: 'Orgánicos',
    icon: <Leaf className="w-5 h-5 text-emerald-500" />,
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    categories: ['Residuos de cocina', 'Poda de jardín', 'Restos de comida', 'Cáscaras'],
  },
  {
    id: 'reuso',
    name: 'Para Reuso',
    icon: <Package className="w-5 h-5 text-violet-500" />,
    color: 'bg-violet-50 border-violet-200 text-violet-700',
    categories: ['Mobiliario', 'Textiles', 'Electrónicos', 'Materiales construcción'],
  },
  {
    id: 'relleno',
    name: 'Relleno Sanitario',
    icon: <Truck className="w-5 h-5 text-gray-500" />,
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    categories: ['No reciclable', 'Sanitarios', 'Mezclados', 'Otros'],
  },
];

// Registros de ejemplo para el día de hoy (simulando otras áreas)
const SAMPLE_RECORDS: DailyRecord[] = [
  {
    id: '1',
    timestamp: new Date(new Date().setHours(7, 30)),
    responsible: 'Carlos Mendoza',
    area: 'Campo de Golf',
    areaIcon: <Trees className="w-4 h-4" />,
    entries: [
      { type: 'Orgánicos', category: 'Poda de jardín', quantity: 45, unit: 'kg' },
      { type: 'Reciclables', category: 'Plástico HDPE', quantity: 8, unit: 'kg' },
    ],
  },
  {
    id: '2',
    timestamp: new Date(new Date().setHours(8, 15)),
    responsible: 'Chef Miguel Torres',
    area: 'Restaurante La Terraza',
    areaIcon: <ChefHat className="w-4 h-4" />,
    entries: [
      { type: 'Orgánicos', category: 'Residuos de cocina', quantity: 32, unit: 'kg' },
      { type: 'Reciclables', category: 'Cartón', quantity: 15, unit: 'kg' },
      { type: 'Reciclables', category: 'Vidrio', quantity: 22, unit: 'kg' },
    ],
  },
  {
    id: '3',
    timestamp: new Date(new Date().setHours(9, 0)),
    responsible: 'María González',
    area: 'Club Residencial Avándaro',
    areaIcon: <Home className="w-4 h-4" />,
    entries: [
      { type: 'Reciclables', category: 'PET', quantity: 18, unit: 'kg' },
      { type: 'Reciclables', category: 'Papel', quantity: 12, unit: 'kg' },
      { type: 'Relleno Sanitario', category: 'No reciclable', quantity: 25, unit: 'kg' },
    ],
  },
  {
    id: '4',
    timestamp: new Date(new Date().setHours(10, 45)),
    responsible: 'Jorge Ramírez',
    area: 'Mantenimiento General',
    areaIcon: <Building2 className="w-4 h-4" />,
    entries: [
      { type: 'Para Reuso', category: 'Materiales construcción', quantity: 30, unit: 'kg' },
      { type: 'Reciclables', category: 'Aluminio', quantity: 8, unit: 'kg' },
    ],
  },
];

interface DailyLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DailyLogModal({ open, onOpenChange }: DailyLogModalProps) {
  const [step, setStep] = useState(1);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedResponsible, setSelectedResponsible] = useState('');
  const [selectedWasteType, setSelectedWasteType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [records, setRecords] = useState<DailyRecord[]>(SAMPLE_RECORDS);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setSelectedArea('');
        setSelectedResponsible('');
        setSelectedWasteType('');
        setSelectedCategory('');
        setQuantity('');
        setEntries([]);
        setShowSuccess(false);
      }, 300);
    }
  }, [open]);

  const currentAreaData = AREAS_DATA.find((a) => a.id === selectedArea);
  const currentWasteType = WASTE_TYPES.find((w) => w.id === selectedWasteType);

  const handleAddEntry = () => {
    if (selectedWasteType && selectedCategory && quantity) {
      const wasteType = WASTE_TYPES.find((w) => w.id === selectedWasteType);
      setEntries([
        ...entries,
        {
          type: wasteType?.name || '',
          category: selectedCategory,
          quantity: parseFloat(quantity),
          unit: 'kg',
        },
      ]);
      setSelectedWasteType('');
      setSelectedCategory('');
      setQuantity('');
    }
  };

  const handleSubmit = () => {
    const areaData = AREAS_DATA.find((a) => a.id === selectedArea);
    const newRecord: DailyRecord = {
      id: Date.now().toString(),
      timestamp: new Date(),
      responsible: selectedResponsible,
      area: areaData?.name || '',
      areaIcon: areaData?.icon,
      entries: entries,
    };
    setRecords([newRecord, ...records]);
    setShowSuccess(true);
    setTimeout(() => {
      setStep(6); // Vista de registros del día
      setShowSuccess(false);
    }, 1500);
  };

  const totalSteps = 5;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  const getTotalsByType = () => {
    const totals: Record<string, number> = {};
    records.forEach((record) => {
      record.entries.forEach((entry) => {
        totals[entry.type] = (totals[entry.type] || 0) + entry.quantity;
      });
    });
    return totals;
  };

  const renderStepContent = () => {
    // Vista de éxito
    if (showSuccess) {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Registro Exitoso</h3>
          <p className="text-gray-500">Tu registro ha sido guardado correctamente</p>
        </motion.div>
      );
    }

    // Vista de registros del día
    if (step === 6) {
      const totals = getTotalsByType();
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Registros del Día</h3>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Resumen de totales */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.entries(totals).map(([type, total]) => {
              const wasteType = WASTE_TYPES.find((w) => w.name === type);
              return (
                <div
                  key={type}
                  className={cn(
                    'rounded-lg p-3 border',
                    wasteType?.color || 'bg-gray-50 border-gray-200'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {wasteType?.icon}
                    <span className="text-xs font-medium">{type}</span>
                  </div>
                  <span className="text-lg font-bold">{total.toFixed(1)} kg</span>
                </div>
              );
            })}
          </div>

          {/* Lista de registros */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {records.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      {record.areaIcon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{record.area}</p>
                      <p className="text-xs text-gray-500">{record.responsible}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {formatTime(record.timestamp)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {record.entries.map((entry, idx) => {
                    const wasteType = WASTE_TYPES.find((w) => w.name === entry.type);
                    return (
                      <span
                        key={idx}
                        className={cn(
                          'text-xs px-2 py-1 rounded-full border',
                          wasteType?.color || 'bg-gray-50 border-gray-200'
                        )}
                      >
                        {entry.category}: {entry.quantity}kg
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={() => {
              setStep(1);
              setEntries([]);
              setSelectedArea('');
              setSelectedResponsible('');
            }}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Registro
          </Button>
        </motion.div>
      );
    }

    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Área Operativa</h3>
              <p className="text-sm text-gray-500">Selecciona el área donde se generaron los residuos</p>
            </div>

            <div className="grid gap-2">
              {AREAS_DATA.map((area) => (
                <button
                  key={area.id}
                  onClick={() => {
                    setSelectedArea(area.id);
                    setSelectedResponsible('');
                  }}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                    selectedArea === area.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      selectedArea === area.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {area.icon}
                  </div>
                  <span className="font-medium text-gray-900">{area.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Responsable del Registro</h3>
              <p className="text-sm text-gray-500">Selecciona quién está realizando el registro</p>
            </div>

            <div className="grid gap-2">
              {currentAreaData?.responsibles.map((responsible) => (
                <button
                  key={responsible}
                  onClick={() => setSelectedResponsible(responsible)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                    selectedResponsible === responsible
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                      selectedResponsible === responsible
                        ? 'bg-violet-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {responsible
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <span className="font-medium text-gray-900">{responsible}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Tipo de Residuos</h3>
              <p className="text-sm text-gray-500">Selecciona la categoría de residuos a registrar</p>
            </div>

            <div className="grid gap-2">
              {WASTE_TYPES.map((wasteType) => (
                <button
                  key={wasteType.id}
                  onClick={() => {
                    setSelectedWasteType(wasteType.id);
                    setSelectedCategory('');
                  }}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                    selectedWasteType === wasteType.id
                      ? `border-2 ${wasteType.color}`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      selectedWasteType === wasteType.id ? wasteType.color : 'bg-gray-100'
                    )}
                  >
                    {wasteType.icon}
                  </div>
                  <span className="font-medium text-gray-900">{wasteType.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Detalles del Residuo</h3>
              <p className="text-sm text-gray-500">Especifica categoría y cantidad</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría específica
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentWasteType?.categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad (kg)
                </label>
                <Input
                  type="number"
                  placeholder="Ej: 15.5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="text-lg"
                />
              </div>

              <Button
                onClick={handleAddEntry}
                disabled={!selectedCategory || !quantity}
                className="w-full"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar a la lista
              </Button>

              {entries.length > 0 && (
                <div className="border rounded-xl p-4 bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Residuos agregados:</p>
                  <div className="space-y-2">
                    {entries.map((entry, idx) => {
                      const wasteType = WASTE_TYPES.find((w) => w.name === entry.type);
                      return (
                        <div
                          key={idx}
                          className={cn(
                            'flex items-center justify-between px-3 py-2 rounded-lg border',
                            wasteType?.color || 'bg-white'
                          )}
                        >
                          <span className="text-sm">
                            {entry.type} - {entry.category}
                          </span>
                          <span className="font-bold">{entry.quantity} kg</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirmar Registro</h3>
              <p className="text-sm text-gray-500">Revisa los datos antes de guardar</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  {currentAreaData?.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentAreaData?.name}</p>
                  <p className="text-sm text-gray-500">{selectedResponsible}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Residuos a registrar:</p>
                <div className="space-y-2">
                  {entries.map((entry, idx) => {
                    const wasteType = WASTE_TYPES.find((w) => w.name === entry.type);
                    return (
                      <div
                        key={idx}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-lg border',
                          wasteType?.color || 'bg-white'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {wasteType?.icon}
                          <span className="text-sm font-medium">{entry.category}</span>
                        </div>
                        <span className="font-bold">{entry.quantity} kg</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total registrado:</span>
                  <span className="text-xl font-bold text-emerald-600">
                    {entries.reduce((sum, e) => sum + e.quantity, 0).toFixed(1)} kg
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedArea;
      case 2:
        return !!selectedResponsible;
      case 3:
        return !!selectedWasteType;
      case 4:
        return entries.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-500" />
            Registro Diario de Residuos
          </DialogTitle>
        </DialogHeader>

        {/* Progress bar */}
        {step <= totalSteps && !showSuccess && (
          <div className="flex gap-1 mb-4">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  idx < step ? 'bg-emerald-500' : 'bg-gray-200'
                )}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

        {/* Navigation buttons */}
        {step <= totalSteps && !showSuccess && (
          <div className="flex gap-2 mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
            )}
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={entries.length === 0}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Guardar Registro
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
