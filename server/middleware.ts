import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

// Extend Request interface to include tenant context
declare global {
  namespace Express {
    interface Request {
      context?: {
        clientId: number;
        client: any;
        userScopes: string[];
      };
    }
  }
}

// Middleware to resolve tenant from URL slug
export async function resolveTenant(req: Request, res: Response, next: NextFunction) {
  // Extract client slug from URL path
  const pathParts = req.path.split('/');
  let clientSlug: string | null = null;
  
  // Check if it's a tenant route: /:clientSlug/*
  // But exclude static files, vite dev server, and other system paths
  if (pathParts.length >= 2 && pathParts[1] && 
      !['api', 'admin', '@vite', '@fs', 'src', 'node_modules', 'assets', '__vite_hmr'].includes(pathParts[1]) &&
      !pathParts[1].includes('.') // Exclude files with extensions
  ) {
    clientSlug = pathParts[1];
  }
  
  // For API routes, check if there's a clientSlug in the URL
  if (req.path.startsWith('/api/tenant/') && pathParts[3]) {
    clientSlug = pathParts[3];
  }

  if (clientSlug) {
    try {
      const client = await storage.getClientBySlug(clientSlug);
      
      if (!client) {
        return res.status(404).json({ 
          error: 'Tenant not found',
          message: `Client '${clientSlug}' not found` 
        });
      }

      if (!client.isActive) {
        return res.status(403).json({ 
          error: 'Tenant disabled',
          message: `Client '${clientSlug}' is not active` 
        });
      }

      // Add client context to request
      req.context = {
        clientId: client.id,
        client: client,
        userScopes: ['portal:read', 'portal:write'] // Default portal scopes
      };

      console.log(`[TENANT] Resolved ${clientSlug} -> clientId: ${client.id}`);
    } catch (error) {
      console.error('Error resolving tenant:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to resolve tenant' 
      });
    }
  }

  next();
}

// Middleware to enforce tenant isolation
export function requireTenant(req: Request, res: Response, next: NextFunction) {
  if (!req.context?.clientId) {
    return res.status(400).json({ 
      error: 'No tenant context',
      message: 'This endpoint requires tenant context' 
    });
  }
  next();
}

// Middleware for admin-only routes
export function requireAdminScopes(req: Request, res: Response, next: NextFunction) {
  const hasAdminScope = req.context?.userScopes?.includes('admin:global');
  
  if (!hasAdminScope) {
    return res.status(403).json({ 
      error: 'Insufficient permissions',
      message: 'Admin access required' 
    });
  }
  next();
}

// Middleware to log tenant context for debugging
export function logTenantContext(req: Request, res: Response, next: NextFunction) {
  if (req.context?.clientId) {
    console.log(`[REQUEST] ${req.method} ${req.path} | Client: ${req.context.client.slug} (ID: ${req.context.clientId})`);
  }
  next();
}