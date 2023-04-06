import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import http from "http"
import url from "url";
import destroyer from "server-destroy";

@Injectable()
export class GoogleService {
    constructor(private configService: ConfigService) { }
    async getAuthenticatedClient(): Promise<any> {
        return new Promise((resolve, reject) => {
            // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
            // which should be downloaded from the Google Developers Console.
            const oAuth2Client = new OAuth2Client(
                this.configService.get<string>("google.web.client_id"),
                this.configService.get<string>("google.web.client_secret"),
                this.configService.get<string>("google.web.redirect_uris[0]"),
            );

            const scopes = [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ]
            // Generate the url that will be used for the consent dialog.
            const authorizeUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
                prompt: "consent",
            });

            // Open an http server to accept the oauth callback. In this simple example, the
            // only request to our webserver is to /oauth2callback?code=<code>
            const server = http
                .createServer(async (req, res) => {
                    try {
                        if (req.url.indexOf('/oauth2callback') > -1) {
                            // acquire the code from the querystring, and close the web server.
                            const qs = new url.URL(req.url, 'http://localhost:8080')
                                .searchParams;
                            const code = qs.get('code');
                            console.log(`Code is ${code}`);
                            res.end('Authentication successful! Please return to the console.');
                            server.destroy();
                            // Now that we have the code, use that to acquire tokens.
                            const r = await oAuth2Client.getToken(code);
                            // Make sure to set the credentials on the OAuth2 client.
                            oAuth2Client.setCredentials(r.tokens);
                            console.info('Tokens acquired.');
                            resolve(oAuth2Client);
                        }
                    } catch (e) {
                        reject(e);
                    }
                })
                .listen(8080, async () => {
                    const dynamicImport = new Function('open', 'return import(open)');
                    const open = await dynamicImport("open");
                    open.default(authorizeUrl, { wait: false }).then(cp => {
                        cp.addListener("close", (e)=>{
                            resolve("close");
                            server.destroy();
                        })
                    });
                });
            destroyer(server);
        });
    }
}
