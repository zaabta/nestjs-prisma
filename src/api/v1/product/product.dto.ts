import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "@nestjs/class-validator";

export class ListProductDto {
    @IsOptional()
    @IsNumber()
    page

    @IsOptional()
    @IsNumber()
    limit

    @IsOptional()
    @IsString()
    name

    @IsOptional()
    @IsNumber()
    min_price

    @IsOptional()
    @IsNumber()
    max_price


    @IsOptional()
    @IsDate()
    createdAtFrom

    @IsOptional()
    @IsDate()
    createdAtTo
}

export class GetProductDto {
    @IsNotEmpty()
    @IsNumber()
    id
}