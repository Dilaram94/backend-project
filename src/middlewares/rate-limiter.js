import rateLimit from 'express-rate-limit';
export default rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 1,
  message: 'Too many requests from this IP, please try again latter',
});
