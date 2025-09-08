// TRUE Zero Waste Diagnostic Configuration
// Based on the advanced questionnaire structure

export interface DiagnosticQuestion {
  id: string;
  text: string;
  type: "single";
  options: Record<string, number>;
  description?: string;
}

export interface DiagnosticModule {
  id: string;
  name: string;
  weight: number;
  description: string;
  icon: string;
  color: string;
  questions: DiagnosticQuestion[];
  gate_blockers?: string[];
  gate_threshold?: number;
}

export const DIAGNOSTIC_CONFIG: DiagnosticModule[] = [
  {
    id: "A",
    name: "Requisitos de Elegibilidad",
    description: "Evaluación inicial para determinar si están listos para TRUE Zero Waste",
    icon: "🧱",
    color: "from-red-500 to-orange-500",
    weight: 0,
    gate_blockers: ["A1", "A3", "A4", "A5", "A6", "A7"],
    gate_threshold: 0.8,
    questions: [
      {
        id: "A1",
        text: "¿Tienen política Zero Waste formal?",
        type: "single",
        options: { "Sí": 1, "En desarrollo": 0.5, "No": 0 },
        description: "Una política formal documentada es esencial para TRUE"
      },
      {
        id: "A2",
        text: "¿Está definido el alcance (áreas incluidas/excluidas)?",
        type: "single",
        options: { "Sí": 1, "Parcial": 0.5, "No": 0 }
      },
      {
        id: "A3",
        text: "¿Cumplimiento legal al día?",
        type: "single",
        options: { "Sí": 1, "Parcial": 0.5, "No": 0 },
        description: "Cumplimiento ambiental es prerequisito"
      },
      {
        id: "A4",
        text: "¿Cuentan con 12 meses de datos por material?",
        type: "single",
        options: { "Sí": 1, "Parcial": 0.5, "No": 0 },
        description: "TRUE requiere 12 meses consecutivos de datos"
      },
      {
        id: "A5",
        text: "¿Promedio anual de desvío ≥ 90%?",
        type: "single",
        options: { "Sí": 1, "No": 0, "No sabemos": 0.3 },
        description: "90% de desvío es el mínimo para TRUE"
      },
      {
        id: "A6",
        text: "¿Miden % de contaminación en reciclables/compost?",
        type: "single",
        options: { "Sí": 1, "A veces": 0.5, "No": 0 }
      },
      {
        id: "A7",
        text: "¿Tienen responsable designado para datos y reporte?",
        type: "single",
        options: { "Sí": 1, "No": 0 }
      }
    ]
  },
  {
    id: "B",
    name: "Medición y Trazabilidad",
    description: "Sistemas de pesaje, registro y seguimiento de materiales",
    icon: "📊",
    color: "from-blue-500 to-cyan-500",
    weight: 0.15,
    questions: [
      {
        id: "B1",
        text: "Método de medición de residuos",
        type: "single",
        options: {
          "Báscula fija": 1,
          "Báscula portátil": 0.8,
          "Proveedor": 0.7,
          "Estimación": 0.3
        }
      },
      {
        id: "B2",
        text: "Frecuencia de registro",
        type: "single",
        options: {
          "Diario": 1,
          "Semanal": 0.8,
          "Mensual": 0.6,
          "Esporádico": 0.2
        }
      },
      {
        id: "B3",
        text: "Registro por material",
        type: "single",
        options: { "Sí": 1, "Parcial": 0.6, "No": 0 }
      },
      {
        id: "B4",
        text: "Registro por área generadora",
        type: "single",
        options: { "Sí": 1, "Parcial": 0.6, "No": 0 }
      },
      {
        id: "B5",
        text: "¿Reciben reportes mensuales de proveedor?",
        type: "single",
        options: { "Sí": 1, "Básicos": 0.6, "No": 0 }
      },
      {
        id: "B6",
        text: "¿Registran rechazos del proveedor?",
        type: "single",
        options: { "Siempre": 1, "A veces": 0.6, "Nunca": 0 }
      },
      {
        id: "B7",
        text: "¿Realizan auditoría física anual?",
        type: "single",
        options: { "Sí": 1, "Planeada": 0.6, "No": 0 }
      }
    ]
  },
  {
    id: "C",
    name: "Compras Preferibles",
    description: "Políticas de adquisiciones sustentables y contenido reciclado",
    icon: "🛒",
    color: "from-green-500 to-emerald-500",
    weight: 0.10,
    questions: [
      {
        id: "C1",
        text: "¿Tienen política de compras preferibles?",
        type: "single",
        options: { "Sí": 1, "En desarrollo": 0.6, "No": 0 }
      },
      {
        id: "C2",
        text: "Uso de contenedores retornables en F&B",
        type: "single",
        options: { "Siempre": 1, "A veces": 0.6, "Nunca": 0 }
      },
      {
        id: "C3",
        text: "Exigen contenido reciclado en insumos clave",
        type: "single",
        options: { "Sí": 1, "Algunos rubros": 0.6, "No": 0 }
      },
      {
        id: "C4",
        text: "Evitan desechables cuando hay alternativa",
        type: "single",
        options: { "Siempre": 1, "A veces": 0.6, "Nunca": 0 }
      },
      {
        id: "C5",
        text: "% del gasto con criterios sustentables",
        type: "single",
        options: {
          "76–100%": 1,
          "51–75%": 0.8,
          "26–50%": 0.6,
          "0–25%": 0.3
        }
      }
    ]
  },
  {
    id: "G",
    name: "Recuperación de Materiales",
    description: "Separación, reciclaje y gestión de calidad",
    icon: "♻️",
    color: "from-purple-500 to-pink-500",
    weight: 0.12,
    questions: [
      {
        id: "G1",
        text: "Número de categorías de separación",
        type: "single",
        options: { "7+": 1, "5–6": 0.8, "3–4": 0.6, "1–2": 0.3 }
      },
      {
        id: "G2",
        text: "Contenedores claramente identificados",
        type: "single",
        options: { "Sí": 1, "Parcial": 0.6, "No": 0 }
      },
      {
        id: "G3",
        text: "Vidrio segregado en bares/restaurantes",
        type: "single",
        options: { "Sí": 1, "Parcial": 0.6, "No": 0 }
      },
      {
        id: "G4",
        text: "PET/papel separado en habitaciones",
        type: "single",
        options: { "Sí": 1, "Parcial": 0.6, "No": 0 }
      },
      {
        id: "G5",
        text: "Segregación de metales en mantenimiento",
        type: "single",
        options: { "Sí": 1, "Parcial": 0.6, "No": 0 }
      },
      {
        id: "G6",
        text: "Checklists de contaminación",
        type: "single",
        options: { "Sí": 1, "No": 0 }
      },
      {
        id: "G7",
        text: "Muestreo mensual de calidad",
        type: "single",
        options: { "Sí": 1, "A veces": 0.6, "No": 0 }
      }
    ]
  },
  {
    id: "H",
    name: "Manejo de Orgánicos",
    description: "Compostaje, donación de alimentos y gestión de residuos verdes",
    icon: "🌱",
    color: "from-lime-500 to-green-500",
    weight: 0.10,
    questions: [
      {
        id: "H1",
        text: "Separación de orgánicos en cocina",
        type: "single",
        options: { "Sí": 1, "Parcial": 0.6, "No": 0 }
      },
      {
        id: "H2",
        text: "Donación de alimentos aptos",
        type: "single",
        options: { "Sí": 1, "Ocasional": 0.6, "No": 0 }
      },
      {
        id: "H3",
        text: "Manejo de poda y jardinería",
        type: "single",
        options: {
          "Compost": 1,
          "Mulch": 0.8,
          "Mixto": 0.7,
          "Disposición": 0.2
        }
      },
      {
        id: "H4",
        text: "Área de compost en sitio",
        type: "single",
        options: { "Sí": 1, "Planeada": 0.6, "No": 0 }
      },
      {
        id: "H5",
        text: "Proveedor de compostaje con reportes",
        type: "single",
        options: { "Sí": 1, "N/A": 0.8, "No": 0 }
      }
    ]
  },
  {
    id: "J",
    name: "Capacitación y Liderazgo",
    description: "Entrenamiento del personal y cultura organizacional",
    icon: "🧑‍🏫",
    color: "from-indigo-500 to-purple-500",
    weight: 0.12,
    questions: [
      {
        id: "J1",
        text: "Onboarding Zero Waste para nuevos empleados",
        type: "single",
        options: { "Sí": 1, "No": 0 }
      },
      {
        id: "J2",
        text: "Frecuencia de capacitación",
        type: "single",
        options: {
          "Trimestral": 1,
          "Semestral": 0.8,
          "Anual": 0.6,
          "No": 0
        }
      },
      {
        id: "J3",
        text: "KPIs/Metas visibles en áreas",
        type: "single",
        options: { "Sí": 1, "No": 0 }
      },
      {
        id: "J4",
        text: "Incentivos por desempeño ambiental",
        type: "single",
        options: { "Sí": 1, "En diseño": 0.6, "No": 0 }
      },
      {
        id: "J5",
        text: "Responsable formal y comité activo",
        type: "single",
        options: { "Sí": 1, "Parcial": 0.6, "No": 0 }
      }
    ]
  },
  {
    id: "ENERGIA",
    name: "Gestión Energética",
    description: "Evaluación de eficiencia y energías renovables",
    icon: "⚡",
    color: "from-yellow-500 to-orange-500",
    weight: 0,
    questions: [
      {
        id: "EN1",
        text: "¿Tienen paneles solares instalados?",
        type: "single",
        options: { "Sí": 1, "Planeados": 0.6, "No": 0 }
      },
      {
        id: "EN2",
        text: "% de energía cubierta con renovables",
        type: "single",
        options: {
          "76–100%": 1,
          "51–75%": 0.8,
          "26–50%": 0.6,
          "0–25%": 0.3
        }
      },
      {
        id: "EN3",
        text: "Monitoreo de producción solar",
        type: "single",
        options: { "Sí": 1, "No": 0 }
      },
      {
        id: "EN4",
        text: "% de iluminación LED",
        type: "single",
        options: {
          "76–100%": 1,
          "51–75%": 0.8,
          "26–50%": 0.6,
          "0–25%": 0.3
        }
      }
    ]
  },
  {
    id: "AGUA",
    name: "Gestión del Agua",
    description: "Tratamiento, reutilización y conservación hídrica",
    icon: "💧",
    color: "from-cyan-500 to-blue-500",
    weight: 0,
    questions: [
      {
        id: "AG1",
        text: "PTAR (Planta Tratadora) operativa",
        type: "single",
        options: { "Sí": 1, "En construcción": 0.6, "No": 0 }
      },
      {
        id: "AG2",
        text: "Reúso de agua tratada",
        type: "single",
        options: {
          "Riego": 1,
          "Limpieza": 0.8,
          "Otro": 0.6,
          "No la usan": 0
        }
      },
      {
        id: "AG3",
        text: "Sistema de captación pluvial",
        type: "single",
        options: { "Sí": 1, "Planeada": 0.6, "No": 0 }
      },
      {
        id: "AG4",
        text: "Monitoreo de consumo de agua",
        type: "single",
        options: { "Sí": 1, "No": 0 }
      }
    ]
  }
];

// Scoring logic
export function scoreModule(module: DiagnosticModule, answers: Record<string, string>): number {
  if (module.weight === 0) return 0; // Skip modules with 0 weight
  
  const sum = module.questions.reduce((acc, question) => {
    const answer = answers[question.id];
    const score = question.options[answer] ?? 0;
    return acc + score;
  }, 0);
  
  return (sum / module.questions.length) * module.weight;
}

export function calculateReadinessIndex(answers: Record<string, string>): {
  gateStatus: boolean;
  readinessIndex: number;
  moduleScores: Record<string, number>;
} {
  const gateModule = DIAGNOSTIC_CONFIG.find(m => m.id === "A")!;
  
  // Check gate blockers
  const gateStatus = gateModule.gate_blockers!.every(questionId => {
    const question = gateModule.questions.find(q => q.id === questionId)!;
    const answer = answers[questionId];
    const score = question.options[answer] ?? 0;
    return score >= gateModule.gate_threshold!;
  });
  
  // Calculate module scores
  const moduleScores: Record<string, number> = {};
  let totalScore = 0;
  
  DIAGNOSTIC_CONFIG.forEach(module => {
    const score = scoreModule(module, answers);
    moduleScores[module.id] = score;
    totalScore += score;
  });
  
  return {
    gateStatus,
    readinessIndex: Math.round(totalScore * 100),
    moduleScores
  };
}