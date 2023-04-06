import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from "twilio";
import Twilio from 'twilio/lib/rest/Twilio';

@Injectable()
export class TwilioService {
    private client: Twilio;
    constructor(private configService: ConfigService) {
        this.client = twilio(this.configService.get<string>("TWILIO.ASID"), this.configService.get<string>("TWILIO.TOKEN"));
    }

    async sendSms(phone: string) {
        return this.client.verify.v2.services(this.configService.get<string>("TWILIO.SID"))
            .verifications
            .create({ to: `+${phone}`, channel: "sms" });
    }

    async verifySmsCode(phone: string, code: string) {
        return this.client.verify.v2.services(this.configService.get<string>("TWILIO.SID"))
            .verificationChecks
            .create({ to: `+${phone}`, code });
    }
}
