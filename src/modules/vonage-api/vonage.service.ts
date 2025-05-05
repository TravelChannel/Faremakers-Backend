import { Injectable, Logger } from '@nestjs/common';
import { SmsOptions } from './interfaces/sms-options.interface';
import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth';

@Injectable()
export class VonageService {
    private readonly vonage: Vonage;
    private readonly defaultFrom = 'Vonage APIs';
    private readonly logger = new Logger(VonageService.name);

    constructor() {
        this.vonage = new Vonage(
            new Auth({
                apiKey: process.env.VONAGE_API_KEY,
                apiSecret: process.env.VONAGE_API_SECRET,
            })
        );
    }

    async sendSMS(options: SmsOptions): Promise<void> {
        const { to, text, from = this.defaultFrom } = options;
        try {
            const response = await this.vonage.sms.send({ to, from, text });
            this.logger.log('SMS sent successfully');
            this.logger.debug(JSON.stringify(response, null, 2));
        } catch (error) {
            this.logger.error('Error sending SMS', error);
        }
    }

    getNCCO(hostname: string): any[] {
        return [
            {
                action: 'talk',
                text: 'Please wait while we connect you to the echo server',
            },
            {
                action: 'connect',
                from: 'Vonage',
                endpoint: [
                    {
                        type: 'websocket',
                        uri: `wss://${hostname}/socket`,
                        'content-type': 'audio/l16;rate=16000',
                    },
                ],
            },
        ];
    }
}
