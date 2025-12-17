
import { Property, Agent, Client } from './types';

export const MOCK_AGENTS: Agent[] = [
  { id: 1, name: "Sarah Connor", email: "sarah@estatemind.com", phone: "555-0101", sales: 12500000, rating: 4.9, imageUrl: "https://picsum.photos/100/100?random=1", commissionRate: 2.5 },
  { id: 2, name: "John Reese", email: "john@estatemind.com", phone: "555-0102", sales: 8200000, rating: 4.7, imageUrl: "https://picsum.photos/100/100?random=2", commissionRate: 2.0 },
  { id: 3, name: "Harold Finch", email: "harold@estatemind.com", phone: "555-0103", sales: 15400000, rating: 5.0, imageUrl: "https://picsum.photos/100/100?random=3", commissionRate: 3.0 },
  { id: 4, name: "Sameen Shaw", email: "shaw@estatemind.com", phone: "555-0104", sales: 9800000, rating: 4.8, imageUrl: "https://picsum.photos/100/100?random=4", commissionRate: 2.25 },
];

export const MOCK_PROPERTIES: Property[] = [
  { id: 101, address: "123 Maple Dr, Seattle, WA", price: 850000, bedrooms: 3, bathrooms: 2, sqft: 1800, type: "Single Family", status: "For Sale", agentId: 1, imageUrl: "https://picsum.photos/400/300?random=10", listedDate: "2023-10-15", ownerName: "James Wilson", ownerContact: "555-1111" },
  { id: 102, address: "456 Oak Ln, Austin, TX", price: 550000, bedrooms: 4, bathrooms: 3, sqft: 2400, type: "Single Family", status: "Pending", agentId: 2, imageUrl: "https://picsum.photos/400/300?random=11", listedDate: "2023-11-01", ownerName: "Linda Martinez", ownerContact: "555-2222" },
  { id: 103, address: "789 Pine St, New York, NY", price: 1200000, bedrooms: 2, bathrooms: 2, sqft: 1100, type: "Condo", status: "For Sale", agentId: 3, imageUrl: "https://picsum.photos/400/300?random=12", listedDate: "2023-09-20", ownerName: "Robert Chen", ownerContact: "555-3333" },
  { id: 104, address: "321 Cedar Blvd, Miami, FL", price: 950000, bedrooms: 3, bathrooms: 2.5, sqft: 1600, type: "Townhouse", status: "Sold", agentId: 1, imageUrl: "https://picsum.photos/400/300?random=13", listedDate: "2023-08-10", ownerName: "Patricia Davis", ownerContact: "555-4444" },
  { id: 105, address: "654 Elm Ct, Chicago, IL", price: 420000, bedrooms: 2, bathrooms: 1, sqft: 900, type: "Condo", status: "For Sale", agentId: 4, imageUrl: "https://picsum.photos/400/300?random=14", listedDate: "2023-12-05", ownerName: "Michael Brown", ownerContact: "555-5555" },
  { id: 106, address: "987 Birch Way, Denver, CO", price: 725000, bedrooms: 4, bathrooms: 3, sqft: 2800, type: "Single Family", status: "Pending", agentId: 3, imageUrl: "https://picsum.photos/400/300?random=15", listedDate: "2023-11-15", ownerName: "Jennifer Garcia", ownerContact: "555-6666" },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 201, name: "Alice Wonderland", email: "alice@example.com", budget: 600000, status: "Active", interestedIn: ["Single Family", "Condo"] },
  { id: 202, name: "Bob Builder", email: "bob@example.com", budget: 450000, status: "Active", interestedIn: ["Townhouse"] },
  { id: 203, name: "Charlie Chocolate", email: "charlie@example.com", budget: 1500000, status: "Closed", interestedIn: ["Single Family"] },
  { id: 204, name: "Diana Prince", email: "diana@example.com", budget: 900000, status: "Cold", interestedIn: ["Condo", "Loft"] },
];

export const DB_SCHEMA = `
  TABLE Properties (
    id INT PRIMARY KEY,
    address VARCHAR(255),
    price DECIMAL(10,2),
    bedrooms INT,
    bathrooms DECIMAL(3,1),
    sqft INT,
    type VARCHAR(50), -- 'Single Family', 'Condo', 'Townhouse'
    status VARCHAR(20), -- 'For Sale', 'Pending', 'Sold'
    agent_id INT,
    listed_date DATE,
    owner_name VARCHAR(100),
    owner_contact VARCHAR(50),
    FOREIGN KEY (agent_id) REFERENCES Agents(id)
  );

  TABLE Agents (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    total_sales DECIMAL(15,2),
    rating DECIMAL(3,2),
    commission_rate DECIMAL(4,2) -- Percentage e.g. 2.50
  );

  TABLE Clients (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    budget DECIMAL(10,2),
    status VARCHAR(20) -- 'Active', 'Cold', 'Closed'
  );
`;
