import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requieredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])
        
        if (!requieredRoles) return true; 

        const { user } = context.switchToHttp().getRequest();

        if (!user) throw new ForbiddenException('Unauthenticated user')
        
        if (!requieredRoles.includes(user.role)) {
            throw new ForbiddenException('Your user does not have permission to access this path')
        } 

        return true;
    }
}