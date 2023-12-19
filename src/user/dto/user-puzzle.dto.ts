import { Puzzle } from '@prisma/client';

export interface UserPuzzleDto extends Puzzle {
    isUnlocked: boolean;
}
