import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  REDIS_URL: z.string().optional().default('redis://127.0.0.1:6379/0'),
  PORT: z.coerce.number().optional().default(3333),
  DOMAIN: z.string().url().optional().default('http://localhost:3333'),
})

export type Env = z.infer<typeof envSchema>
