import mongoose from 'mongoose';

const soilSchema = new mongoose.Schema({
  type: { type: String, default: '' },
  drainage: { type: String, default: '' },
  ph: { type: String, default: '' }
}, { _id: false });

const careSchema = new mongoose.Schema({
  overview: { type: String, required: true },
  watering: { frequency: String, instructions: String, signsOfOverwatering: String },
  sunlight: { requirement: String, hoursPerDay: String, instructions: String },
  soil: { type: soilSchema, default: () => ({}) },
  humidity: { level: String, instructions: String },
  toxicity: { pets: String, humans: String, precautions: String },
  diseases: [{ name: String, symptoms: String, treatment: String }],
  propagation: { methods: [String], instructions: String },
  facts: [String]
}, { _id: false });

const plantScanSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, maxlength: 100, index: true },
  imageDataUrl: { type: String, required: true, select: false },
  identification: {
    scientificName: { type: String, required: true, index: true },
    commonNames: { type: [String], default: [] },
    family: String,
    genus: String,
    species: String,
    probability: { type: Number, min: 0, max: 1, required: true }
  },
  insights: { type: careSchema, required: true }
}, { timestamps: true });

plantScanSchema.index({ createdAt: -1 });
plantScanSchema.index({ sessionId: 1, createdAt: -1 });
export const PlantScan = mongoose.model('PlantScan', plantScanSchema);
