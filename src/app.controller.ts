import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import countryList from "country-list";
import { Response, Request } from "express";
import { sendMessageToMuseumBotGroupChat } from 'common/instances/telegram.instance';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("test")
  async getHello(@Req() req: Request, @Res() res: Response) {
    res.json(countryList);
  }

}
