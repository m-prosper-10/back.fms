declare module "bcrypt" {
  export function hash(value: string, saltRounds: number): Promise<string>;
  export function compare(value: string, hash: string): Promise<boolean>;

  const bcrypt: {
    hash: typeof hash;
    compare: typeof compare;
  };

  export default bcrypt;
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    [key: string]: unknown;
    exp?: number;
  }

  export interface SignOptions {
    expiresIn?: string | number;
  }

  export function sign(payload: object | string, secret: string, options?: SignOptions): string;
  export function verify(token: string, secret: string): JwtPayload;
  export function decode(token: string): JwtPayload | null;

  const jwt: {
    sign: typeof sign;
    verify: typeof verify;
    decode: typeof decode;
  };

  export default jwt;
}
