import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { notFoundMiddleware } from './middlewares/notFound.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// Security middleware
app.use(helmet());

// CORS configuratio
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.FRONTEND_ORIGIN,
        process.env.DASHBOARD_ORIGIN,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
      ];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Also allow local network IPs during development if needed
        if (origin.startsWith('http://192.168.') || origin.startsWith('http://172.')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ limit: '16kb', extended: true }));
app.use(cookieParser());

// Logging middleware (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API routes
app.use('/api/v1', routes);

// Not found middleware
app.use(notFoundMiddleware);

// Error handling middleware (must be last)
app.use(errorMiddleware);

export default app;
