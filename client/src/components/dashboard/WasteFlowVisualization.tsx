import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import html2canvas from 'html2canvas';
import { 
  Download,
  FileImage,
  FileText,
  Recycle, 
  Leaf, 
  Trash2, 
  Building2,
  Home,
  ChefHat,
  Users,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  UtensilsCrossed
} from 'lucide-react';

// Interfaces para el diagrama Sankey
interface SankeyNode {
  id: string;
  nodeColor?: string;
  icon?: React.ReactNode;
  isExpandable?: boolean;
  parentId?: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Mapeo de emojis para cada punto de generación
const nodeEmojis: Record<string, string> = {
  'Kiosko 1': '🏪',
  'Kiosko 2': '🏪',
  'Habitaciones Hotel': '🏨',
  'Suites': '🏨',
  'Club Residencial Avandaro': '🏘️',
  'Restaurante Acuarimas': '🍽️',
  'Restaurante José': '🍽️',
  'Campo': '🌿',
  'Canchas de Padel': '🎾',
  'Canchas de Tennis': '🎾',
  'Casa 501': '🏠',
  'Casa 502': '🏠',
  'Casa 503': '🏠',
  'Casa 504': '🏠',
  'Casa 505': '🏠',
  'Casa 506': '🏠',
};

// Mapeo de nombres cortos para mostrar en los labels
const nodeLabels: Record<string, string> = {
  'Kiosko 1': 'Kiosko 1',
  'Kiosko 2': 'Kiosko 2',
  'Habitaciones Hotel': 'Hotel',
  'Suites': 'Suites',
  'Club Residencial Avandaro': 'CRA',
  'Restaurante Acuarimas': 'Acuarimas',
  'Restaurante José': 'José',
  'Campo': 'Campo',
  'Canchas de Padel': 'Padel',
  'Canchas de Tennis': 'Tennis',
  'Casa 501': '501',
  'Casa 502': '502',
  'Casa 503': '503',
  'Casa 504': '504',
  'Casa 505': '505',
  'Casa 506': '506',
};

// Nodos base para el diagrama
const baseNodes: SankeyNode[] = [
  // Puntos de Origen - Áreas del Club
  { id: 'Kiosko 1', nodeColor: '#3b82f6', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'Kiosko 2', nodeColor: '#1d4ed8', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'Habitaciones Hotel', nodeColor: '#7c3aed', icon: <Building2 className="w-4 h-4" /> },
  { id: 'Suites', nodeColor: '#9333ea', icon: <Building2 className="w-4 h-4" /> },
  { id: 'Club Residencial Avandaro', nodeColor: '#059669', icon: <Home className="w-5 h-4" />, isExpandable: true },
  { id: 'Restaurante Acuarimas', nodeColor: '#f97316', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { id: 'Restaurante José', nodeColor: '#ea580c', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { id: 'Campo', nodeColor: '#16a34a', icon: <Leaf className="w-4 h-4" /> },
  { id: 'Canchas de Padel', nodeColor: '#0ea5e9', icon: <Users className="w-4 h-4" /> },
  { id: 'Canchas de Tennis', nodeColor: '#06b6d4', icon: <Users className="w-4 h-4" /> },
  
  // Casas del Club Residencial (expansión)
  { id: 'Casa 501', nodeColor: '#34d399', icon: <Home className="w-4 h-4" />, parentId: 'Club Residencial Avandaro' },
  { id: 'Casa 502', nodeColor: '#34d399', icon: <Home className="w-4 h-4" />, parentId: 'Club Residencial Avandaro' },
  { id: 'Casa 503', nodeColor: '#34d399', icon: <Home className="w-4 h-4" />, parentId: 'Club Residencial Avandaro' },
  { id: 'Casa 504', nodeColor: '#34d399', icon: <Home className="w-4 h-4" />, parentId: 'Club Residencial Avandaro' },
  { id: 'Casa 505', nodeColor: '#34d399', icon: <Home className="w-4 h-4" />, parentId: 'Club Residencial Avandaro' },
  { id: 'Casa 506', nodeColor: '#34d399', icon: <Home className="w-4 h-4" />, parentId: 'Club Residencial Avandaro' },
  
  // Categorías Intermedias
  { id: 'Orgánicos', nodeColor: '#22c55e', icon: <Leaf className="w-4 h-4" /> },
  { id: 'Reciclables', nodeColor: '#3b82f6', icon: <Recycle className="w-4 h-4" /> },
  { id: 'Inorgánicos', nodeColor: '#6b7280', icon: <Trash2 className="w-4 h-4" /> },
  
  // Destinos Finales
  { id: 'Biodegradación ORKA', nodeColor: '#16a34a', icon: <Leaf className="w-4 h-4" /> },
  { id: 'Reciclaje Recupera', nodeColor: '#2563eb', icon: <Recycle className="w-4 h-4" /> },
  { id: 'Reciclaje Verde Ciudad', nodeColor: '#0ea5e9', icon: <Recycle className="w-4 h-4" /> },
  { id: 'Disposición Controlada', nodeColor: '#64748b', icon: <Trash2 className="w-4 h-4" /> },
];

// Links base
const baseLinks: SankeyLink[] = [
  // Desde Puntos de Origen a Categorías
  { source: 'Kiosko 1', target: 'Orgánicos', value: 1.2 },
  { source: 'Kiosko 1', target: 'Reciclables', value: 1.5 },
  { source: 'Kiosko 1', target: 'Inorgánicos', value: 0.8 },
  
  { source: 'Kiosko 2', target: 'Orgánicos', value: 1.0 },
  { source: 'Kiosko 2', target: 'Reciclables', value: 1.3 },
  { source: 'Kiosko 2', target: 'Inorgánicos', value: 0.7 },
  
  { source: 'Habitaciones Hotel', target: 'Orgánicos', value: 2.5 },
  { source: 'Habitaciones Hotel', target: 'Reciclables', value: 2.2 },
  { source: 'Habitaciones Hotel', target: 'Inorgánicos', value: 1.3 },
  
  { source: 'Suites', target: 'Orgánicos', value: 1.8 },
  { source: 'Suites', target: 'Reciclables', value: 1.6 },
  { source: 'Suites', target: 'Inorgánicos', value: 0.9 },
  
  // Restaurantes (alto orgánicos)
  { source: 'Restaurante Acuarimas', target: 'Orgánicos', value: 7.8 },
  { source: 'Restaurante Acuarimas', target: 'Reciclables', value: 1.5 },
  { source: 'Restaurante Acuarimas', target: 'Inorgánicos', value: 0.7 },
  
  { source: 'Restaurante José', target: 'Orgánicos', value: 6.4 },
  { source: 'Restaurante José', target: 'Reciclables', value: 1.3 },
  { source: 'Restaurante José', target: 'Inorgánicos', value: 0.7 },
  
  // Áreas deportivas
  { source: 'Campo', target: 'Orgánicos', value: 2.4 },
  { source: 'Campo', target: 'Reciclables', value: 0.3 },
  { source: 'Campo', target: 'Inorgánicos', value: 0.5 },
  
  { source: 'Canchas de Padel', target: 'Orgánicos', value: 0.6 },
  { source: 'Canchas de Padel', target: 'Reciclables', value: 0.4 },
  { source: 'Canchas de Padel', target: 'Inorgánicos', value: 0.3 },
  
  { source: 'Canchas de Tennis', target: 'Orgánicos', value: 0.4 },
  { source: 'Canchas de Tennis', target: 'Reciclables', value: 0.3 },
  { source: 'Canchas de Tennis', target: 'Inorgánicos', value: 0.3 },
  
  // Desde Categorías a Destinos Finales
  { source: 'Orgánicos', target: 'Biodegradación ORKA', value: 21.6 },
  { source: 'Reciclables', target: 'Reciclaje Recupera', value: 2.1 },
  { source: 'Reciclables', target: 'Reciclaje Verde Ciudad', value: 3.1 },
  { source: 'Inorgánicos', target: 'Disposición Controlada', value: 6.2 },
];

// Links de las casas (se agregan cuando se expande)
const houseLinks: SankeyLink[] = [
  { source: 'Casa 501', target: 'Orgánicos', value: 0.25 },
  { source: 'Casa 501', target: 'Reciclables', value: 0.17 },
  { source: 'Casa 501', target: 'Inorgánicos', value: 0.13 },
  
  { source: 'Casa 502', target: 'Orgánicos', value: 0.25 },
  { source: 'Casa 502', target: 'Reciclables', value: 0.17 },
  { source: 'Casa 502', target: 'Inorgánicos', value: 0.13 },
  
  { source: 'Casa 503', target: 'Orgánicos', value: 0.25 },
  { source: 'Casa 503', target: 'Reciclables', value: 0.17 },
  { source: 'Casa 503', target: 'Inorgánicos', value: 0.13 },
  
  { source: 'Casa 504', target: 'Orgánicos', value: 0.25 },
  { source: 'Casa 504', target: 'Reciclables', value: 0.17 },
  { source: 'Casa 504', target: 'Inorgánicos', value: 0.13 },
  
  { source: 'Casa 505', target: 'Orgánicos', value: 0.25 },
  { source: 'Casa 505', target: 'Reciclables', value: 0.17 },
  { source: 'Casa 505', target: 'Inorgánicos', value: 0.13 },
  
  { source: 'Casa 506', target: 'Orgánicos', value: 0.25 },
  { source: 'Casa 506', target: 'Reciclables', value: 0.17 },
  { source: 'Casa 506', target: 'Inorgánicos', value: 0.13 },
];

// Link agregado cuando Club Residencial está colapsado
const clubResidentialLink: SankeyLink = {
  source: 'Club Residencial Avandaro',
  target: 'Orgánicos',
  value: 1.5,
};

interface WasteFlowVisualizationProps {
  totalWasteDiverted: number;
}

export function WasteFlowVisualization({ totalWasteDiverted }: WasteFlowVisualizationProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const sankeyRef = useRef<HTMLDivElement>(null);

  // Toggle expansión de nodos
  const toggleExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Construir datos del Sankey según estado de expansión
  const getSankeyData = (): SankeyData => {
    const visibleNodes: SankeyNode[] = [];
    const visibleLinks: SankeyLink[] = [...baseLinks];

    // Agregar nodos base (excepto casas si no está expandido)
    baseNodes.forEach(node => {
      if (node.parentId === 'Club Residencial Avandaro') {
        // Solo mostrar casas si el Club Residencial está expandido
        if (expandedNodes.has('Club Residencial Avandaro')) {
          visibleNodes.push(node);
          // Agregar links de casas
          houseLinks.forEach(link => {
            if (link.source === node.id) {
              visibleLinks.push(link);
            }
          });
        }
      } else {
        visibleNodes.push(node);
      }
    });

    // Si Club Residencial no está expandido, agregar su link consolidado
    if (!expandedNodes.has('Club Residencial Avandaro')) {
      visibleLinks.push(clubResidentialLink);
      visibleLinks.push({ source: 'Club Residencial Avandaro', target: 'Reciclables', value: 1.0 });
      visibleLinks.push({ source: 'Club Residencial Avandaro', target: 'Inorgánicos', value: 0.8 });
    }

    return { nodes: visibleNodes, links: visibleLinks };
  };

  // Función para calcular totales
  const calculateTotalValue = (links: SankeyLink[]) => {
    return links.reduce((total, link) => {
      const originNodes = ['Kiosko 1', 'Kiosko 2', 'Habitaciones Hotel', 'Suites', 'Club Residencial Avandaro',
                           'Restaurante Acuarimas', 'Restaurante José', 'Campo', 'Canchas de Padel', 'Canchas de Tennis',
                           'Casa 501', 'Casa 502', 'Casa 503', 'Casa 504', 'Casa 505', 'Casa 506'];
      if (originNodes.includes(link.source)) {
        return total + link.value;
      }
      return total;
    }, 0);
  };

  const currentData = getSankeyData();
  const totalValue = calculateTotalValue(currentData.links);

  // Funciones de exportación
  const exportToPNG = async (scale: number = 2) => {
    if (!sankeyRef.current) return;
    try {
      const canvas = await html2canvas(sankeyRef.current, {
        scale: scale,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `flujos-materiales-avandaro-${scale}x.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Origen', 'Destino', 'Volumen (ton/mes)', 'Porcentaje (%)'],
      ...currentData.links.map(link => [
        link.source,
        link.target,
        link.value.toString(),
        ((link.value / totalValue) * 100).toFixed(1)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.download = 'flujos-materiales-avandaro.csv';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  // Filtrar datos por nodo seleccionado
  const getFilteredData = () => {
    if (!selectedNode) return currentData;
    
    const filteredLinks = currentData.links.filter(link => 
      link.source === selectedNode || link.target === selectedNode
    );
    
    const relevantNodes = new Set<string>();
    filteredLinks.forEach(link => {
      relevantNodes.add(link.source);
      relevantNodes.add(link.target);
    });
    
    return {
      nodes: currentData.nodes.filter(node => relevantNodes.has(node.id)),
      links: filteredLinks
    };
  };

  const filteredData = getFilteredData();
  const diversionRate = ((totalValue - 6.2) / totalValue * 100).toFixed(1);

  // Encontrar nodo expandible
  const clubResidentialNode = baseNodes.find(n => n.id === 'Club Residencial Avandaro');
  const isClubExpanded = expandedNodes.has('Club Residencial Avandaro');

  return (
    <div className="bg-white rounded-xl border border-subtle p-8 shadow-premium-md card-hover animate-fade-in">
      {/* Header y Controles */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
            Flujos de Materiales
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Visualización del flujo de residuos desde puntos de generación hasta destino final
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botón expandir/c colapsar Club Residencial */}
          {clubResidentialNode && (
            <button
              onClick={() => toggleExpansion('Club Residencial Avandaro')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isClubExpanded
                  ? 'bg-accent-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isClubExpanded ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Colapsar Casas</span>
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span>Expandir Casas</span>
                </>
              )}
            </button>
          )}

          {/* Exportar PNG */}
          <button
            onClick={() => exportToPNG(2)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm"
          >
            <FileImage className="w-4 h-4" />
            <span>PNG</span>
          </button>

          {/* Exportar CSV */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-accent-green hover:bg-accent-green/90 text-white rounded-lg transition-colors text-sm"
          >
            <FileText className="w-4 h-4" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Diagrama Sankey */}
      <div ref={sankeyRef} className="h-[500px] bg-gradient-to-br from-gray-50 to-white rounded-xl border border-subtle p-6 shadow-premium-sm">
        <ResponsiveSankey
          data={filteredData}
          margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
          align="justify"
          colors={(node: any) => {
            const nodeData = baseNodes.find(n => n.id === node.id);
            return nodeData?.nodeColor || '#64748b';
          }}
          nodeOpacity={1}
          nodeHoverOpacity={0.9}
          nodeThickness={20}
          nodeSpacing={12}
          nodeBorderWidth={2}
          nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
          linkOpacity={0.6}
          linkHoverOpacity={0.9}
          linkContract={0}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={18}
          labelTextColor="#374151"
          label={(node: any) => {
            const emoji = nodeEmojis[node.id] || '';
            const shortLabel = nodeLabels[node.id] || node.id;
            return emoji ? `${emoji} ${shortLabel}` : shortLabel;
          }}
          animate={true}
          motionConfig="gentle"
          onClick={(data: any) => {
            if (data.id === 'Club Residencial Avandaro') {
              toggleExpansion('Club Residencial Avandaro');
            } else if (data.id) {
              setSelectedNode(selectedNode === data.id ? null : data.id);
            }
          }}
        />
      </div>

      {/* Información de expansión */}
      {isClubExpanded && (
        <div className="mt-6 p-4 bg-gradient-to-r from-accent-green/10 to-accent-teal/10 border border-accent-green/20 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2 text-accent-green font-medium text-sm">
            <ChevronDown className="w-4 h-4" />
            <span>Club Residencial Avandaro expandido - Mostrando Casas 501-506</span>
          </div>
        </div>
      )}

      {/* Métricas de Resumen Premium */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-subtle shadow-premium-sm card-hover">
          <div className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Total Generado</div>
          <div className="text-3xl font-bold text-gray-900 tracking-tight">{totalValue.toFixed(1)}</div>
          <div className="text-sm text-gray-500 mt-1">ton/mes</div>
        </div>
        <div className="bg-gradient-to-br from-white to-accent-green/5 rounded-xl p-5 border border-accent-green/20 shadow-premium-sm card-hover">
          <div className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Desviación</div>
          <div className="text-3xl font-bold text-accent-green tracking-tight">{diversionRate}%</div>
          <div className="text-sm text-gray-500 mt-1">TRUE Zero Waste</div>
        </div>
        <div className="bg-gradient-to-br from-white to-accent-teal/5 rounded-xl p-5 border border-accent-teal/20 shadow-premium-sm card-hover">
          <div className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Procesado Circularmente</div>
          <div className="text-3xl font-bold text-accent-teal tracking-tight">{(totalValue - 6.2).toFixed(1)}</div>
          <div className="text-sm text-gray-500 mt-1">ton/mes</div>
        </div>
      </div>
    </div>
  );
}
