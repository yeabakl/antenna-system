
export interface Payment {
  amount: number;
  date: string;
  receipt?: string; // base64 data URL
  receiptName?: string;
}

export interface Order {
  id: string;
  customerFirstName: string;
  customerFatherName: string;
  customerGrandfatherName: string;
  machineType: string;
  phone1: string;
  phone2?: string;
  machinePrice: number;
  prepayment: number;
  prepaymentReceipt?: string; // base64
  paymentHistory: Payment[];
  deliveryDate: string;
  paymentDate: string;
  description: string;
  salesperson: string; // New field for commission tracking
  machineImage?: string; // base64
  customerIdCard?: string; // base64
  status: 'Pending' | 'Ready for Completion' | 'Completed';
  restOfPaymentReceipt?: string; // base64
  contractFile?: string; // base64
  warrantyFile?: string; // base64
  certificationFile?: string; // base64
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  productInterest: string;
  description: string;
  address: string;
  type: 'Customer' | 'Lead';
  leadStatus?: 'New' | 'Contacted' | 'Qualified' | 'Lost';
}

export interface Training {
  id: string;
  name: string;
  phone: string;
  trainingType: string;
  trainingCategory?: string; // Specific product focus (e.g., Liquid Soap, Vaseline)
  payment: 'Paid' | 'Unpaid';
  paymentReceipt?: string; // base64
  status: 'Ongoing' | 'Completed';
  certificateFile?: string; // base64
  dueDate: string; // YYYY-MM-DD
  certificateIssueDate?: string;
  certificateId?: string;
}

export interface Letter {
  id: string;
  senderName: string;
  senderPhone: string;
  subject: string;
  dateReceived: string; // YYYY-MM-DD
  letterFile: string; // base64 data URL
  fileName: string; // name of the uploaded file
  status: 'New' | 'In Progress' | 'Resolved';
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  department: string;
  dueDate: string; // YYYY-MM-DD
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Done';
  reminder?: 'none' | 'on_due_date' | '1_day_before' | '2_days_before' | '1_week_before';
}

export interface Product {
  id: string;
  name: string; // This will be the specific Model Name
  itemGroup: string; // This is the generic Item Name (e.g. Bar Soap Machine)
  model: string; // Short model code/number
  shortDescription: string;
  fullDescription: string;
  category: string;
  sector: 'Machine Manufacturing' | 'Raw Material Supply' | 'Machinery Import' | 'Business Consultancy' | 'Training';
  price?: number;
  images: string[]; // Array of base64 strings
  videoUrl?: string; // YouTube/Vimeo link
  catalogFile?: string; // Base64 PDF
  catalogFileName?: string;
  trainingManual?: string; // Base64 PDF for training modules
  features: string[];
  specifications: { label: string; value: string }[];
  useCases: string[];
  troubleshooting: string; // Markdown or plain text
}
