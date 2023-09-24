declare namespace Express {
    export interface Request {
      file: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
        destination: string;
        filename: string;
        path: string;
      },
      files:{
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
        destination: string;
        filename: string;
        path: string;
      }[]
    }
  }
  