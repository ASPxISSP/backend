import { User } from '@prisma/client';

export class LeaderboardDto {
    id: string;
    name: string;
    score: number;
    imageId: number;

    constructor(partialUser: Partial<User>) {
        this.id = partialUser.id || '';
        this.name = partialUser.name || '';
        this.score = partialUser.score || 0;
        this.score = partialUser.imageId || 0;
    }
}
