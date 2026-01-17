import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configuración para trabajar con Neon Serverless (que es lo que usa Supabase bajo el capó)
neonConfig.webSocketConstructor = ws;

// Permitir que el servidor inicie sin base de datos para modo demo
// El frontend usa datos mock cuando la API no tiene datos reales
let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  // Crear el pool de conexiones a la base de datos
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // Crear la instancia de drizzle con nuestro esquema
  db = drizzle(pool, { schema });
} else {
  console.warn("⚠️  DATABASE_URL no configurada. El servidor iniciará en modo DEMO con datos simulados.");
}

// Exportar con getters para acceso seguro
export { pool };
export { db };