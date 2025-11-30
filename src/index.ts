import express from 'express';
const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'admin-event-ops-service' });
});

app.listen(PORT, () => {
  console.log(`Admin Event Operations Service running on port ${PORT}`);
});
