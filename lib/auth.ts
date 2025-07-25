import * as jose from "jose";
import { cookies } from "next/headers";

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
  [key: string]: string | number | undefined;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export async function verifyAuth(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log('verifyAuth - Token:', token);

    if (!token) {
      console.log('verifyAuth - No token found.');
      return null;
    }

    const verifiedToken = await verifyToken(token);
    console.log('verifyAuth - Verified Token Payload:', verifiedToken);
    return verifiedToken;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jose.jwtVerify(token, secret);
    console.log('verifyToken - Raw Payload:', payload);
    
    if (!payload.userId || !payload.email) {
      console.log('verifyToken - Missing userId or email in payload.');
      return null;
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      iat: payload.iat as number,
      exp: payload.exp as number
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
} 