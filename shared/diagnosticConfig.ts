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
    name: "Evaluación Estratégica",
    description: "Análisis de oportunidades para maximizar el impacto de TRUE Zero Waste",
    icon: "🧱",
    color: "from-red-500 to-orange-500",
    weight: 0,
    gate_blockers: ["A1", "A3", "A4", "A5", "A6", "A7"],
    gate_threshold: 0.8,
    questions: [
      {
        id: "A1",
        text: "¿Su organización cuenta con una política formal de Zero Waste documentada?",
        type: "single",
        options: { "Sí, tenemos política formal y procedimientos": 1, "Tenemos compromisos informales": 0.5, "No tenemos política específica": 0 },
        description: "Política formal es requisito base para certificación TRUE"
      },
      {
        id: "A2",
        text: "¿Tienen definidas las áreas que incluirían en un programa de sustentabilidad?",
        type: "single",
        options: { "Completamente definido": 1, "Tenemos ideas generales": 0.5, "No está definido": 0 }
      },
      {
        id: "A3",
        text: "¿Cumplen con todas las regulaciones ambientales aplicables?",
        type: "single",
        options: { "Sí, cumplimos completamente": 1, "Cumplimos en su mayoría": 0.5, "Tenemos áreas de mejora": 0 },
        description: "Cumplimiento regulatorio es pre-requisito TRUE"
      },
      {
        id: "A4",
        text: "¿Tienen sistema de medición y registro de residuos por flujo?",
        type: "single",
        options: { "Sí, medimos todos los flujos mensualmente": 1, "Medimos flujos principales": 0.5, "No medimos sistemáticamente": 0 },
        description: "Medición precisa es fundamental para TRUE"
      },
      {
        id: "A5",
        text: "¿Qué porcentaje de desvío de relleno sanitario han documentado?",
        type: "single",
        options: { "90% o más": 1, "Entre 75-89%": 0.7, "Entre 50-74%": 0.4, "Menos del 50%": 0 },
        description: "TRUE requiere documentar mínimo 90% de desvío"
      },
      {
        id: "A6",
        text: "¿Implementan control de calidad en separación de reciclables?",
        type: "single",
        options: { "Sí, con auditorías regulares": 1, "Control básico": 0.5, "No implementado": 0 }
      },
      {
        id: "A7",
        text: "¿Cuentan con personal dedicado a gestión de residuos/sustentabilidad?",
        type: "single",
        options: { "Sí, personal dedicado tiempo completo": 1, "Personal de medio tiempo": 0.7, "Responsabilidades adicionales": 0.3, "No tenemos personal asignado": 0 }
      }
    ]
  },
  {
    id: "B",
    name: "Información y Seguimiento",
    description: "Cómo miden y dan seguimiento a sus materiales",
    icon: "📊",
    color: "from-blue-500 to-cyan-500",
    weight: 0.15,
    questions: [
      {
        id: "B1",
        text: "¿Cómo miden actualmente sus materiales y residuos?",
        type: "single",
        options: {
          "Equipos de pesaje propios": 1,
          "Equipos móviles": 0.8,
          "Reportes de proveedores": 0.7,
          "Estimaciones generales": 0.3
        }
      },
      {
        id: "B2",
        text: "¿Con qué frecuencia reciben información actualizada de residuos?",
        type: "single",
        options: {
          "Diariamente": 1,
          "Semanalmente": 0.8,
          "Mensualmente": 0.6,
          "Esporádicamente": 0.2
        }
      },
      {
        id: "B3",
        text: "¿Tienen registro detallado por tipo de material?",
        type: "single",
        options: { "Sí, todos los tipos": 1, "Solo materiales principales": 0.6, "Solo información general": 0 }
      },
      {
        id: "B4",
        text: "¿Registran residuos por área generadora?",
        type: "single",
        options: { "Sí, todas las áreas": 1, "Áreas principales": 0.6, "No registramos por área": 0 }
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
    name: "Compras Inteligentes",
    description: "Decisiones de compra que apoyan sus objetivos de sustentabilidad",
    icon: "🛒",
    color: "from-green-500 to-emerald-500",
    weight: 0.10,
    questions: [
      {
        id: "C1",
        text: "¿Consideran criterios de sustentabilidad en sus compras?",
        type: "single",
        options: { "Sí, es prioritario": 1, "Lo estamos integrando": 0.6, "No las consideramos": 0 }
      },
      {
        id: "C2",
        text: "¿Usan opciones reutilizables en alimentos y bebidas?",
        type: "single",
        options: { "Sí, sistemáticamente": 1, "En algunas ocasiones": 0.6, "No las usamos": 0 }
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
    name: "Aprovechamiento de Materiales",
    description: "Cómo maximizan el valor de sus materiales",
    icon: "♻️",
    color: "from-purple-500 to-pink-500",
    weight: 0.12,
    questions: [
      {
        id: "G1",
        text: "¿Cuántos tipos diferentes de materiales separan actualmente?",
        type: "single",
        options: { "Muchos (7 o más)": 1, "Varios (5-6)": 0.8, "Algunos (3-4)": 0.6, "Pocos (1-2)": 0.3 }
      },
      {
        id: "G2",
        text: "¿Sus contenedores están bien señalizados para fácil uso?",
        type: "single",
        options: { "Sí, muy claros": 1, "Algunos sí": 0.6, "Podemos mejorar esto": 0 }
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
    name: "Materiales Orgánicos",
    description: "Aprovechamiento de alimentos y materiales orgánicos",
    icon: "🌱",
    color: "from-lime-500 to-green-500",
    weight: 0.10,
    questions: [
      {
        id: "H1",
        text: "¿Separan los desechos orgánicos de cocina para aprovechamiento?",
        type: "single",
        options: { "Sí, consistentemente": 1, "En algunas áreas": 0.6, "No las separamos": 0 }
      },
      {
        id: "H2",
        text: "¿Donan alimentos que aún están en buen estado?",
        type: "single",
        options: { "Sí, regularmente": 1, "Ocasionalmente": 0.6, "No las donamos": 0 }
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
        text: "¿Tienen área de compost en sitio?",
        type: "single",
        options: { "Sí, operativa": 1, "En construcción": 0.6, "No tenemos": 0 }
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
    name: "Equipo y Cultura",
    description: "Involucramiento del personal en sustentabilidad",
    icon: "🧑‍🏫",
    color: "from-indigo-500 to-purple-500",
    weight: 0.12,
    questions: [
      {
        id: "J1",
        text: "¿Incluyen temas de sustentabilidad al capacitar nuevos empleados?",
        type: "single",
        options: { "Sí, es parte del proceso": 1, "No las incluimos": 0 }
      },
      {
        id: "J2",
        text: "¿Con qué frecuencia refuerzan la cultura de sustentabilidad?",
        type: "single",
        options: {
          "Cada 3 meses": 1,
          "Cada 6 meses": 0.8,
          "Anualmente": 0.6,
          "No lo hacemos sistemáticamente": 0
        }
      },
      {
        id: "J3",
        text: "¿Sus logros de sustentabilidad son visibles para toda la organización?",
        type: "single",
        options: { "Sí, son públicos internamente": 1, "Solo comunicación directiva": 0.5, "No los comunicamos": 0 }
      },
      {
        id: "J4",
        text: "¿Reconocen o premian actualmente los logros en sustentabilidad?",
        type: "single",
        options: { "Sí, tenemos sistema de reconocimientos": 1, "Reconocimientos informales": 0.6, "No reconocemos": 0 }
      },
      {
        id: "J5",
        text: "¿Tienen un líder o equipo dedicado a impulsar sustentabilidad?",
        type: "single",
        options: { "Sí, equipo formal": 1, "Personas interesadas": 0.6, "No tenemos": 0 }
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
  
  // Calcular el promedio ponderado para TRUE Readiness
  const totalWeight = DIAGNOSTIC_CONFIG.reduce((sum, module) => sum + module.weight, 0);
  const weightedReadiness = totalWeight > 0 ? totalScore / totalWeight : 0;

  return {
    gateStatus,
    readinessIndex: Math.round(weightedReadiness * 100),
    moduleScores
  };
}