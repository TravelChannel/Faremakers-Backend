// session.serializer.ts
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../../modules/generalModules/users/users.service'; // Adjust the path based on your project structure
import { User } from '../../modules/generalModules/users/entities/user.entity'; // Adjust the path based on your project structure

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: any) => void): any {
    console.log('serializeUser');
    done(null, user); // Serialize the user into the session by storing their ID
  }

  async deserializeUser(
    userPayload: any,
    done: (err: Error, payload: any) => void,
  ): Promise<any> {
    console.log('deserializeUser');

    try {
      const user = await this.userService.findById(userPayload.id); // Fetch user data based on ID
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
