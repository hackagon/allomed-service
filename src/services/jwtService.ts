import { TokenService, UserProfile } from "@loopback/authentication";
import { HttpErrors } from "@loopback/rest";
import * as jwt from "jsonwebtoken";
import { inject } from "@loopback/core";
import { TokenServiceBindings } from "../keys";
import * as _ from "lodash";

interface Payload {
  id: string;
  username: string;
}

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.SECRET_KEY) private jwtSecretKey: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private jwtExpiresIn: number
  ) { }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) throw new HttpErrors.Unauthorized("Error verifying token");

    let userProfile: Payload;
    try {
      const decoded = await jwt.verify(token, this.jwtSecretKey);
      userProfile = {
        id: _.get(decoded, "id"),
        username: _.get(decoded, "username")
      };
      return userProfile;

    } catch (error) {
      throw new HttpErrors.Unauthorized("Token is invalid");
    }
  };
  /**
   * Generates a token string based on a user profile
   */
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) throw new HttpErrors.Unauthorized("Cannot generate token");

    let token: string;

    try {
      token = await jwt.sign(userProfile, this.jwtSecretKey, {
        expiresIn: this.jwtExpiresIn
      });
      return token;
    } catch (error) {
      throw new HttpErrors.Unauthorized("Error when generate token");
    }
  }
}
