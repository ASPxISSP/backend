import { User } from '@prisma/client';

export class LeaderboardDto {
    id: string;
    name: string;
    score: number;

    constructor(partialUser: Partial<User>) {
        this.id = ''; // Initialize or handle ID as required
        this.name = partialUser.name || ''; // Assuming 'name' is a property in your User model
        this.score = 0; // Initialize score as needed
    }
}
