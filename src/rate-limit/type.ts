interface RateLimitOptions {
  limit: number;
  windowMs: number;
  keyGenerator?: (req: Request) => string;
  handler?: (req: Request, res: Response) => void;
}

interface RateLimitStore {
  increment(key: string): Promise<number>;
  resetKey(key: string): Promise<void>;
}
