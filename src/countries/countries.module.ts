import { Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

@Module({
    imports: [SharedModule],
    controllers: [CountriesController],
    providers: [CountriesService]
})
export class CountriesModule { }
