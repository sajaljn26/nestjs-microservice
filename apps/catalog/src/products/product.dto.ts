import { IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { ProductStatus } from "./products.schema";

export class CreateProductDto {

    @IsString()
    name: string;


    @IsString()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsString()
    createdByClerkUserId: string;



}

export class GetProductByIdDto {
    @IsString()
    id: string

}