import { INestApplication, ValidationPipe } from "@nestjs/common";
import { RpcAllExceptionFilter } from "./rpc-exception.filters";

export function applyToMicroserviceLayer(app: INestApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        })
    )
    app.useGlobalFilters(new RpcAllExceptionFilter());

}

