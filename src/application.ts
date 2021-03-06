import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MySequence } from './sequence';

import { PasswordHasherBindings, ValidateRegisterInputBindings, UserServiceBindings, TokenServiceBindings, TokenServiceConstants } from "./keys";
import { BcryptHasher } from "./services/hashPassword";
import { ValidateRegisterInput } from './services/validator';
import { MyUserService } from './services/userService';
import { JWTService } from './services/jwtService';
import { AuthorizationComponent } from "./authorization/component";

export class AllomedService extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(AuthorizationComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };


    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(ValidateRegisterInputBindings.VALIDATE_REGISTER_INPUT).toClass(ValidateRegisterInput);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);

    this.bind(TokenServiceBindings.SECRET_KEY).to(TokenServiceConstants.SECRET_KEY);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
  }
}
