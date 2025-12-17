
export interface Property {
  id: number;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family';
  status: 'For Sale' | 'Pending' | 'Sold';
  agentId: number;
  imageUrl: string;
  listedDate: string;
  ownerName: string;
  ownerContact: string;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  sales: number;
  rating: number;
  imageUrl: string;
  commissionRate: number; // Percentage (e.g., 2.5)
}

export interface Client {
  id: number;
  name: string;
  email: string;
  budget: number;
  status: 'Active' | 'Cold' | 'Closed';
  interestedIn: string[];
}

export interface SQLMessage {
  role: 'user' | 'model';
  text: string;
  sql?: string;
  explanation?: string;
  isError?: boolean;
}

export enum ViewState {
  DASHBOARD = 'dashboard',
  PROPERTIES = 'properties',
  AGENTS = 'agents',
  CLIENTS = 'clients',
  SQL_ANALYST = 'sql_analyst'
}

export type UserRole = 'admin' | 'agent';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}
