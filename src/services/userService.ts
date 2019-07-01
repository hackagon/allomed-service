import { UserService, UserProfile } from "@loopback/authentication";
import { User } from "../models";
import { UserRepository, Credentials } from "../repositories";
import { repository } from "@loopback/repository";
import { inject, DefaultConfigurationResolver } from "@loopback/core";
import { PasswordHasherBindings } from "../keys";
import { PasswordHasher } from "./hashPassword";
import { HttpErrors } from "@loopback/rest";
import * as _ from "lodash";

interface TokenPayload extends UserProfile {
  id: string;
  userType: string;
}

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) public passwordHasher: PasswordHasher
  ) { }

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { username: credentials.username }
    });

    if (!foundUser) throw new HttpErrors.NotFound("User does not found");

    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.password
    );

    if (!passwordMatched) throw new HttpErrors.Unauthorized("The credentials are not correct");

    return foundUser;
  }

  convertToUserProfile(user: User): TokenPayload {
    return { id: user.id, name: user.username, userType: user.userType };
  }
}
