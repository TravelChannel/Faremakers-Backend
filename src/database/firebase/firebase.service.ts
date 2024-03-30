// firebase.service.ts

import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const firebaseConfig = {
      private_key: privateKey,
      client_email: process.env.CLIENT_EMAIL,
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket:
        process.env.STORAGE_BUCKET || 'faremakers-connect.appspot.com',
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    };

    // Check if the storageBucket property is provided
    if (!firebaseConfig.storageBucket) {
      throw new Error(
        'Storage bucket not specified. Please specify the STORAGE_BUCKET environment variable.',
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: firebaseConfig.storageBucket, // Specify the storage bucket explicitly
    });

    this.storage = admin.storage();
  }

  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<string> {
    const bucket = this.storage.bucket();
    // const fileName = `Faremakers-Web/${folderName}/${file.filename}`;
    const fileName = `Faremakers-Web/${folderName}/${Date.now()}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', () => {
        //  https://firebasestorage.googleapis.com/v0/b/faremakers-connect.appspot.com/o/Faremakers-Web%2Fblogs%2F20240327121309609.png?alt=media&token=8fd1ca6e-9b81-4220-8ce8-4fd6b7b5bcac
        resolve(
          `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}`,
        );
      });

      stream.end(file.buffer);
    });
  }
}
