import { applyDecorators, UseGuards } from '@nestjs/common'
import { RtAuthGuard } from 'src/common/guards'
import { ApiBearer } from './bearer.decorator'

export const RtAuth = () =>
  process.env.NODE_ENV === 'test'
    ? applyDecorators()
    : applyDecorators(ApiBearer(), UseGuards(RtAuthGuard))
