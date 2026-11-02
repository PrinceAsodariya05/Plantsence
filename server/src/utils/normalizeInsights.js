const text = value => typeof value === 'string' ? value.trim() : '';
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const stringArray = value => Array.isArray(value) ? value.filter(item => typeof item === 'string').map(item => item.trim()).filter(Boolean) : [];

/**
 * Normalize Gemini output to the shape expected by PlantScan.
 * Missing optional guidance stays empty rather than being fabricated.
 * A neutral overview is used only when Gemini omits the required overview field,
 * so a valid plant identification can still be saved and the UI can show the gap.
 */
export function normalizeInsights(value) {
  const source = object(value);
  const watering = object(source.watering);
  const sunlight = object(source.sunlight);
  const soil = object(source.soil);
  const humidity = object(source.humidity);
  const toxicity = object(source.toxicity);
  const propagation = object(source.propagation);

  const diseases = Array.isArray(source.diseases)
    ? source.diseases.filter(item => item && typeof item === 'object' && !Array.isArray(item)).map(item => ({
        name: text(item.name),
        symptoms: text(item.symptoms),
        treatment: text(item.treatment)
      })).filter(item => item.name || item.symptoms || item.treatment)
    : [];

  return {
    overview: text(source.overview) || 'A care overview was not returned for this identification. Verify plant-specific guidance with a reliable botanical source.',
    watering: {
      frequency: text(watering.frequency),
      instructions: text(watering.instructions),
      signsOfOverwatering: text(watering.signsOfOverwatering)
    },
    sunlight: {
      requirement: text(sunlight.requirement),
      hoursPerDay: text(sunlight.hoursPerDay),
      instructions: text(sunlight.instructions)
    },
    soil: { type: text(soil.type), drainage: text(soil.drainage), ph: text(soil.ph) },
    humidity: { level: text(humidity.level), instructions: text(humidity.instructions) },
    toxicity: {
      pets: text(toxicity.pets),
      humans: text(toxicity.humans),
      precautions: text(toxicity.precautions)
    },
    diseases,
    propagation: { methods: stringArray(propagation.methods), instructions: text(propagation.instructions) },
    facts: stringArray(source.facts)
  };
}
