import { useState } from 'react';
import { Check, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from '@shared/schema';

interface AlertsTableProps {
  alerts: Alert[];
}

export default function AlertsTable({ alerts }: AlertsTableProps) {
  const queryClient = useQueryClient();
  
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest('PATCH', `/api/alerts/${alertId}`, { resolved: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    }
  });
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-500">
            <AlertTriangle className="h-5 w-5" />
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100 text-yellow-500">
            <AlertCircle className="h-5 w-5" />
          </span>
        );
      case 'info':
        return (
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-500">
            <Info className="h-5 w-5" />
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-500">
            <CheckCircle className="h-5 w-5" />
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-500">
            <Info className="h-5 w-5" />
          </span>
        );
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES');
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-anton uppercase tracking-wider text-gray-800">Alertas</h2>
        <button className="text-navy hover:text-navy-light text-sm font-medium">
          Ver todas
        </button>
      </div>
      
      <div className="overflow-hidden">
        {alerts.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No hay alertas que mostrar</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <li key={alert.id} className="py-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(alert.date)}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button 
                      className={`rounded-full p-1 ${
                        alert.resolved 
                          ? 'bg-green-100 text-green-600 cursor-default' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-500'
                      }`}
                      title={alert.resolved ? "Resuelta" : "Marcar como resuelta"}
                      onClick={() => {
                        if (!alert.resolved) {
                          resolveAlertMutation.mutate(alert.id);
                        }
                      }}
                      disabled={alert.resolved || resolveAlertMutation.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
