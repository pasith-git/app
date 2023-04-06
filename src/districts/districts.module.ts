import { Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';
import { DistrictsController } from './districts.controller';
import { DistrictsService } from './districts.service';

@Module({
    imports: [SharedModule],
    controllers: [DistrictsController],
    providers: [DistrictsService]
})
export class DistrictsModule { }
