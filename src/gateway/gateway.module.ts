import { Module } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { SharedModule } from 'shared/shared.module';
import { EventsGateway } from './events.gateway';

@Module({
    imports: [SharedModule],
    providers: [EventsGateway],
    exports: [EventsGateway]
})
export class GatewayModule {}
