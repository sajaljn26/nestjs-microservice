import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";

export function mapRpcErrorToHttpError(err: any): never {
    const payload = err?.error ?? err;
    const code = payload?.code as string | undefined;
    const message = payload?.message ?? "Request Failed"
    if (code === 'BAD_REQUEST' || code === "Validation_error") {
        throw new BadRequestException(message)
    }

    if (code === 'UNAUTHORIZED') {
        throw new UnauthorizedException(message)
    }

    if (code === 'FORBIDDEN') {
        throw new ForbiddenException(message)
    }

    if (code === 'NOT_FOUND') {
        throw new NotFoundException(message)
    }

    if (code === 'INTERNAL') {
        throw new InternalServerErrorException(message)
    }

    throw new InternalServerErrorException(message)
}