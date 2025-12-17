import { GoogleGenAI, Type } from "@google/genai";
import { DB_SCHEMA } from '../constants';

const API_KEY = process.env.API_KEY || '';

// Initialize outside to avoid re-creation
let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    if (!API_KEY) {
      console.warn("API Key is missing!");
      return null;
    }
    genAI = new GoogleGenAI({ apiKey: API_KEY });
  }
  return genAI;
};

export const generateSQLAnalysis = async (userQuery: string) => {
  const ai = getGenAI();
  if (!ai) throw new Error("API Key not configured");

  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are a Senior Data Analyst and SQL Expert for a Real Estate Management System.
    
    Your goal is to translate natural language questions from real estate agents into executable SQL queries based on the provided schema.
    
    Schema:
    ${DB_SCHEMA}

    Instructions:
    1. Return a JSON object with two fields: 'sql' (the SQL query) and 'explanation' (a brief, professional explanation of what the query retrieves).
    2. If the user asks for analysis (e.g., "trends", "insights"), generate a SQL query that would provide the raw data for that analysis, and explain how you would interpret it.
    3. Ensure the SQL is standard PostgreSQL dialect.
    4. Do not make up tables or columns not in the schema.
    5. Be concise and professional.
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};