import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Global() // Decorate the module as global
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService], // Export FirebaseService for use in other modules
})
export class FirebaseModule {}
