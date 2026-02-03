
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { VerificationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeContent = async (
  input: string, 
  imageUri?: string,
  isForensic: boolean = false
): Promise<VerificationResult> => {
  const model = isForensic ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const systemPrompt = `
    Eres Sutita Rimay, el asistente inteligente de HEFE Network y el periodista Elvis Herrada.
    Tu personalidad es la de un "Cerebrito Digital" experto, analítico, amable y protector.
    
    MISIÓN:
    Analizar información para detectar engaños, desinformación y manipulación cognitiva.
    Usa el modelo 3R: Investigación, Evaluación de Riesgos y Respuesta.
    
    TONO:
    Cercano y profesional. Si detectas un riesgo alto, advierte con claridad pero sin causar pánico.
    Ayuda al usuario a decidir: "¿Debo compartir esto?" o "¿Es una estafa?".
    
    REGLAS DE ANÁLISIS:
    1. Detecta Dark Patterns (presión psicológica, falsas urgencias).
    2. Busca indicios de Deepfakes en audios/videos descritos o imágenes.
    3. Verifica hechos usando Google Search Grounding.
    
    DEBES RESPONDER EXCLUSIVAMENTE EN FORMATO JSON:
    {
      "score": número (0-100, veracidad),
      "verdict": "resumen corto de la conclusión",
      "reasoning": "explicación clara y empática para el usuario",
      "intentAnalysis": "por qué alguien creó este contenido y qué sesgo busca explotar",
      "threatLevel": "Low" | "Medium" | "High" | "Critical",
      "sources": [],
      "multimodalChecks": {
        "audioDeepfake": "análisis de voz/audio si aplica",
        "visualConsistency": "análisis visual si aplica",
        "darkPatterns": ["lista de patrones detectados"]
      }
    }
  `;

  const parts: any[] = [{ text: input }];
  if (imageUri) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageUri.split(',')[1]
      }
    });
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: { parts },
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }]
    },
  });

  const text = response.text || "{}";
  const parsed = JSON.parse(text);
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .filter((c: any) => c.web)
    .map((c: any) => ({
      title: c.web.title || "Evidencia Web",
      uri: c.web.uri
    }));

  return {
    ...parsed,
    sources: sources.length > 0 ? sources : (parsed.sources || [])
  };
};
