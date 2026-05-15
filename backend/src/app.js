import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { rateLimit, sanitizeRequest, securityHeaders } from './middleware/security.middleware.js';
import { config } from './config/env.js';

const app = express();


app.use(helmet());
app.use(securityHeaders);
app.use(cors({
  origin: config.clientUrl || true,
  credentials: true,
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeRequest);

// Temporary request logger for debugging login 500s
app.use((req, res, next) => {
  try {
    console.log('>>> Incoming request:', req.method, req.originalUrl);
    if (req.method === 'POST' || req.method === 'PUT') {
      console.log('>>> Body:', JSON.stringify(req.body));
    }
    console.log('>>> Query:', req.query || {});
  } catch (err) {
    console.log('>>> Request logger error', err);
  }
  next();
});


app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the Job Portal API' });
});


app.use('/api', routes);


app.use(errorHandler);


app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

export default app;
