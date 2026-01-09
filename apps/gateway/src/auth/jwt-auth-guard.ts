import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service";
import { UserService } from "../users/user.services";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { REQUIRED_ROLE_KEY } from "./admin.decorator";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // STEP 1: Check if route is marked @Public() - skip auth if so
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (isPublic) {
            return true; // Anyone can access public routes
        }

        // STEP 2: Extract the Authorization header
        const request = context.switchToHttp().getRequest() as any;
        const authorization = request.headers.authorization;

        if (!authorization || typeof authorization !== 'string') {
            throw new UnauthorizedException('Missing authorization header');
        }

        // STEP 3: Extract Bearer token
        const token = authorization.startsWith('Bearer ')
            ? authorization.slice('Bearer '.length).trim()
            : '';

        if (!token) {
            throw new UnauthorizedException('Invalid authorization header');
        }

        // STEP 4: Verify token with Clerk and get user identity
        const identifiedUser = await this.authService.verifyAndBuildContext(token);

        // STEP 5: Upsert user in database (create if first login, update lastSeenAt)
        const dbUser = await this.userService.upsertAuthUser({
            clerkUserId: identifiedUser.clerkUserId,
            email: identifiedUser.email,
            name: identifiedUser.name,
        });

        // STEP 6: Build final user object with role from database
        const user = {
            ...identifiedUser,
            role: dbUser?.role ?? 'user',
            isAdmin: dbUser?.role === 'admin',
        };

        // STEP 7: Attach user to request so controllers can access via @CurrentUser()
        request.user = user;

        // STEP 8: Check if route requires admin role
        const requiredRole = this.reflector.getAllAndOverride<string>(REQUIRED_ROLE_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (requiredRole === 'admin' && user.role !== 'admin') {
            throw new UnauthorizedException('Admin access required');
        }

        return true;
    }
}