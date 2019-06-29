import { BindingKey } from '@loopback/context';
import { PasswordHasher } from "./services/hashPassword";
import { ValidateRegisterInput } from './services/validator';
import { User } from "./models";
import { Credentials } from "./repositories";
import { UserService, TokenService } from "@loopback/authentication";

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace ValidateRegisterInputBindings {
  export const VALIDATE_REFISTER_INPUT = BindingKey.create<ValidateRegisterInput>(
    'services.validator'
  );
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );
}

export namespace TokenServiceBindings {
  export const SECRET_KEY = BindingKey.create<string>(
    'authentication.jwt.secret.key'
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<number>(
    'authentication.jwt.expires.in'
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.hasher',
  );
}

export namespace TokenServiceConstants {
  export const SECRET_KEY = "abcxyz";
  export const TOKEN_EXPIRES_IN = 3600;
}
