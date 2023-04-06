import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleService } from './google.service';

@Module({
  providers: [GoogleService, ConfigService],
  exports: [GoogleService]
})
export class GoogleModule { }
