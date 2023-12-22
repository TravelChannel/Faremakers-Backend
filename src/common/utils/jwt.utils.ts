import * as jwt from 'jsonwebtoken';
import { User } from '../../modules/generalModules/users/entities/user.entity';
import { databaseConfig } from 'src/database/config/default';

const dbConfig = databaseConfig[process.env.NODE_ENV || 'development']; // Load the appropriate config based on environment
const JWT_SECRET = dbConfig.JWT_SECRET;
const JWT_REFRESH_SECRET = dbConfig.JWT_REFRESH_SECRET;

export function generateAccessToken(user: User, companyId): string {
  const payload = { sub: user.id, email: user.email, companyId };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '6h',
  });
  return token;
}

export function generateRefreshToken(user: User, companyId): string {
  const payload = { sub: user.id, companyId };
  const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
  return token;
}

export function verifyToken(token: string, secret: string): any {
  try {
    const decoded = jwt.verify(token, secret);

    return decoded;
  } catch (error) {
    return null;
  }
}
