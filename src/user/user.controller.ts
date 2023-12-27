import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Put()
    update(@Req() req, @Body() body: UpdateUserDto) {
        return this.userService.updateUser(req.user.id, body);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete()
    delete(@Req() req) {
        return this.userService.deleteUser(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('/profile')
    profile(@Req() req) {
        return this.userService.profile(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('/puzzles')
    puzzleSolves(@Req() req, @Query('city') city?: string) {
        const cityParam = city ? decodeURIComponent(city) : undefined;
        return this.userService.puzzleSolves(req.user.id, cityParam);
    }
}
