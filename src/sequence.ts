import { inject } from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
  HttpErrors
} from '@loopback/rest';
import { AuthorizatonBindings, AuthorizeFn } from './authorization';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    // @inject(AuthenticationBindings.AUTH_ACTION)
    // protected authenticateRequest: AuthenticateFn,
    // @inject(AuthorizatonBindings.USER_PERMISSIONS)
    // protected fetchUserPermissons: UserPermissionsFn,
    // @inject(AuthorizatonBindings.AUTHORIZE_ACTION)
    // protected checkAuthorization: AuthorizeFn,
  ) { }

  async handle(context: RequestContext) {
    try {
      const { request, response } = context;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
      // Do authentication of the user and fetch user permissions below
      // const authUser: AuthResponse = await this.authenticateRequest(request);
      // Parse and calculate user permissions based on role and user level
      // const permissions: PermissionKey[] = this.fetchUserPermissons(
      // authUser.permissions,
      // authUser.role.permissions,
      // );
      // This is main line added to sequence
      // where we are invoking the authorize action function to check for access
      // const isAccessAllowed: boolean = await this.checkAuthorization(
      //   permissions,
      // );
      // if (!isAccessAllowed) {
      //   throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      // }
      // const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
