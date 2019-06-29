import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {
  authenticate,
  UserProfile,
  AuthenticationBindings,
  TokenService,
  UserService,
} from '@loopback/authentication';
import { inject } from '@loopback/core';
import { User, UserRegisterInput } from '../models';
import { UserRepository, Credentials } from '../repositories';
import { PasswordHasher } from '../services/hashPassword';
import { PasswordHasherBindings, ValidateRegisterInputBindings, UserServiceBindings, TokenServiceBindings } from '../keys';
import { ValidateRegisterInput } from '../services/validator';
import * as _ from "lodash";

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,

    @inject(ValidateRegisterInputBindings.VALIDATE_REFISTER_INPUT)
    public validateRegisterInput: ValidateRegisterInput,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,

    // @inject(TokenServiceBindings.TOKEN_SERVICE)
    // public jwtService: TokenService
  ) { }

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/x-www-form-urlencoded': { schema: { 'x-ts-type': 'object' } } },
      },
    },
  })
  async create(@requestBody() user: UserRegisterInput): Promise<User> {
    await this.validateRegisterInput.validate(user);

    const newUser = _.omit(user, ["password2"]);
    newUser.password = await this.passwordHasher.hashPassword(newUser.password);
    return await this.userRepository.create(newUser);
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/x-www-form-urlencoded': { schema: { 'x-ts-type': 'object' } } },
      },
    },
  })
  async login(@requestBody() credentials: Credentials): Promise<{ token: string }> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    // const token = await this.jwtService.generateToken(userProfile);

    return { token: "jsncjkfn" };
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return await this.userRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': User } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter<User>,
  ): Promise<User[]> {
    return await this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() user: User,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return await this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': User } } },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
