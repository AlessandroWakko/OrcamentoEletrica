export enum QuoteStatus {
  PENDING = 'PENDENTE',
  APPROVED = 'APROVADO',
  REJECTED = 'RECUSADO'
}

export interface Material {
  id: string;
  name: string;
  unit: 'un' | 'm' | 'cm' | 'kg' | 'kit';
  costPrice: number;
  stock: number;
}

export interface ServiceMaterial {
  materialId: string;
  quantity: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
  materialPrice?: number;
  quantity: number;
  linkedMaterials?: ServiceMaterial[];
  isCustom?: boolean;
}

export interface UserProfile {
  name: string;
  companyName: string;
  address: string;
  phone: string;
  whatsapp: string;
  personType: 'PF' | 'PJ';
}

export interface ClientInfo {
  name: string;
  phone: string;
  address: string;
  serviceType: string;
  environment: string;
}

export interface Quote {
  id: string;
  date: string;
  client: ClientInfo;
  items: ServiceItem[];
  difficultyMultiplier: number;
  totalValue: number;
  status: QuoteStatus;
}

export interface AppSettings {
  baseServices: {
    installation: number;
    breakerChange: number;
    revision: number;
  };
  logistics: {
    kmValue: number;
    minVisitFee: number;
  };
  multipliers: {
    urgencyRate: number;
    globalProfit: number;
    isUrgencyActive: boolean;
  };
}