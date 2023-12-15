import { Difficulty } from '@prisma/client';

export const puzzleScore = (difficulty: Difficulty) => {
    switch (difficulty) {
        case Difficulty.EASY:
            return 10;
        case Difficulty.MEDIUM:
            return 20;
        case Difficulty.HARD:
            return 30;
    }
};
