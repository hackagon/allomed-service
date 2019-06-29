import * as _ from 'lodash';
import { HttpErrors } from '@loopback/rest';
import * as validator from 'validator';
import { UserRepository, RegisterInput } from '../repositories';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';

export class ValidateRegisterInput {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
  ) { }

  async validate(data: RegisterInput) {
    data.username = _.get(data, "username", "");
    data.email = _.get(data, "email", "");
    data.password = _.get(data, "password", "");
    data.password2 = _.get(data, "password2", "");

    // email
    if (validator.isEmpty(data.email)) {
      throw new HttpErrors.UnprocessableEntity("Email is required");
    }
    if (!validator.isEmail(data.email)) {
      throw new HttpErrors.UnprocessableEntity("Email is invalid");
    }

    // username
    if (validator.isEmpty(data.username)) {
      throw new HttpErrors.UnprocessableEntity("Email is required");
    }
    const existUser = await this.userRepository.findOne({ where: { username: data.username } });
    if (existUser) throw new HttpErrors.UnprocessableEntity("Username exists");

    // password
    if (validator.isEmpty(data.password)) {
      throw new HttpErrors.UnprocessableEntity("Password is required");
    }

    // confirm password
    if (validator.isEmpty(data.password2)) {
      throw new HttpErrors.UnprocessableEntity("Confirm password is required");
    }
    if (!validator.equals(data.password, data.password2)) {
      throw new HttpErrors.UnprocessableEntity("Password must match");
    }
  }
}
