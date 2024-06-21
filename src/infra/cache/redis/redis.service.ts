import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    super(envService.get('REDIS_URL'))
  }

  async onModuleDestroy() {
    return this.disconnect()
  }
}
