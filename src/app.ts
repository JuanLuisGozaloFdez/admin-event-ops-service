import express, { Express } from 'express';
import cors from 'cors';
import eventsRoutes from './routes/events';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/events', eventsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'admin-event-ops-service' });
});

export default app;
