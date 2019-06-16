import { DefaultCrudRepository } from '@loopback/repository';
import { User, UserRelations } from '../models';
import { MongodbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  password2: string;
  isActive?: boolean;
}

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(User, dataSource);
  }
}
