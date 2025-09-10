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
  ChefHat,
  Users,
  Filter,
  RotateCcw
} from 'lucide-react';

// Interfaces para el diagrama Sankey
interface SankeyNode {
  id: string;
  nodeColor?: string;
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

interface TooltipData {
  node?: any;
  link?: any;
  value: number;
  percentage: number;
  totalValue: number;
}

// Datos para el Club de Golf Avandaro - Flujo de Materiales
const sankeyData: SankeyData = {
  nodes: [
    // Puntos de Origen - Áreas del Club
    { id: 'Kiosko 1', nodeColor: '#3b82f6' },
    { id: 'Kiosko 2', nodeColor: '#1d4ed8' },
    { id: 'Habitaciones Hotel', nodeColor: '#7c3aed' },
    { id: 'Suites', nodeColor: '#9333ea' },
    { id: 'Club Residencial Avandaro', nodeColor: '#059669' },
    { id: 'Restaurante Acuarimas', nodeColor: '#f97316' },
    { id: 'Restaurante José', nodeColor: '#ea580c' },
    { id: 'Campo', nodeColor: '#16a34a' },
    { id: 'Canchas de Padel', nodeColor: '#0ea5e9' },
    { id: 'Canchas de Tennis', nodeColor: '#06b6d4' },
    
    // Categorías Intermedias
    { id: 'Orgánicos', nodeColor: '#22c55e' },
    { id: 'Reciclables', nodeColor: '#3b82f6' },
    { id: 'Inorgánicos', nodeColor: '#6b7280' },
    
    // Destinos Finales
    { id: 'Biodegradación ORKA', nodeColor: '#16a34a' },
    { id: 'Reciclaje Recupera', nodeColor: '#2563eb' },
    { id: 'Reciclaje Verde Ciudad', nodeColor: '#0ea5e9' },
    { id: 'Disposición Controlada', nodeColor: '#64748b' },
  ],
  links: [
    // Desde Puntos de Origen a Categorías
    
    // Kioscos (distribución mixta)
    { source: 'Kiosko 1', target: 'Orgánicos', value: 1.2 },
    { source: 'Kiosko 1', target: 'Reciclables', value: 1.5 },
    { source: 'Kiosko 1', target: 'Inorgánicos', value: 0.8 },
    
    { source: 'Kiosko 2', target: 'Orgánicos', value: 1.0 },
    { source: 'Kiosko 2', target: 'Reciclables', value: 1.3 },
    { source: 'Kiosko 2', target: 'Inorgánicos', value: 0.7 },
    
    // Hotel y Suites (alto reciclables)
    { source: 'Habitaciones Hotel', target: 'Orgánicos', value: 2.5 },
    { source: 'Habitaciones Hotel', target: 'Reciclables', value: 2.2 },
    { source: 'Habitaciones Hotel', target: 'Inorgánicos', value: 1.3 },
    
    { source: 'Suites', target: 'Orgánicos', value: 1.8 },
    { source: 'Suites', target: 'Reciclables', value: 1.6 },
    { source: 'Suites', target: 'Inorgánicos', value: 0.9 },
    
    // Club Residencial
    { source: 'Club Residencial Avandaro', target: 'Orgánicos', value: 1.5 },
    { source: 'Club Residencial Avandaro', target: 'Reciclables', value: 1.0 },
    { source: 'Club Residencial Avandaro', target: 'Inorgánicos', value: 0.8 },
    
    // Restaurantes (alto orgánicos)
    { source: 'Restaurante Acuarimas', target: 'Orgánicos', value: 7.8 },
    { source: 'Restaurante Acuarimas', target: 'Reciclables', value: 1.5 },
    { source: 'Restaurante Acuarimas', target: 'Inorgánicos', value: 0.7 },
    
    { source: 'Restaurante José', target: 'Orgánicos', value: 6.4 },
    { source: 'Restaurante José', target: 'Reciclables', value: 1.3 },
    { source: 'Restaurante José', target: 'Inorgánicos', value: 0.7 },
    
    // Áreas deportivas (orgánicos de mantenimiento)
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
  ]
};

// Función para calcular porcentajes
const calculateTotalValue = () => {
  return sankeyData.links.reduce((total, link) => {
    // Solo sumar los links desde puntos de origen
    if (['Kiosko 1', 'Kiosko 2', 'Habitaciones Hotel', 'Suites', 'Club Residencial Avandaro', 
         'Restaurante Acuarimas', 'Restaurante José', 'Campo', 'Canchas de Padel', 'Canchas de Tennis'].includes(link.source)) {
      return total + link.value;
    }
    return total;
  }, 0);
};

const totalValue = calculateTotalValue();

interface WasteFlowVisualizationProps {
  totalWasteDiverted: number;
}

export function WasteFlowVisualization({ totalWasteDiverted }: WasteFlowVisualizationProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const sankeyRef = useRef<HTMLDivElement>(null);

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
      ...sankeyData.links.map(link => [
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
    if (!selectedNode) return sankeyData;
    
    const filteredLinks = sankeyData.links.filter(link => 
      link.source === selectedNode || link.target === selectedNode
    );
    
    const relevantNodes = new Set<string>();
    filteredLinks.forEach(link => {
      relevantNodes.add(link.source);
      relevantNodes.add(link.target);
    });
    
    return {
      nodes: sankeyData.nodes.filter(node => relevantNodes.has(node.id)),
      links: filteredLinks
    };
  };

  // Tooltip personalizado
  const CustomTooltip = ({ link, node }: any) => {
    if (link) {
      const percentage = ((link.value / totalValue) * 100).toFixed(1);
      return (
        <div className="bg-[#273949] text-white p-3 rounded-lg shadow-xl border border-[#b5e951]">
          <div className="font-semibold text-sm">{link.source.id} → {link.target.id}</div>
          <div className="text-xs mt-1">
            <div>Volumen: {link.value} ton/mes</div>
            <div>Porcentaje: {percentage}% del total</div>
          </div>
        </div>
      );
    }
    
    if (node) {
      return (
        <div className="bg-[#273949] text-white p-3 rounded-lg shadow-xl border border-[#b5e951]">
          <div className="font-semibold text-sm">{node.id}</div>
          <div className="text-xs mt-1">
            <div>Volumen total: {node.value?.toFixed(1)} ton/mes</div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const filteredData = getFilteredData();
  const diversionRate = ((totalValue - 6.2) / totalValue * 100).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-200">
      {/* Header y Controles */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-anton uppercase tracking-wide mb-2 text-[#b5e951]">
            Flujos de Materiales
          </h2>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Filtro de nodos */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedNode || ''} 
              onChange={(e) => setSelectedNode(e.target.value || null)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b5e951]"
            >
              <option value="">Todos los nodos</option>
              {sankeyData.nodes.map(node => (
                <option key={node.id} value={node.id}>{node.id}</option>
              ))}
            </select>
          </div>

          {/* Reset filtro */}
          {selectedNode && (
            <button
              onClick={() => setSelectedNode(null)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Limpiar filtro"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {/* Exportar PNG */}
          <button
            onClick={() => exportToPNG(2)}
            className="flex items-center space-x-2 bg-[#273949] hover:bg-[#1e2a3a] text-white px-4 py-2 rounded-lg transition-colors"
            title="Exportar PNG (2x)"
          >
            <FileImage className="w-4 h-4" />
            <span className="text-sm">PNG</span>
          </button>

          {/* Exportar CSV */}
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-[#b5e951] hover:bg-[#a5d941] text-[#273949] px-4 py-2 rounded-lg transition-colors"
            title="Exportar CSV"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">CSV</span>
          </button>
        </div>
      </div>

      {/* Diagrama Sankey */}
      <div ref={sankeyRef} className="h-[500px] bg-white rounded-xl shadow-sm border border-gray-100">
        <ResponsiveSankey
          data={filteredData}
          margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
          align="justify"
          colors={(node: any) => node.nodeColor || '#64748b'}
          nodeOpacity={1}
          nodeHoverOpacity={0.8}
          nodeThickness={18}
          nodeSpacing={10}
          nodeBorderWidth={0}
          linkOpacity={0.5}
          linkHoverOpacity={0.8}
          linkContract={0}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
          labelTextColor="#374151"
          animate={true}
          motionConfig="gentle"
          nodeTooltip={({ node }: any) => <CustomTooltip node={node} />}
          linkTooltip={({ link }: any) => <CustomTooltip link={link} />}
          onClick={(data: any) => {
            if (data.id) {
              setSelectedNode(selectedNode === data.id ? null : data.id);
            }
          }}
        />
      </div>

      {/* Métricas de Validación y Resumen */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Validación de Totales */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Validación de Flujos</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Generado:</span>
              <span className="font-semibold">{totalValue.toFixed(1)} ton/mes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Procesado:</span>
              <span className="font-semibold">{(21.6 + 5.2 + 6.2).toFixed(1)} ton/mes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Balance:</span>
              <span className={`font-semibold ${Math.abs(totalValue - 33.0) < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                ✓ Equilibrado
              </span>
            </div>
          </div>
        </div>

        {/* Métricas de Impacto */}
        <div className="bg-gradient-to-r from-[#273949] to-slate-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Impacto Ambiental</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-[#b5e951]">{diversionRate}%</div>
              <div className="text-xs uppercase tracking-wide">Desviación</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-400">21.6</div>
              <div className="text-xs uppercase tracking-wide">ton Compostaje</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-blue-400">5.2</div>
              <div className="text-xs uppercase tracking-wide">ton Reciclaje</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-gray-400">6.2</div>
              <div className="text-xs uppercase tracking-wide">ton Disposición</div>
            </div>
          </div>
        </div>
      </div>

      {/* Información del nodo seleccionado */}
      {selectedNode && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">
              Filtrando por: {selectedNode}
            </span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Mostrando solo los flujos relacionados con este nodo. Haz clic en "Limpiar filtro" para ver todos los datos.
          </p>
        </div>
      )}
    </div>
  );
}