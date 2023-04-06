import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'auth/auth.service';
import { PrismaService } from 'prisma/prisma.service';
import { RolesService } from 'roles/roles.service';
import { TwilioService } from 'twilio/twilio.service';
import { UsersModule } from 'users/users.module';
import { UsersService } from 'users/users.service';

@Module({
    providers: [JwtService, ConfigService, TwilioService, AuthService, PrismaService, UsersService, RolesService],
    exports: [JwtService, ConfigService, TwilioService, AuthService, PrismaService, UsersService, RolesService],
})
export class SharedModule { }
