import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearer } from './bearer.decorator'
import { AuthGuard } from 'src/common/guards'

export const Auth = () => applyDecorators(ApiBearer(), UseGuards(AuthGuard))
