import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import countryList from "country-list";
import { Response, Request } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("test")
  getHello(@Req() req: Request, @Res() res: Response) {
    res.json(countryList);
  }

}
