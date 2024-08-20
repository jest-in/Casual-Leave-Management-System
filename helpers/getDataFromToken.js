import { jwtVerify } from "jose";

export default async function getDataFromToken(token) {
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  const { payload } = await jwtVerify(token, secretKey);
  return payload;
}
