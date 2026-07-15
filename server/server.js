import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let reports = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CleanCity API is running' });
});

app.get('/api/reports', (req, res) => {
  res.json(reports);
});

app.post('/api/reports', (req, res) => {
  const report = {
    id: Date.now().toString(),
    ...req.body,
  };
  reports.push(report);
  res.status(201).json(report);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
