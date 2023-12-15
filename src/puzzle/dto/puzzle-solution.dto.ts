import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export class PuzzleSolutionDto {
    @IsString()
    solution: string;

    @IsLatitude()
    latitude: number;

    @IsLongitude()
    longitude: number;
}
