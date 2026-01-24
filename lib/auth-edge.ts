import { jwtVerify, decodeJwt } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-here",
);

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log(payload);
    return payload;
  } catch (error) {
    return null;
  }
}

export function isTokenExpiring(token: string): boolean {
  try {
    const decoded = decodeJwt(token);
    if (!decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp - now < 300;
  } catch (error) {
    return true;
  }
}
