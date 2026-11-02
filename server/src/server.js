import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import plantRoutes from './routes/plants.routes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
const allowedOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok' }));
app.use('/api/plants', plantRoutes);
app.use(notFound);
app.use(errorHandler);

await connectDB();
app.listen(env.PORT, () => console.info(`PlantSense API listening on port ${env.PORT}`));
