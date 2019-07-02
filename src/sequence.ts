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
import { AuthorizatonBindings, AuthorizeFn, UserPermissionsFn, PermissionKey, AuthorizeErrorKeys } from './authorization';
import {
  AuthenticationBindings,
  AuthenticateFn,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthorizatonBindings.AUTHORIZE_ACTION)
    protected authorizeRequest: AuthorizeFn,
    @inject(AuthorizatonBindings.USER_PERMISSIONS)
    protected fetchUserPermissons: UserPermissionsFn,
    @inject(AuthorizatonBindings.AUTHORIZE_ACTION)
    protected checkAuthorization: AuthorizeFn,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn
  ) { }

  async handle(context: RequestContext) {
    try {
      const { request, response } = context;
      const test = await this.authenticateRequest(request);
      console.log("test", test);
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);

      // const authUser: any = await this.authorizeRequest(request);
      // Parse and calculate user permissions based on role and user level
      // const permissions: PermissionKey[] = this.fetchUserPermissons(
      //   authUser.permissions,
      //   authUser.role.permissions,
      // );
      // This is main line added to sequence
      // where we are invoking the authorize action function to check for access
      // const isAccessAllowed: boolean = await this.checkAuthorization(
      //   permissions,
      // );
      // if (!isAccessAllowed) {
      //   throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      // }
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, { statusCode: 401 /* Unauthorized */ });
      }
      this.reject(context, err);
    }
  }
}
