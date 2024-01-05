import { RateLimiter } from "limiter";

// Base rate limiter
export const limiter = new RateLimiter({
  tokensPerInterval: 3,
  interval: "min",
  fireImmediately: true,
});

// TODO: Implement rate limiter for necessary APIs
