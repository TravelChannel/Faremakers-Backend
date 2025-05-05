import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { VonageService } from './vonage.service';
import { Request, Response } from 'express';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('vonage')
export class VonageController {
    constructor(private readonly vonageService: VonageService) { }

    @Get('send-sms')
    @SkipAuth()
    async sendSMS(
        @Query('to') to: string,
        @Query('text') text: string,
    ) {
        if (!to || !text) {
            return { message: 'Missing "to" or "text" query parameters' };
        }

        await this.vonageService.sendSMS({ to, text });

        return { message: 'SMS sent (if no error occurred)' };
    }

    @Get('answer')
    handleAnswerWebhook(@Req() req: Request, @Res() res: Response) {
        const host = req.get('host');
        const ncco = this.vonageService.getNCCO(req.hostname);
        return res.status(200).json(ncco);
    }

    @Post('events')
    handleEventWebhook(@Body() body: any, @Res() res: Response) {
        console.log(body);
        return res.sendStatus(200); // Equivalent to res.send(200)
    }


}
