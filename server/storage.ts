import { 
  Client, InsertClient, 
  Document, InsertDocument, 
  WasteData, InsertWasteData, 
  Alert, InsertAlert 
} from "@shared/schema";

export interface IStorage {
  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  
  // Document operations
  getDocuments(): Promise<Document[]>;
  getDocumentsByClient(clientId: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, updates: Partial<Document>): Promise<Document | undefined>;
  
  // Waste data operations
  getWasteData(filters?: {clientId?: number, fromDate?: Date, toDate?: Date}): Promise<WasteData[]>;
  getWasteDataById(id: number): Promise<WasteData | undefined>;
  createWasteData(data: InsertWasteData): Promise<WasteData>;
  
  // Alert operations
  getAlerts(clientId?: number): Promise<Alert[]>;
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, updates: Partial<Alert>): Promise<Alert | undefined>;
}

export class MemStorage implements IStorage {
  private clients: Map<number, Client>;
  private documents: Map<number, Document>;
  private wasteData: Map<number, WasteData>;
  private alerts: Map<number, Alert>;
  
  private clientId: number;
  private documentId: number;
  private wasteDataId: number;
  private alertId: number;

  constructor() {
    this.clients = new Map();
    this.documents = new Map();
    this.wasteData = new Map();
    this.alerts = new Map();
    
    this.clientId = 1;
    this.documentId = 1;
    this.wasteDataId = 1;
    this.alertId = 1;
    
    // Add sample clients for development
    this.createClient({ name: "Empresa Sustentable S.A.", description: "Empresa de manufactura" });
    this.createClient({ name: "EcoServicios SpA", description: "Servicios ambientales" });
    this.createClient({ name: "Constructora Verde Ltda.", description: "Construcción sustentable" });
  }

  // Client operations
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = this.clientId++;
    const newClient: Client = { ...client, id };
    this.clients.set(id, newClient);
    return newClient;
  }

  // Document operations
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentsByClient(clientId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.clientId === clientId
    );
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const newDocument: Document = {
      ...document,
      id,
      uploadDate: new Date(),
      processed: false
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async updateDocument(id: number, updates: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument = { ...document, ...updates };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  // Waste data operations
  async getWasteData(filters?: { clientId?: number, fromDate?: Date, toDate?: Date }): Promise<WasteData[]> {
    let data = Array.from(this.wasteData.values());
    
    if (filters?.clientId) {
      data = data.filter(d => d.clientId === filters.clientId);
    }
    
    if (filters?.fromDate) {
      data = data.filter(d => d.date >= filters.fromDate!);
    }
    
    if (filters?.toDate) {
      data = data.filter(d => d.date <= filters.toDate!);
    }
    
    return data;
  }

  async getWasteDataById(id: number): Promise<WasteData | undefined> {
    return this.wasteData.get(id);
  }

  async createWasteData(data: InsertWasteData): Promise<WasteData> {
    const id = this.wasteDataId++;
    const newData: WasteData = { ...data, id };
    this.wasteData.set(id, newData);
    return newData;
  }

  // Alert operations
  async getAlerts(clientId?: number): Promise<Alert[]> {
    let alerts = Array.from(this.alerts.values());
    
    if (clientId) {
      alerts = alerts.filter(a => a.clientId === clientId);
    }
    
    // Sort by date, most recent first
    return alerts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = this.alertId++;
    const newAlert: Alert = {
      ...alert,
      id,
      date: new Date(),
      resolved: false
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async updateAlert(id: number, updates: Partial<Alert>): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, ...updates };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }
}

export const storage = new MemStorage();
