import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';
interface RateLimitConfig {
  limiter: ReturnType<typeof Ratelimit.slidingWindow>;
  analytics?: boolean;
  timeout?: number;
}

export const handleRateLimit = async (req: NextRequest, config: RateLimitConfig) => {
  const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
  const rateLimit = new Ratelimit({
    redis: redis,
    limiter: config.limiter,
    analytics: config.analytics ?? true,
    timeout: config.timeout ?? 1000,
  });
  const { success, limit, reset, remaining } = await rateLimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'You have reached the maximum number of requests. Please try again later.',
        limit,
        reset,
        remaining,
      },
      { status: 429 }
    );
  }

  return null; // Return null if rate limiting is successful
};
