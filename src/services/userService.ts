import { UserService, UserProfile } from "@loopback/authentication";
import { User } from "../models";
import { UserRepository, Credentials } from "../repositories";
import { repository } from "@loopback/repository";
import { inject, DefaultConfigurationResolver } from "@loopback/core";
import { PasswordHasherBindings } from "../keys";
import { PasswordHasher } from "./hashPassword";
import { HttpErrors } from "@loopback/rest";

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

    console.log(this.passwordHasher);
    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.password
    );

    if (!passwordMatched) throw new HttpErrors.Unauthorized("The credentials are not correct");

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return { id: user._id, name: user.username };
  }
}
