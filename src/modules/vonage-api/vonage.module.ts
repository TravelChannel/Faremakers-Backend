import { Module } from '@nestjs/common';
import { VonageService } from './vonage.service';
import { VonageController } from './vonage.controller';

@Module({

    controllers: [VonageController],
    providers: [VonageService],
    exports: [VonageService], // Make it available to other modules
})
export class VonageModule { }
