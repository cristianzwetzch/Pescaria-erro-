
import { GoogleGenAI, Type } from "@google/genai";
import { FishingSession, CalculatedStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface FishingInsight {
  intro: string;
  performanceAnalysis: string;
  recommendations: {
    title: string;
    description: string;
  }[];
  conclusion: string;
}

export const getFishingInsights = async (session: FishingSession, stats: CalculatedStats): Promise<FishingInsight | string> => {
  const prompt = `
    Como um guia de pesca profissional de alta performance, analise esta performance:
    
    ESTATÍSTICAS DO DIA:
    - Total de Arremessos (Casts): ${session.metrics.casts}
    - Custo de Captura: 1 peixe a cada ${stats.castsPerFish.toFixed(1)} arremessos.
    - Taxa de Ataque: ${(stats.attackRate * 100).toFixed(1)}% (Ataques por Arremesso).
    - Eficiência de Embarque: ${(stats.landingRate * 100).toFixed(1)}% (Peixes capturados vs fisgados).
    - Peixes Perdidos: ${session.metrics.lost}
    
    CONTEXTO: ${session.notes || "O pescador não deixou notas específicas."}

    OBJETIVO:
    Dê 3 conselhos estratégicos para aumentar a eficiência por arremesso. 
    Dê MUITA ÊNFASE aos números importantes na seção de análise (Custo de Captura, Taxa de Ataque, etc).
    Use markdown (**negrito**) para destacar os valores numéricos.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intro: { 
              type: Type.STRING,
              description: "Uma breve introdução motivadora e técnica."
            },
            performanceAnalysis: { 
              type: Type.STRING,
              description: "Análise técnica dos números. DEVE conter valores em negrito (ex: **17,5 arremessos por peixe**)."
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Título do ponto de melhoria (ex: Manutenção de Ponta de Anzol)" },
                  description: { type: Type.STRING, description: "Explicação técnica e detalhada." }
                },
                required: ["title", "description"]
              },
              description: "Exatamente 3 pontos de recomendação."
            },
            conclusion: { 
              type: Type.STRING,
              description: "Uma frase de encerramento impactante."
            }
          },
          required: ["intro", "performanceAnalysis", "recommendations", "conclusion"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text) as FishingInsight;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível conectar com a central de inteligência agora. Continue focado nos arremessos!";
  }
};
