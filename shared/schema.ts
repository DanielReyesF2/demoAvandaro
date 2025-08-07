import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the client schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  description: true,
});

// Define the document/file schema
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadDate: timestamp("upload_date").notNull().defaultNow(),
  clientId: integer("client_id").references(() => clients.id),
  processed: boolean("processed").default(false),
  processingError: text("processing_error"),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  fileName: true,
  fileSize: true,
  clientId: true,
  processed: true,
});

// Tabla de datos de desviación mensual como requiere la certificadora
export const monthlyDeviationData = pgTable("monthly_deviation_data", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  year: integer("year").notNull(),
  month: integer("month").notNull(), // 1-12
  
  // Materiales Reciclables (en kg)
  mixedFile: real("mixed_file").default(0),
  officePaper: real("office_paper").default(0),
  magazine: real("magazine").default(0),
  newspaper: real("newspaper").default(0),
  cardboard: real("cardboard").default(0),
  petPlastic: real("pet_plastic").default(0),
  hdpeBlown: real("hdpe_blown").default(0),
  hdpeRigid: real("hdpe_rigid").default(0),
  tinCan: real("tin_can").default(0),
  aluminum: real("aluminum").default(0),
  glass: real("glass").default(0),
  totalRecyclables: real("total_recyclables").default(0),
  
  // Orgánicos destinados a composta (en kg)
  organicsCompost: real("organics_compost").default(18000), // Default 18000 como muestra la tabla
  totalOrganics: real("total_organics").default(18000),
  
  // Reuso (en kg)
  glassDonation: real("glass_donation").default(0),
  
  // Totales calculados
  totalDiverted: real("total_diverted").default(0), // Total desviado del relleno sanitario
  totalGenerated: real("total_generated").default(0), // Total generado
  deviationPercentage: real("deviation_percentage").default(0), // Porcentaje de desviación
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMonthlyDeviationDataSchema = createInsertSchema(monthlyDeviationData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalRecyclables: true,
  totalOrganics: true,
  totalDiverted: true,
  deviationPercentage: true,
});

// Legacy waste data schema - keeping for existing data
export const wasteData = pgTable("waste_data", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id),
  clientId: integer("client_id").references(() => clients.id),
  date: timestamp("date").notNull(),
  organicWaste: real("organic_waste"),
  inorganicWaste: real("inorganic_waste"),
  recyclableWaste: real("recyclable_waste"),
  totalWaste: real("total_waste"),
  deviation: real("deviation"),
  rawData: json("raw_data").$type<Record<string, any>>(),
});

export const insertWasteDataSchema = createInsertSchema(wasteData).pick({
  documentId: true,
  clientId: true,
  date: true,
  organicWaste: true,
  inorganicWaste: true,
  recyclableWaste: true,
  totalWaste: true,
  deviation: true,
});

// Alerts schema
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  type: text("type").notNull(), // error, warning, info, success
  message: text("message").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  resolved: boolean("resolved").default(false),
  documentId: integer("document_id").references(() => documents.id),
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  clientId: true,
  type: true,
  message: true,
  documentId: true,
});

// Export types
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type WasteData = typeof wasteData.$inferSelect;
export type InsertWasteData = z.infer<typeof insertWasteDataSchema>;

export type MonthlyDeviationData = typeof monthlyDeviationData.$inferSelect;
export type InsertMonthlyDeviationData = z.infer<typeof insertMonthlyDeviationDataSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
