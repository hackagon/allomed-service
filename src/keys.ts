import { BindingKey } from '@loopback/context';
import { PasswordHasher } from "./services/hashPassword";
import { ValidateRegisterInput } from './services/validator';

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace ValidateRegisterInputBindings {
  export const VALIDATE_REFISTER_INPUT = BindingKey.create<ValidateRegisterInput>(
    'services.validator'
  )
}
