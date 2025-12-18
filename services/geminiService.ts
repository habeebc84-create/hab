
import { GoogleGenAI, Type } from "@google/genai";
import { DB_SCHEMA } from '../constants';

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
    // Handle 404/NOT_FOUND which often requires a specific paid key
    if (error.message?.includes("entity was not found") || error.status === "NOT_FOUND") {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        (window as any).aistudio.openSelectKey();
      }
    }
    throw error;
  }
};

/**
 * Uses Gemini 2.5 with Google Maps grounding to find real-world properties.
 */
export const findNearbyProperties = async (lat: number, lng: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash"; // Maps grounding is supported in 2.5 series
  
  const prompt = `Find 3 real estate properties for sale near lat: ${lat}, lng: ${lng}. Use Google Maps.
  Return JSON array with: address, price (INR), bedrooms, bathrooms, sqft, type.`;

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

    let text = response.text || "[]";
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Maps Error:", error);
    if (error.message?.includes("entity was not found") || error.status === "NOT_FOUND") {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        (window as any).aistudio.openSelectKey();
      }
    }
    return [];
  }
};

/**
 * Uses Gemini 2.5 with Google Maps grounding to find sellers/agencies.
 */
export const findNearbySellers = async (lat: number, lng: number, type: 'Plot' | 'Villa' | 'Any') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";
  const searchType = type === 'Plot' ? 'Land plots and sites for sale' : type === 'Villa' ? 'Luxury Villas for sale' : 'Real Estate Agents';

  const prompt = `Find 3 sellers/agencies selling '${searchType}' near lat: ${lat}, lng: ${lng}. Use Google Maps.
  Return JSON array with: name, location, inventoryType, contact.`;

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

    let text = response.text || "[]";
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Sellers Error:", error);
    if (error.message?.includes("entity was not found") || error.status === "NOT_FOUND") {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        (window as any).aistudio.openSelectKey();
      }
    }
    return [];
  }
};
