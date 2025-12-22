
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
    // Trigger key selection on 404 or 500 errors
    if (error.message?.includes("entity was not found") || error.status === "NOT_FOUND" || error.message?.includes("Rpc failed") || error.code === 500) {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        (window as any).aistudio.openSelectKey();
      }
    }
    throw error;
  }
};

/**
 * Uses Gemini 2.5 with Google Maps grounding to find real-world properties.
 * Note: Maps grounding returns Markdown, not JSON.
 */
export const findNearbyProperties = async (lat: number, lng: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";
  
  const prompt = `Find 3 actual real estate properties currently listed for sale near coordinates lat: ${lat}, lng: ${lng}. Use Google Maps. Provide details on price, location, and property type.`;

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
    if (error.message?.includes("entity was not found") || error.status === "NOT_FOUND" || error.message?.includes("Rpc failed") || error.code === 500) {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        (window as any).aistudio.openSelectKey();
      }
    }
    return "Error scanning nearby properties. Please ensure you have selected a valid paid API key.";
  }
};

/**
 * Uses Gemini 2.5 with Google Maps grounding to find sellers/agencies.
 */
export const findNearbySellers = async (lat: number, lng: number, type: 'Plot' | 'Villa' | 'Any') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";
  const searchType = type === 'Plot' ? 'Land plots and sites for sale' : type === 'Villa' ? 'Luxury Villas for sale' : 'Real Estate Agents';

  const prompt = `Identify the top 3 specialized real estate agencies or developers selling '${searchType}' near lat: ${lat}, lng: ${lng}. Use Google Maps and provide their contact info or website if available.`;

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
    if (error.message?.includes("entity was not found") || error.status === "NOT_FOUND" || error.message?.includes("Rpc failed") || error.code === 500) {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        (window as any).aistudio.openSelectKey();
      }
    }
    return "Error locating specialized sellers. Please verify your API project billing.";
  }
};
