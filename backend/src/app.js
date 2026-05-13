import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();


app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the Job Portal API' });
});


app.use('/api', routes);


app.use(errorHandler);


app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

export default app;
