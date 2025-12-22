
export interface Property {
  id: number; // PropertyID
  address: string;
  city: string;
  price: number; // ListedPrice
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family' | 'Plot' | 'Villa' | 'Loft';
  status: 'For Sale' | 'Pending' | 'Sold';
  agentId: number; // Listing Agent
  imageUrl: string;
  listedDate: string;
  ownerName: string;
  ownerContact: string;
  source: string; // New field for aggregation (e.g., Zillow, MagicBricks)
}

export interface Agent {
  id: number; // AgentID
  name: string; // AgentName
  email: string;
  phone: string;
  experienceYears: number;
  rating: number;
  imageUrl: string;
  commissionRate: number;
  specialty: 'Luxury' | 'Residential' | 'Commercial' | 'Plots' | 'Foreclosure' | 'Industrial';
  topSpecialties: string[]; // Top 3 expertise areas
  source: string; // Originating platform (e.g., Zillow, MagicBricks, Realty)
}

export interface Client {
  id: number; // ClientID
  name: string; // ClientName
  email: string;
  phone: string;
  jobTitle: string;
  preferredCity: string;
  budget: number;
  status: 'Active' | 'Cold' | 'Closed';
  interestedIn: string[];
  imageUrl: string;
  source: string;
  lastActive: string;
}

export interface Transaction {
  id: number; // TransactionID
  agentId: number;
  clientId: number;
  propertyId: number;
  salePrice: number;
  commission: number;
  feedbackRating: number;
  date: string;
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
  SQL_ANALYST = 'sql_analyst',
  BOOKING = 'booking'
}

export type UserRole = 'admin' | 'agent' | 'guest';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}
