import { rateLimit } from "express-rate-limit";

// Create and use the rate limiter
const limiter = rateLimit({
  // Rate limiter configuration
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 20 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
    });
  },
});

export default limiter;
