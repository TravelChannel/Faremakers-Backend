import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { databaseConfig } from 'src/database/config/default'; // Import the database configuration

const dbConfig = databaseConfig[process.env.NODE_ENV || 'development']; // Load the appropriate config based on environment
const JWT_SECRET = dbConfig.JWT_SECRET;

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = verifyToken(token, JWT_SECRET); // Replace with your actual JWT secret
        if (decoded) {
          req['userDecoded'] = decoded;
          req['companyId'] = decoded.sub;
        } else {
          throw new UnauthorizedException('Invalid token');
        }
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new UnauthorizedException('Token missing');
    }
    next();
  }
}
