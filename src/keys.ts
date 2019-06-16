import { BindingKey } from '@loopback/context';
import { PasswordHasher } from "./decorators/hashPassword";

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}
