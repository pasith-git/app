import { Module } from '@nestjs/common';
import { GatewayModule } from 'gateway/gateway.module';
import { SharedModule } from 'shared/shared.module';
import { AuthController } from './auth.controller';

@Module({
    imports: [SharedModule, GatewayModule],
    controllers: [AuthController],
})
export class AuthModule { }
