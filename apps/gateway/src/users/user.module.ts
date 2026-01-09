import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { UserService } from "./user.services";

@Module({
    imports: [
        // registers the User model for dependency injection 

        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }
        ])
    ],
    providers: [
        UserService
    ],
    exports: [UserService]
})

export class UserModule { }
