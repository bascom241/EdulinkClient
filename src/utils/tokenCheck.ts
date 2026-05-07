import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.log(error)
    return true
  }
};
