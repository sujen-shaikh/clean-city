import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './config/db.js';
import authRoutes from './routes/auth.js';
import reportsRoutes from './routes/reports.js';

// Load .env relative to this file so variables resolve regardless of CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("✅ MySQL Connected");

    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ MySQL Error:", error.message);
    process.exit(1);
  }
};

start();