import { Module } from '@nestjs/common';
import { GoogleService } from 'google/google.service';
import { SharedModule } from 'shared/shared.module';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [SharedModule],
  controllers: [TestController],
  providers: [TestService, GoogleService]
})
export class TestModule {}
