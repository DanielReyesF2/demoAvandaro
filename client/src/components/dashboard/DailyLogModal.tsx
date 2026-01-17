import { useState, useEffect, useRef } from 'react';
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
import { useToast } from '@/hooks/use-toast';
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
  Camera,
  ImagePlus,
  X,
  Check,
  Sparkles,
  TreeDeciduous,
  Droplets,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos de datos
interface WasteEntry {
  type: string;
  category: string;
  quantity: number;
  unit: string;
  photo?: string;
}

interface DailyRecord {
  id: string;
  timestamp: Date;
  responsible: string;
  area: string;
  areaIcon: React.ReactNode;
  entries: WasteEntry[];
  photos?: string[];
}

// Fotos de ejemplo para el demo - contexto de club de golf y residencial
const SAMPLE_PHOTOS = {
  // Poda de jardín / campo de golf
  poda: 'https://images.unsplash.com/photo-1592722182599-097cf989ab32?w=400&h=300&fit=crop',
  // Residuos orgánicos de cocina
  organicos: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop',
  // Botellas de vidrio reciclables
  vidrio: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
  // Plásticos y PET reciclables
  reciclables: 'https://images.unsplash.com/photo-1572204292164-b35ba943fca7?w=400&h=300&fit=crop',
  // Cartón y papel
  carton: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=300&fit=crop',
  // Bolsas de basura / relleno sanitario
  relleno: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
};

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
    colorSolid: 'bg-teal-500',
    categories: ['PET', 'Cartón', 'Vidrio', 'Aluminio', 'Papel', 'Plástico HDPE'],
  },
  {
    id: 'organicos',
    name: 'Orgánicos',
    icon: <Leaf className="w-5 h-5 text-emerald-500" />,
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    colorSolid: 'bg-emerald-500',
    categories: ['Residuos de cocina', 'Poda de jardín', 'Restos de comida', 'Cáscaras'],
  },
  {
    id: 'reuso',
    name: 'Para Reuso',
    icon: <Package className="w-5 h-5 text-violet-500" />,
    color: 'bg-violet-50 border-violet-200 text-violet-700',
    colorSolid: 'bg-violet-500',
    categories: ['Mobiliario', 'Textiles', 'Electrónicos', 'Materiales construcción'],
  },
  {
    id: 'relleno',
    name: 'Relleno Sanitario',
    icon: <Truck className="w-5 h-5 text-gray-500" />,
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    colorSolid: 'bg-gray-500',
    categories: ['No reciclable', 'Sanitarios', 'Mezclados', 'Otros'],
  },
];

// Pasos del wizard
const STEPS = [
  { id: 1, name: 'Área', icon: MapPin, description: 'Selecciona el área' },
  { id: 2, name: 'Responsable', icon: User, description: 'Quién registra' },
  { id: 3, name: 'Tipo', icon: Trash2, description: 'Tipo de residuo' },
  { id: 4, name: 'Detalles', icon: Scale, description: 'Cantidad y foto' },
  { id: 5, name: 'Confirmar', icon: CheckCircle2, description: 'Revisar y guardar' },
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
    photos: [SAMPLE_PHOTOS.poda],
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
    photos: [SAMPLE_PHOTOS.organicos, SAMPLE_PHOTOS.vidrio],
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
    photos: [SAMPLE_PHOTOS.reciclables, SAMPLE_PHOTOS.carton],
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
    photos: [SAMPLE_PHOTOS.relleno],
  },
];

// Función para calcular impacto ambiental
const calculateEnvironmentalImpact = (totalKg: number) => {
  return {
    trees: Math.round(totalKg * 0.05), // ~1 árbol por cada 20kg reciclados
    water: Math.round(totalKg * 15), // ~15 litros de agua ahorrados por kg
    co2: (totalKg * 0.5).toFixed(1), // ~0.5kg CO2 evitado por kg
  };
};

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
  const [photos, setPhotos] = useState<string[]>([]);
  const [records, setRecords] = useState<DailyRecord[]>(SAMPLE_RECORDS);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newRecordId, setNewRecordId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
        setPhotos([]);
        setShowSuccess(false);
      }, 300);
    }
  }, [open]);

  const currentAreaData = AREAS_DATA.find((a) => a.id === selectedArea);
  const currentWasteType = WASTE_TYPES.find((w) => w.id === selectedWasteType);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

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
      // Solo resetear categoría y cantidad, mantener el tipo para agregar más del mismo
      setSelectedCategory('');
      setQuantity('');
    }
  };

  const handleSubmit = () => {
    const areaData = AREAS_DATA.find((a) => a.id === selectedArea);
    const recordId = Date.now().toString();
    const totalKg = entries.reduce((sum, e) => sum + e.quantity, 0);
    const impact = calculateEnvironmentalImpact(totalKg);

    const newRecord: DailyRecord = {
      id: recordId,
      timestamp: new Date(),
      responsible: selectedResponsible,
      area: areaData?.name || '',
      areaIcon: areaData?.icon,
      entries: entries,
      photos: photos.length > 0 ? photos : undefined,
    };

    setRecords([newRecord, ...records]);
    setNewRecordId(recordId);
    setShowSuccess(true);

    // Toast elegante de confirmación
    toast({
      title: "✅ Registro guardado exitosamente",
      description: `${totalKg.toFixed(1)} kg registrados · Equivale a ${impact.trees} árboles salvados`,
    });

    setTimeout(() => {
      setStep(6);
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

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedArea;
      case 2:
        return !!selectedResponsible;
      case 3:
        return !!selectedWasteType;
      case 4:
        // Permitir avanzar si hay entries O si hay datos pendientes en el formulario
        const hasValidQuantity = quantity && parseFloat(quantity) > 0;
        const hasPendingEntry = selectedCategory && hasValidQuantity;
        return entries.length > 0 || hasPendingEntry;
      case 5:
        return true;
      default:
        return false;
    }
  };

  // Función para manejar el avance de paso con auto-guardado
  const handleNextStep = () => {
    // Si estamos en el paso 4 y hay datos pendientes, agregarlos primero
    if (step === 4 && selectedCategory && quantity && parseFloat(quantity) > 0) {
      // Usar currentWasteType que viene del paso 3
      const newEntry = {
        type: currentWasteType?.name || '',
        category: selectedCategory,
        quantity: parseFloat(quantity),
        unit: 'kg',
      };
      setEntries((prev) => [...prev, newEntry]);
      setSelectedCategory('');
      setQuantity('');
    }
    setStep(step + 1);
  };

  // Stepper visual component
  const Stepper = () => (
    <div className="hidden md:flex items-center justify-between mb-8 px-4">
      {STEPS.map((s, index) => {
        const isCompleted = step > s.id;
        const isCurrent = step === s.id;
        const Icon = s.icon;

        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                    : isCurrent
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 scale-110'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={cn(
                  'text-xs mt-2 font-medium transition-colors',
                  isCurrent ? 'text-emerald-600' : isCompleted ? 'text-emerald-500' : 'text-gray-400'
                )}
              >
                {s.name}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'w-12 lg:w-20 h-1 mx-2 rounded-full transition-colors',
                  isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // Mobile stepper
  const MobileStepper = () => (
    <div className="md:hidden mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">
          Paso {step} de {totalSteps}
        </span>
        <span className="text-sm font-medium text-emerald-600">{STEPS[step - 1]?.name}</span>
      </div>
      <div className="flex gap-1">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={cn(
              'h-2 flex-1 rounded-full transition-colors',
              step >= s.id ? 'bg-emerald-500' : 'bg-gray-200'
            )}
          />
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    // Vista de éxito
    if (showSuccess) {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6"
          >
            <CheckCircle2 className="w-14 h-14 text-emerald-500" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Registro Exitoso</h3>
          <p className="text-gray-500">Tu registro ha sido guardado correctamente</p>
        </motion.div>
      );
    }

    // Vista de registros del día
    if (step === 6) {
      const totals = getTotalsByType();
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">Registros del Día</h3>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Resumen de totales en grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(totals).map(([type, total]) => {
              const wasteType = WASTE_TYPES.find((w) => w.name === type);
              return (
                <div
                  key={type}
                  className={cn('rounded-xl p-4 border-2', wasteType?.color || 'bg-gray-50 border-gray-200')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {wasteType?.icon}
                    <span className="text-xs font-medium truncate">{type}</span>
                  </div>
                  <span className="text-2xl font-bold">{total.toFixed(0)} kg</span>
                </div>
              );
            })}
          </div>

          {/* Lista de registros con fotos */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {records.map((record, index) => {
              const isNew = record.id === newRecordId;
              return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow",
                  isNew ? "border-emerald-400 ring-2 ring-emerald-100" : "border-gray-200"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isNew ? "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600" : "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600"
                    )}>
                      {record.areaIcon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{record.area}</p>
                        {isNew && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white animate-pulse">
                            <Sparkles className="w-3 h-3" />
                            NUEVO
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{record.responsible}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" />
                    {formatTime(record.timestamp)}
                  </div>
                </div>

                {/* Fotos del registro */}
                {record.photos && record.photos.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {record.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Evidencia ${idx + 1}`}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover flex-shrink-0 border-2 border-gray-100"
                      />
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {record.entries.map((entry, idx) => {
                    const wasteType = WASTE_TYPES.find((w) => w.name === entry.type);
                    return (
                      <span
                        key={idx}
                        className={cn(
                          'text-sm px-3 py-1.5 rounded-full border font-medium',
                          wasteType?.color || 'bg-gray-50 border-gray-200'
                        )}
                      >
                        {entry.category}: {entry.quantity}kg
                      </span>
                    );
                  })}
                </div>
              </motion.div>
              );
            })}
          </div>

          <Button
            onClick={() => {
              setStep(1);
              setEntries([]);
              setPhotos([]);
              setSelectedArea('');
              setSelectedResponsible('');
            }}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
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
            {/* Descripción introductoria */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 mb-2">
              <p className="text-sm text-emerald-800 leading-relaxed">
                En esta ventana el equipo puede registrar todos los residuos del club en un solo lugar,
                asegurando <span className="font-semibold">transparencia</span> y <span className="font-semibold">trazabilidad</span> en tiempo real.
              </p>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Selecciona el Área Operativa</h3>
              <p className="text-sm text-gray-500">¿Dónde se generaron los residuos?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {AREAS_DATA.map((area) => (
                <button
                  key={area.id}
                  onClick={() => {
                    setSelectedArea(area.id);
                    setSelectedResponsible('');
                  }}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02]',
                    selectedArea === area.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                      selectedArea === area.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600'
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
              <h3 className="text-xl font-bold text-gray-900">¿Quién realiza el registro?</h3>
              <p className="text-sm text-gray-500">Selecciona al responsable</p>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {currentAreaData?.responsibles.map((responsible) => (
                <button
                  key={responsible}
                  onClick={() => setSelectedResponsible(responsible)}
                  className={cn(
                    'flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all hover:scale-[1.02]',
                    selectedResponsible === responsible
                      ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-100'
                      : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                  )}
                >
                  <div
                    className={cn(
                      'w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-colors',
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
                  <span className="font-medium text-gray-900 text-center text-sm">{responsible}</span>
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
              <h3 className="text-xl font-bold text-gray-900">Tipo de Residuos</h3>
              <p className="text-sm text-gray-500">¿Qué tipo de residuos vas a registrar?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {WASTE_TYPES.map((wasteType) => (
                <button
                  key={wasteType.id}
                  onClick={() => {
                    setSelectedWasteType(wasteType.id);
                    setSelectedCategory('');
                  }}
                  className={cn(
                    'flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left hover:scale-[1.02]',
                    selectedWasteType === wasteType.id
                      ? `border-2 ${wasteType.color} shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <div
                    className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center',
                      selectedWasteType === wasteType.id ? wasteType.colorSolid + ' text-white' : 'bg-gray-100'
                    )}
                  >
                    {wasteType.icon}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">{wasteType.name}</span>
                    <span className="text-xs text-gray-500">{wasteType.categories.slice(0, 3).join(', ')}...</span>
                  </div>
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
            className="space-y-6"
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Detalles del Registro</h3>
              <p className="text-sm text-gray-500">Especifica cantidad y agrega evidencia fotográfica</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Columna izquierda: Formulario */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría específica</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad (kg)</label>
                  <Input
                    type="number"
                    placeholder="Ej: 15.5"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>

                <Button
                  onClick={handleAddEntry}
                  disabled={!selectedCategory || !quantity}
                  className="w-full h-12"
                  variant="outline"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar residuo
                </Button>

                {entries.length > 0 && (
                  <div className="border-2 border-dashed rounded-xl p-4 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Residuos agregados ({entries.length}):
                    </p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
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
                            <span className="text-sm font-medium">
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

              {/* Columna derecha: Fotos */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evidencia fotográfica (opcional)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-500">Click para subir fotos</span>
                  </button>
                </div>

                {/* Preview de fotos */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {photos.map((photo, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={photo}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          onClick={() => removePhoto(idx)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {photos.length < 4 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                      >
                        <ImagePlus className="w-6 h-6 text-gray-400" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Confirmar Registro</h3>
              <p className="text-sm text-gray-500">Revisa los datos antes de guardar</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  {currentAreaData?.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{currentAreaData?.name}</p>
                  <p className="text-gray-500">{selectedResponsible}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-3">Residuos a registrar:</p>
                <div className="space-y-2">
                  {entries.map((entry, idx) => {
                    const wasteType = WASTE_TYPES.find((w) => w.name === entry.type);
                    return (
                      <div
                        key={idx}
                        className={cn(
                          'flex items-center justify-between px-4 py-3 rounded-xl border',
                          wasteType?.color || 'bg-white'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {wasteType?.icon}
                          <span className="font-medium">{entry.category}</span>
                        </div>
                        <span className="font-bold text-lg">{entry.quantity} kg</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fotos adjuntas */}
              {photos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">Evidencia fotográfica:</p>
                  <div className="flex gap-2">
                    {photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Foto ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total registrado:</span>
                  <span className="text-3xl font-bold text-emerald-600">
                    {entries.reduce((sum, e) => sum + e.quantity, 0).toFixed(1)} kg
                  </span>
                </div>
              </div>

              {/* Impacto ambiental */}
              {entries.length > 0 && (() => {
                const totalKg = entries.reduce((sum, e) => sum + e.quantity, 0);
                const impact = calculateEnvironmentalImpact(totalKg);
                return (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Impacto ambiental estimado:
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
                        <TreeDeciduous className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-emerald-700">{impact.trees}</p>
                        <p className="text-xs text-emerald-600">árboles salvados</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
                        <Droplets className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-blue-700">{impact.water}L</p>
                        <p className="text-xs text-blue-600">agua ahorrada</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-200">
                        <Zap className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-amber-700">{impact.co2}kg</p>
                        <p className="text-xs text-amber-600">CO₂ evitado</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              Registro Diario de Residuos
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6">
          {/* Stepper */}
          {step <= totalSteps && !showSuccess && (
            <>
              <Stepper />
              <MobileStepper />
            </>
          )}

          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

          {/* Navigation buttons */}
          {step <= totalSteps && !showSuccess && (
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-12">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Atrás
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  onClick={handleNextStep}
                  disabled={!canProceed()}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-lg"
                >
                  Siguiente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={entries.length === 0}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-lg"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Guardar Registro
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
