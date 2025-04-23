import express from 'express';
import { followerRouter } from './src/api/followers.js';
import rateLimiter from './src/middlewares/rate-limiter.js';
import { historyRouter } from './src/api/history.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//apply rate limiter middleware
app.use(rateLimiter);

//routes
app.use('/api', followerRouter);
app.use('/api', historyRouter);

//Global error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ error: err.message });
});

if (process.argv[1].endsWith('index.js')) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
