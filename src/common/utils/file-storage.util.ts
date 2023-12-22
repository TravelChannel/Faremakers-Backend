import { diskStorage } from 'multer';
import { extname } from 'path';

export const createFileStorage = (destination: string) => {
  return diskStorage({
    destination: destination,
    filename: async (req, file, callback) => {
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-T:.Z]/g, ''); // Format: YYYYMMDDHHmmss
      if (extname(file.originalname)) {
        return callback(null, `${timestamp}${extname(file.originalname)}`);
      }
      return callback(null, `${timestamp}.png`);
    },
  });
};
