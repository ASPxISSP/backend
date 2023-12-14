import { Puzzle } from '@prisma/client';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindManyQueryDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
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
