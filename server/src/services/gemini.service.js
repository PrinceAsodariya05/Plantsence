import { GoogleGenAI, Type } from '@google/genai';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    overview: { type: Type.STRING },
    watering: { type: Type.OBJECT, properties: { frequency: { type: Type.STRING }, instructions: { type: Type.STRING }, signsOfOverwatering: { type: Type.STRING } }, required: ['frequency','instructions','signsOfOverwatering'] },
    sunlight: { type: Type.OBJECT, properties: { requirement: { type: Type.STRING }, hoursPerDay: { type: Type.STRING }, instructions: { type: Type.STRING } }, required: ['requirement','hoursPerDay','instructions'] },
    soil: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, drainage: { type: Type.STRING }, ph: { type: Type.STRING } }, required: ['type','drainage','ph'] },
    humidity: { type: Type.OBJECT, properties: { level: { type: Type.STRING }, instructions: { type: Type.STRING } }, required: ['level','instructions'] },
    toxicity: { type: Type.OBJECT, properties: { pets: { type: Type.STRING }, humans: { type: Type.STRING }, precautions: { type: Type.STRING } }, required: ['pets','humans','precautions'] },
    diseases: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, symptoms: { type: Type.STRING }, treatment: { type: Type.STRING } }, required: ['name','symptoms','treatment'] } },
    propagation: { type: Type.OBJECT, properties: { methods: { type: Type.ARRAY, items: { type: Type.STRING } }, instructions: { type: Type.STRING } }, required: ['methods','instructions'] },
    facts: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['overview','watering','sunlight','soil','humidity','toxicity','diseases','propagation','facts']
};

export async function generatePlantInsights(plant) {
  const prompt = [
    'You are a cautious botanical reference assistant.',
    'Give practical care guidance for the identified plant below.',
    'Do not guess when evidence is uncertain. Explicitly state uncertainty for toxicity and care details.',
    'Do not claim a plant is safe to eat. Distinguish species-specific facts from general genus guidance.',
    'Include concise care details, common diseases, propagation methods and interesting facts.',
    `Identification: ${JSON.stringify(plant)}`
  ].join('\n');
  try {
    const result = await ai.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json', responseSchema, temperature: 0.2 }
    });
    if (!result.text) throw new Error('Empty model response');
    return JSON.parse(result.text);
  } catch (error) {
    const status = String(error?.status || error?.message || '');
    if (status.includes('429')) throw new AppError('Plant care service quota exceeded. Try again later.', 503, 'GEMINI_QUOTA');
    throw new AppError('Could not generate plant care information. Please retry.', 502, 'GEMINI_ERROR');
  }
}
