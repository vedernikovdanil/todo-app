import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import knex from "../persistence";
import IToken from "../interfaces/IToken";
import IUser from "../interfaces/IUser";

dotenv.config();

const ACCESS_KEY = process.env.JWT_ACCESS_SECRET!;
const REFRESH_KEY = process.env.JWT_REFRESH_SECRET!;

class TokenService {
  async getAllTokens() {
    return await knex<IToken>("tokens");
  }

  generateToken(payload: any) {
    return {
      accessToken: jwt.sign(payload, ACCESS_KEY, { expiresIn: "30m" }),
      refreshToken: jwt.sign(payload, REFRESH_KEY, { expiresIn: "30d" }),
    };
  }

  private validateToken(token: string, secretKey: string) {
    try {
      const userData = jwt.verify(token, secretKey);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateAccessToken(token: string) {
    return this.validateToken(token, ACCESS_KEY);
  }

  validateRefreshToken(token: string) {
    return this.validateToken(token, REFRESH_KEY) as IUser;
  }

  async saveToken(userId: string, refreshToken: string) {
    const token = await knex<IToken>("tokens").where({ userId }).first();
    if (token) {
      token.refreshToken = refreshToken;
      await knex<IToken>("tokens").update(token).where({ userId });
      return token;
    }
    const [createdToken] = await knex<IToken>("tokens")
      .insert({ userId, refreshToken })
      .returning("*");
    return createdToken;
  }

  async removeToken(refreshToken: string) {
    const [token] = await knex<IToken>("tokens")
      .where({ refreshToken })
      .delete()
      .returning("*");
    return token;
  }

  async getToken(refreshToken: string) {
    const token = await knex<IToken>("tokens").where({ refreshToken }).first();
    return token;
  }
}

export default TokenService;
