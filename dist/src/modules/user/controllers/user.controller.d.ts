import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";
import { I18nContext } from "nestjs-i18n";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<User>;
    getProfile(user: User): Promise<User>;
    getUser(id: string, i18n: I18nContext): Promise<User>;
    verifyUser(user: User, body: {
        realName: string;
        idCard: string;
    }): Promise<any>;
    blacklistUser(userId: string): Promise<any>;
    removeFromBlacklist(userId: string): Promise<any>;
    updateTags(user: User, tags: string[]): Promise<any>;
}
