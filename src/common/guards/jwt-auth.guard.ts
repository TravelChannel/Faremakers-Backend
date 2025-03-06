import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const token = authHeader.split(' ')[1]; // Extract token (Bearer <token>)
    try {
      const decoded = this.jwtService.verify(token); // Verify JWT
      request.user = decoded; // Attach user to request
      return true; // Allow request
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
