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
        text: "¿Cuál describe mejor su enfoque actual hacia la sostenibilidad?",
        type: "single",
        options: { "Tenemos una estrategia formal documentada": 1, "Estamos desarrollando nuestro marco estratégico": 0.5, "Estamos explorando oportunidades": 0 },
        description: "Una estrategia clara potencia el impacto de TRUE"
      },
      {
        id: "A2",
        text: "¿Tienen claridad sobre qué áreas incluirían en un programa de sustentabilidad?",
        type: "single",
        options: { "Completamente definido": 1, "Tenemos ideas generales": 0.5, "Queremos explorar opciones": 0 }
      },
      {
        id: "A3",
        text: "¿Cómo califican su situación en temas ambientales y regulatorios?",
        type: "single",
        options: { "Excelente base para crecer": 1, "Buenos fundamentos": 0.5, "Oportunidad de mejora": 0 },
        description: "Una base sólida permite máximo impacto con TRUE"
      },
      {
        id: "A4",
        text: "¿Qué nivel de información tienen sobre sus materiales y residuos?",
        type: "single",
        options: { "Datos detallados y consistentes": 1, "Información básica": 0.5, "Queremos empezar a medir": 0 },
        description: "Los datos potencian las oportunidades que TRUE puede identificar"
      },
      {
        id: "A5",
        text: "¿Qué porcentaje aproximado de sus materiales se desvían del relleno sanitario?",
        type: "single",
        options: { "Muy alto (90%+)": 1, "Necesitamos medir esto": 0.3, "Es una gran oportunidad de mejora": 0 },
        description: "TRUE maximiza el potencial de desvío de cualquier organización"
      },
      {
        id: "A6",
        text: "¿Monitorean la calidad de sus materiales reciclables?",
        type: "single",
        options: { "Sí, consistentemente": 1, "Ocasionalmente": 0.5, "Es una oportunidad de mejora": 0 }
      },
      {
        id: "A7",
        text: "¿Tienen alguien que pueda liderar iniciativas de sustentabilidad?",
        type: "single",
        options: { "Sí, tenemos el líder perfecto": 1, "Podemos designar a alguien fácilmente": 0 }
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
        text: "¿Cómo prefieren medir sus materiales y residuos?",
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
        text: "¿Con qué frecuencia les gustaría tener información actualizada?",
        type: "single",
        options: {
          "Diario (máximo control)": 1,
          "Semanal (buen balance)": 0.8,
          "Mensual (práctico)": 0.6,
          "Cuando sea necesario": 0.2
        }
      },
      {
        id: "B3",
        text: "¿Les interesaría conocer el detalle por tipo de material?",
        type: "single",
        options: { "Sí, nos daría mucho valor": 1, "Para algunos materiales clave": 0.6, "Con información general es suficiente": 0 }
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
        options: { "Sí, es prioritario": 1, "Lo estamos integrando": 0.6, "Es una gran oportunidad": 0 }
      },
      {
        id: "C2",
        text: "¿Usan opciones reutilizables en alimentos y bebidas?",
        type: "single",
        options: { "Sí, es nuestra preferencia": 1, "En algunas ocasiones": 0.6, "Queremos explorar esto": 0 }
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
        options: { "Sí, consistentemente": 1, "En algunas áreas": 0.6, "Es una excelente oportunidad": 0 }
      },
      {
        id: "H2",
        text: "¿Donan alimentos que aún están en buen estado?",
        type: "single",
        options: { "Sí, regularmente": 1, "Ocasionalmente": 0.6, "Nos gustaría explorar esto": 0 }
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
        options: { "Sí, es parte del proceso": 1, "Podemos agregar esto fácilmente": 0 }
      },
      {
        id: "J2",
        text: "¿Con qué frecuencia les gustaría reforzar la cultura de sustentabilidad?",
        type: "single",
        options: {
          "Cada 3 meses (alto impacto)": 1,
          "Cada 6 meses (buen balance)": 0.8,
          "Anualmente (práctico)": 0.6,
          "Cuando sea necesario": 0
        }
      },
      {
        id: "J3",
        text: "¿Les gustaría que sus logros de sustentabilidad fueran visibles para todos?",
        type: "single",
        options: { "Sí, nos motivaría mucho": 1, "Preferimos comunicación interna": 0 }
      },
      {
        id: "J4",
        text: "¿Considerarían reconocer/premiar los logros en sustentabilidad?",
        type: "single",
        options: { "Sí, excelente idea": 1, "Lo estamos considerando": 0.6, "Por el momento no": 0 }
      },
      {
        id: "J5",
        text: "¿Tienen un líder o equipo dedicado a impulsar sustentabilidad?",
        type: "single",
        options: { "Sí, tenemos el equipo perfecto": 1, "Tenemos personas interesadas": 0.6, "Podemos formar uno": 0 }
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