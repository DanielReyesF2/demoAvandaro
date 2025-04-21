import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
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
});

// Waste data schema - for processed data from PDFs
export const wasteData = pgTable("waste_data", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id),
  clientId: integer("client_id").references(() => clients.id),
  date: timestamp("date").notNull(),
  organicWaste: integer("organic_waste"), // in kg
  inorganicWaste: integer("inorganic_waste"), // in kg
  recyclableWaste: integer("recyclable_waste"), // in kg
  totalWaste: integer("total_waste"), // in kg
  deviation: integer("deviation"), // percentage deviation
  notes: text("notes"),
  rawData: json("raw_data").$type<Record<string, any>>(), // Store raw extracted data
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
  notes: true,
  rawData: true,
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

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
