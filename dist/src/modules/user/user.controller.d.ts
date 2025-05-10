import { UserService } from './user.service';
import { User } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(user: User): Promise<User>;
    findAll(): Promise<any>;
}
