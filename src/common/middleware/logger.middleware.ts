import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request ${req.method} ${req.url}`);
    // You can log additional information here, like headers, body, etc.

    res.on('finish', () => {
      console.log(`Response ${res.statusCode}`);
      // You can log additional information here about the response, if needed.
    });
    next();
  }
}
