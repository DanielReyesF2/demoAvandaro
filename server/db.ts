import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configuración para trabajar con Neon Serverless (que es lo que usa Supabase bajo el capó)
neonConfig.webSocketConstructor = ws;

// En desarrollo, permitir que el servidor inicie sin base de datos para ver el frontend
const isDevelopment = process.env.NODE_ENV === 'development';

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  // Crear el pool de conexiones a la base de datos
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // Crear la instancia de drizzle con nuestro esquema
  db = drizzle(pool, { schema });
} else if (!isDevelopment) {
  throw new Error(
    "DATABASE_URL debe estar configurado. ¿Olvidaste provisionar una base de datos?",
  );
} else {
  console.warn("⚠️  DATABASE_URL no configurada. El servidor iniciará pero las funcionalidades de base de datos no estarán disponibles.");
}

// Exportar con getters para acceso seguro
export { pool };
export { db };