
import { GoogleGenAI, Type } from "@google/genai";
import { DB_SCHEMA, MARKET_PORTALS } from '../constants';

/**
 * Generates SQL analysis using Gemini 3 Pro.
 */
export const generateSQLAnalysis = async (userQuery: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";
  
  const systemInstruction = `
    You are a Senior Data Analyst for EstateMind AI.
    Translate natural language to optimized PostgreSQL.
    Schema: ${DB_SCHEMA}
    Rules: Prefer EXISTS over IN. Return JSON with 'sql' and 'explanation'.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userQuery,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                sql: { type: Type.STRING },
                explanation: { type: Type.STRING }
            },
            required: ["sql", "explanation"]
        }
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Gemini SQL Error:", error);
    if (error.message?.includes("entity was not found") || error.status === "NOT_FOUND" || error.message?.includes("Rpc failed") || error.code === 500) {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        (window as any).aistudio.openSelectKey();
      }
    }
    throw error;
  }
};

/**
 * Uses Gemini 3 Flash with Google Search grounding to find REAL properties.
 * Explicitly searching user-provided 100+ global websites across categories.
 */
export const searchWebForProperties = async (query: string, category: keyof typeof MARKET_PORTALS = 'Residential') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const portals = MARKET_PORTALS[category] || MARKET_PORTALS.Residential;
  const portalList = portals.join(", ");

  const prompt = `
    Fetch actual current real estate listings for: ${query}. 
    CROSS-REFERENCE and prioritize these specific portals for the ${category} market: ${portalList}.
    Include precise details on price, location, and the direct source URL from these platforms.
    Provide a comprehensive summary of the market availability.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error: any) {
    console.error("Gemini Search Error:", error);
    return { text: "Search failed. Please verify API key.", sources: [] };
  }
};

/**
 * Uses Gemini 3 Flash with Google Search grounding to find REAL agents/agencies.
 */
export const searchWebForAgents = async (query: string, category: keyof typeof MARKET_PORTALS = 'Residential') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const portals = MARKET_PORTALS[category] || MARKET_PORTALS.Residential;
  const portalList = portals.join(", ");

  const prompt = `
    Identify top real estate agents or brokerage firms specializing in ${query}.
    Scan global industry leaders and niche portals specifically from this list: ${portalList}.
    Cross-reference with local specialized platforms if relevant.
    Include names, specialties, performance metrics if available, and official website links.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error: any) {
    console.error("Gemini Agent Search Error:", error);
    return { text: "Search failed. Please verify API key.", sources: [] };
  }
};

/**
 * Uses Gemini 2.5 with Google Maps grounding to find real-world properties.
 */
export const findNearbyProperties = async (lat: number, lng: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";
  
  const prompt = `Find 3 actual real estate properties currently listed for sale near coordinates lat: ${lat}, lng: ${lng}. Use Google Maps and cross-reference with top listing sites like Zillow, MagicBricks, or Realtor.com.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      }
    });

    return response.text || "No specific properties found in this immediate area.";
  } catch (error: any) {
    console.error("Gemini Maps Error:", error);
    return "Error scanning nearby properties.";
  }
};

/**
 * Uses Gemini 2.5 with Google Maps grounding to find sellers/agencies.
 */
export const findNearbySellers = async (lat: number, lng: number, type: 'Plot' | 'Villa' | 'Any') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";
  const searchType = type === 'Plot' ? 'Land plots and sites for sale' : type === 'Villa' ? 'Luxury Villas for sale' : 'Real Estate Agents';

  const prompt = `Identify the top 3 specialized real estate agencies or developers selling '${searchType}' near lat: ${lat}, lng: ${lng}. Cross-reference with global brokerages like Knight Frank, Sotheby's, or local experts from Housing.com.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      }
    });

    return response.text || "No specialized sellers found nearby.";
  } catch (error: any) {
    console.error("Gemini Sellers Error:", error);
    return "Error locating specialized sellers.";
  }
};
