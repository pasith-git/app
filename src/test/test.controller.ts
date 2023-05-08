import { Controller, Get, Req, Res } from '@nestjs/common';
import { GoogleService } from 'google/google.service';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

@Controller('test')
export class TestController {
    constructor(private googleService: GoogleService) { }

    @Get("2")
    async test2(@Req() req: Request, @Res() res: Response) {

    }

    @Get("")
    async test(@Req() req: Request, @Res() res: Response) {
        try {
            const oAuth2Client = await this.googleService.getAuthenticatedClient();
            // Make a simple request to the People API using our pre-authenticated client. The `request()` method
            // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
            if (oAuth2Client instanceof OAuth2Client) {
                const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
                const res2 = await oAuth2Client.request({ url });
                console.log(res2.data);

                // After acquiring an access_token, you may want to check on the audience, expiration,
                // or original scopes requested.  You can do that with the `getTokenInfo` method.
                const tokenInfo = await oAuth2Client.getTokenInfo(
                    oAuth2Client.credentials.access_token
                );
                console.log(tokenInfo);
                res.send("test");
            }else{
                res.send("close");
            }

        } catch (e) {
            res.send("test")
        }

    }

    
}
