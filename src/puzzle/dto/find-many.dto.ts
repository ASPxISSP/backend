import { Puzzle } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindManyQueryDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    size?: number;

    @IsOptional()
    @IsString()
    city?: string;
}

export interface FindManyResponseDto {
    data: Puzzle[];
    meta: {
        page: number;
        size: number;
        total: number;
        city?: string;
    };
}
