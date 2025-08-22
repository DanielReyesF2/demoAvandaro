// Row Level Security (RLS) utilities for multi-tenant isolation
import { Request } from 'express';
import { SQL, eq, and } from 'drizzle-orm';
import { clients, wasteData, documents, alerts, dailyWasteEntries, monthlySummaries } from '@shared/schema';

// Helper to enforce client_id isolation in queries
export function enforceClientContext(req: Request, query: any, table: any) {
  const clientId = req.context?.clientId;
  
  if (!clientId) {
    throw new Error('No client context available for RLS enforcement');
  }
  
  // Add client_id filter to the query
  return query.where(eq(table.clientId, clientId));
}

// Helper to validate user can access specific client data
export function validateClientAccess(req: Request, targetClientId: number): boolean {
  const userClientId = req.context?.clientId;
  const hasAdminScope = req.context?.userScopes?.includes('admin:global');
  
  // Admin users can access any client
  if (hasAdminScope) {
    return true;
  }
  
  // Regular users can only access their own client
  return userClientId === targetClientId;
}

// Helper to get allowed client IDs for current user
export function getAllowedClientIds(req: Request): number[] {
  const hasAdminScope = req.context?.userScopes?.includes('admin:global');
  
  if (hasAdminScope) {
    // Admin can access all clients (return empty array to indicate no restriction)
    return [];
  }
  
  // Regular users can only access their own client
  return req.context?.clientId ? [req.context.clientId] : [];
}

// RLS enforcement functions for specific tables
export const RLS = {
  wasteData: (req: Request, query: any) => enforceClientContext(req, query, wasteData),
  documents: (req: Request, query: any) => enforceClientContext(req, query, documents),
  alerts: (req: Request, query: any) => enforceClientContext(req, query, alerts),
  dailyWasteEntries: (req: Request, query: any) => enforceClientContext(req, query, dailyWasteEntries),
  monthlySummaries: (req: Request, query: any) => enforceClientContext(req, query, monthlySummaries),
};

// Validation helpers
export const Access = {
  validateClient: validateClientAccess,
  getAllowedClients: getAllowedClientIds,
  requireOwnClient: (req: Request, targetClientId: number) => {
    if (!validateClientAccess(req, targetClientId)) {
      throw new Error(`Access denied: User cannot access client ${targetClientId}`);
    }
  }
};