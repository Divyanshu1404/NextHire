import app from './src/app.js';
import { config } from './src/config/env.js';
import { connectDB } from './src/config/db.js';

const startServer = async () => {
  await connectDB();
  
  app.listen(config.port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${config.port}`);
  });
};

startServer();
