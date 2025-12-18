
import { Property, Agent, Client, Transaction } from './types';

export const REAL_ESTATE_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80", // Field/Plot
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", // Mountain View Plot
  "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=800&q=80", // Modern Villa
  "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"  // Luxury Pool Villa
];

const SOURCES = [
  "MagicBricks", "99Acres", "Housing.com", "Zillow", "Redfin", "Trulia", 
  "Realtor.com", "Sotheby's", "Christie's", "Knight Frank", "Coldwell Banker",
  "RE/MAX", "Century 21", "Direct"
];

const SPECIALTIES = ['Luxury', 'Residential', 'Commercial', 'Plots', 'Foreclosure', 'Industrial'] as const;

const generateAgents = (): Agent[] => {
  const agents: Agent[] = [];
  const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle", "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];

  for (let i = 0; i < 50; i++) {
    const name = `${firstNames[i]} ${lastNames[i]}`;
    agents.push({
      id: i + 1,
      name,
      email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@estatemind.com`,
      phone: `+91 9${Math.floor(Math.random() * 90000 + 10000)} ${Math.floor(Math.random() * 90000 + 10000)}`,
      experienceYears: Math.floor(Math.random() * 25) + 1,
      rating: parseFloat((Math.random() * (5.0 - 3.8) + 3.8).toFixed(1)),
      imageUrl: `https://i.pravatar.cc/150?u=${i + 1000}`,
      commissionRate: parseFloat((Math.random() * (4.0 - 1.0) + 1.0).toFixed(1)),
      specialty: SPECIALTIES[i % SPECIALTIES.length],
      source: SOURCES[i % SOURCES.length]
    });
  }
  return agents;
};

export const MOCK_AGENTS = generateAgents();

const generateProperties = (): Property[] => {
  const properties: Property[] = [];
  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Plot', 'Villa', 'Loft'] as const;
  const statuses = ['For Sale', 'Pending', 'Sold'] as const;
  
  for (let i = 0; i < 60; i++) {
    const isPlot = i % 4 === 0;
    const isVilla = i % 5 === 0;
    const type = isPlot ? 'Plot' : isVilla ? 'Villa' : propertyTypes[i % propertyTypes.length];
    const price = isVilla ? Math.floor(Math.random() * (300000000 - 50000000) + 50000000)
                : isPlot ? Math.floor(Math.random() * (80000000 - 1500000) + 1500000)
                : Math.floor(Math.random() * (50000000 - 4500000) + 4500000);

    const city = i < 30 ? "Chennai" : ["Mumbai", "Bangalore", "Hyderabad", "Delhi", "Pune", "Goa"][i % 6];
    const imageIndex = isPlot ? 10 + (i % 2) : isVilla ? 12 + (i % 2) : i % 10;

    properties.push({
      id: 100 + i,
      address: `${Math.floor(Math.random() * 2000) + 1}, ${['ECR', 'OMR', 'Poes Garden', 'Jubilee Hills', 'Bandra West'][i % 5]}`,
      city,
      price,
      bedrooms: isPlot ? 0 : Math.floor(Math.random() * 5) + 3,
      bathrooms: isPlot ? 0 : Math.floor(Math.random() * 4) + 2,
      sqft: isPlot ? Math.floor(Math.random() * 10000 + 1200) : Math.floor(Math.random() * 6000 + 1500),
      type,
      status: statuses[i % 3],
      agentId: (i % MOCK_AGENTS.length) + 1,
      imageUrl: REAL_ESTATE_IMAGES[imageIndex] || REAL_ESTATE_IMAGES[0],
      listedDate: new Date().toISOString().split('T')[0],
      ownerName: `Premium Owner ${i+1}`,
      ownerContact: `+91 9${Math.floor(8000 + Math.random() * 1999)}${Math.floor(100000 + Math.random() * 900000)}`,
      source: SOURCES[i % SOURCES.length]
    });
  }
  return properties;
};

export const MOCK_PROPERTIES = generateProperties();
export const MOCK_CLIENTS = []; // Empty for brevity in generation, assume initialized elsewhere
export const MOCK_TRANSACTIONS = [];

export const DB_SCHEMA = `
  TABLE AGENTS (AgentID INT PRIMARY KEY, AgentName VARCHAR(100), ExperienceYears INT, Specialty VARCHAR(50), Source VARCHAR(50), Rating DECIMAL(2,1));
  TABLE PROPERTIES (PropertyID INT PRIMARY KEY, Address VARCHAR(255), City VARCHAR(100), ListedPrice DECIMAL(15,2), Type VARCHAR(50), SQFT INT, Source VARCHAR(50));
  TABLE TRANSACTIONS (TransactionID INT PRIMARY KEY, AgentID INT, ClientID INT, PropertyID INT, SalePrice DECIMAL(15,2), Commission DECIMAL(15,2), FeedbackRating INT, TransactionDate DATE);
`;
