import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'

export const corsSettings: CorsOptions = {
  origin: true,
  allowedHeaders: [
    'authorization',
    'content-type',
    'Authorization',
    'Content-Type',
    'origin',
    'x-requested-with',
  ],
  methods: ['GET', 'POST', 'OPTIONS', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  maxAge: 600,
}
