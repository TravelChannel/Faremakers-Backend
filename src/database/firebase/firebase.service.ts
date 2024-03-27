// firebase.service.ts

import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;
  constructor() {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    // const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);
    const firebaseConfig = {
      private_key: privateKey,
      // private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCec5fClsnaF2lG\nksmx62T7er+Aw/l5RsLrAVDguC08bwR6YBUpnkuUBYBASpjDcx1ITJPNAxIU4oUa\nG5dshYw9R8nP2cV9heMZ9epmEEGSUvyFl+7diw8MH9pFQCsyAGozgWyEzXnhxDsy\nylSNrmuDu1TZ5TjCWpGqrwSKf1EBfAP/TWeYXjDEoLeEPPXbs35WhRLkR3HGfLdg\nBqOt8RG6cnoAIZ3r6Jfq3dL17TdlYY3SaNVERWz4QFZJn1BBKfi/p3sP8goHD8Bi\nyxuXNMY2cYDdiDdl/oKYndLIR3/oy/2znOtJr2YAsEy2jTpnSJ9mXOOctU/qmye1\nE6PowD/tAgMBAAECggEAAcdLK5RegHCSB+7B2maWY/qeutoR3mCcjRK4tUab8cYb\noMJo7Zl1pujg5aSj5+qBqG9KAWhInawyBKozaugDPCgM7D5StY2Sw2Nu1bJwNscK\nFCqYAPiWNKaiE1qDCAHYYoRpxjVtA5gcqf2tyuFR553Rd/8KQg3OMMJCJMo4PvIA\nenCP84DlmrL5Fb6UX5QAYERPWL+naN9d9ad2VBSLej8rdSCuoRN5BrEEqKJ0UCLr\nS+S+w4Yp+1z3nnHI1MDfE10BUaVGuiP6ks4K90MJcgUsYFwwCPrU973ij/3pp7b2\nKOsdWlTwxr+XSy66p++bMgArT5vMnqop5wGTKRAD6QKBgQDURw7qCOzuJmzFZzHW\n0RNfwMV/rVi/aCGVnza6XawlkLo4JEFChAXzhkLPRJTPOD7hgdAfhFca1Mj+L7ib\nQuu56AvFL85/EWwS0eLAlL/azT2bRyIk3+ZQYtUZCF9yYBRgSPCooQXmgswsdtXq\nhnHffIywZRz/uzPfYjnorswsxwKBgQC/FmckTmqcRKG3Hmm9itfRXxR8bxoS7v/N\nLZgYhkF1AWcz+Vbn8uquOC7wL38OCyhwUAZ0OqqPaiGHos8npqWYjGiprWZfCL5L\n2VvWT0wqGnmj58b2Ixh+J/v8nIWeKN43+isfNvfDiFfKpXfAQ7kfaAQVyGaJhAvn\nuaCZURHxqwKBgQCOqE5qk6L+jQ4uP6Kr1ggqInfXzRxGTem8DqqN5mPJPxEWp66/\nz8/cD8+YUWOcOxVvIXlHpP2Qx41n3ZQ3q2qVnk9CrlUc6g1yPGEhwRWKKsILN2vH\n0jyKq1DAqPLT/6PR7VLmUIiRmDc0boxmNwISCjbWWK17Y0iCCBYYvFf0gwKBgDsd\nARdYMt7Y1HZDsE50j0Mz+LBt5lEJIpUkj7K2hbVek8CeV+Y1Xag7tTmUV+fOR9pG\nx1hZdb4cBPdixFbt1LiWZyJmhA7OM6BfQ2vO6C72Nb8gyooGXWNZlziUazl8RxJm\nD8T+SjNxEEeeXKdby/8NPIZIkn/kG5K5+Ba136k1AoGBAKBySzZDTv4+qtkh3/NO\nFVDK+EdU9Qx7jLQwnPQp9GaKLTm+YPgrY4lsViXbJtTk+X9Ch0ywgPoQDYQS+nE+\ngGNM/8VHiXeKMxWxx8vWH/riX1F/5+qapOpKSm3v/lB00/tY3RWyWBYf+ANUkLIs\nwroCmdTtltfBy7gYFBX3A0tX\n-----END PRIVATE KEY-----\n',
      client_email: process.env.CLIENT_EMAIL,
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    };
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
    this.storage = admin.storage();
  }

  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<string> {
    const bucket = this.storage.bucket();
    const fileName = `${folderName}/${file.originalname}`;
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
        resolve(`https://storage.googleapis.com/${bucket.name}/${fileName}`);
      });

      stream.end(file.buffer);
    });
  }
}
