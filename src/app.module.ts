import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './common/config/configuration';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PackagesModule } from './packages/packages.module';
import { CountriesModule } from './countries/countries.module';
import { ProvincesModule } from './provinces/provinces.module';
import { DistrictsModule } from './districts/districts.module';
import { PaymentPackageModule } from './payment-packages/payment-packages.module';
import { MuseumsModule } from './museums/museums.module';
import { TwilioModule } from './twilio/twilio.module';
import { MuseumSchedulesModule } from './museum-schedules/museum-schedules.module';
import { GalleriesModule } from './galleries/galleries.module';
import { BcelModule } from './bcel/bcel.module';
import { MuseumSchedulePaymentsModule } from './museum-schedule-payments/museum-schedule-payments.module';
import { SharedModule } from './shared/shared.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GatewayModule } from './gateway/gateway.module';
import { ScheduleTimesModule } from './schedule-times/schedule-times.module';
import { GoogleModule } from './google/google.module';
import { TestModule } from './test/test.module';
import { PaymentWalletsModule } from './payment-wallets/payment-wallets.module';
import { GalleryDetailsModule } from './gallery-details/gallery-details.module';
import { ContentsModule } from './contents/contents.module';
import { PhotosModule } from './photos/photos.module';
import { PricesModule } from './prices/prices.module';
import { CouponsModule } from './coupons/coupons.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentDetailsModule } from './payment-details/payment-details.module';
import { TicketsModule } from './tickets/tickets.module';
import { ReportsModule } from './reports/reports.module';
import { BanksModule } from './banks/banks.module';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration]
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'assets', 'images'),
    serveRoot: "/static",
  }),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('SECRET'),
    }),
    inject: [ConfigService],
  }),
  ScheduleModule.forRoot(),
    RolesModule,
    UsersModule,
    AuthModule,
    PackagesModule,
    CountriesModule,
    ProvincesModule,
    DistrictsModule,
    PaymentPackageModule,
    MuseumsModule,
    TwilioModule,
    MuseumSchedulesModule,
    GalleriesModule,
    BcelModule,
    MuseumSchedulePaymentsModule,
    SharedModule,
    GatewayModule,
    ScheduleTimesModule,
    GoogleModule,
    TestModule,
    PaymentWalletsModule,
    GalleryDetailsModule,
    ContentsModule,
    PhotosModule,
    PricesModule,
    CouponsModule,
    BookingsModule,
    PaymentsModule,
    PaymentDetailsModule,
    TicketsModule,
    ReportsModule,
    BanksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
