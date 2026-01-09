import { Get, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

}
