declare namespace Express {
    interface Request {
      
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
  

// custom.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      displayName: string;
      name: {
        familyName: string;
        givenName: string;
      };
      emails: { value: string; verified: boolean }[];
      photos: { value: string }[];
      provider: string;
      _raw: string;
      _json: {
        sub: string;
        name: string;
        given_name: string;
        family_name: string;
        picture: string;
        email: string;
        email_verified: boolean;
        locale: string;
        // Định nghĩa các thuộc tính khác của người dùng tại đây nếu cần
      } | undefined; // Đặt kiểu dữ liệu cho user là optional (hoặc không bắt buộc)
    };
  }
}
