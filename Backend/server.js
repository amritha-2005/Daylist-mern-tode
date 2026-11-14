import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import todoRoutes from './routes/todos.js';

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is not set. Add it to backend/.env.');
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});
app.use('/api/todos', todoRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);
  const status = error.name === 'ValidationError' ? 400 : error.status || 500;
  response.status(status).json({
    message: status < 500 ? error.message : 'An unexpected server error occurred.'
  });
});

try {
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    console.log(`Todo API listening at http://localhost:${port}`);
  });
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exitCode = 1;
}
