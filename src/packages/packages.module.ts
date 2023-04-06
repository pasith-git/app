import { Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';

@Module({
    imports: [SharedModule],
    controllers: [PackagesController],
    providers: [PackagesService]
})
export class PackagesModule {}
