import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private configService: ConfigService, private jwtService: JwtService) { }

    jwtSign(payload: any) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>("SECRET"),
        });
    }

    jwtVerify(token: string) {
        return this.jwtService.verify(token, {
            secret: this.configService.get<string>("SECRET"),
        })
    }

    jwtDecode(token: string) {
        return this.jwtService.decode(token);
    }

    generatePassword(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}


