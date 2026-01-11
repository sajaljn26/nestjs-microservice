import { Module } from "@nestjs/common";
import { UserModule } from "../users/user.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth-guard";
import { AuthService } from "./auth.service";
import { UserSchema } from "../users/user.schema";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        UserModule
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ],
    exports: [
        AuthService
    ]

})

export class AuthModule { }