import { Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';
import { RolesController } from './roles.controller';

@Module({
    imports: [SharedModule],
    controllers: [RolesController],
})
export class RolesModule { }
