import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class FindOneDto {
    @IsInt()
    @Type(() => Number)
    id: number;
}
