import { Injectable } from "@nestjs/common";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { UserContext } from "./auth.types";

@Injectable()
export class AuthService {
    private readonly clerk = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    })
    private jwtVerifyOptions(): Record<string, any> {
        return {
            secretKey: process.env.CLERK_SECRET_KEY,

        }
    }

    async verifyAndBuildContext(token: string): Promise<UserContext> {
        try {
            const verified: any = await verifyToken(token, this.jwtVerifyOptions())

            const payload = verified?.payload ?? verified;

            //clerk user id -> payload.sub
            const clerkUserId = payload?.sub ?? payload?.userId;

            if (!clerkUserId) {
                throw new Error("Invalid token");

            }

            const role: 'user' | 'admin' = payload?.role === 'admin' ? 'admin' : 'user';
            const emailFromToken = payload?.email ??
                payload?.email_address ?? payload?.username ?? "";
            const nameFromToken = payload?.name ?? payload?.full_name ?? "";

            if (emailFromToken && nameFromToken) {
                return {
                    clerkUserId,
                    email: emailFromToken,
                    name: nameFromToken,
                    role,
                    isAdmin: role === 'admin'
                };

            }
            const user = await this.clerk.users.getUser(clerkUserId);

            const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress ??
                user.emailAddresses[0].emailAddress ?? '';

            const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                user.username || primaryEmail || clerkUserId;


            return {
                clerkUserId,
                email: emailFromToken || primaryEmail,
                name: nameFromToken || fullName,
                role,
                isAdmin: role === 'admin',
            }
        } catch (err) {
            throw new Error("Invalid token");
        }
    }
}



