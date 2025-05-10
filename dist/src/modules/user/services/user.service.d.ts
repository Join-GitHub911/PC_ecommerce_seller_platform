import { Repository } from "typeorm";
import { User } from "@/entities/User";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { I18nService } from "nestjs-i18n";
export declare class UserService {
    private readonly userRepository;
    private readonly i18n;
    constructor(userRepository: Repository<User>, i18n: I18nService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findById(id: string): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    validatePassword(user: User, password: string): Promise<boolean>;
    getWelcomeMessage(username: string, lang?: string): Promise<string>;
    findByWechatOpenId(openid: string): Promise<User | null>;
    createByWechat(openid: string, wechatData: any): Promise<User>;
    verifyUser(userId: string, realName: string, idCard: string): Promise<any>;
    blacklistUser(userId: string): Promise<any>;
    removeFromBlacklist(userId: string): Promise<any>;
    updateTags(userId: string, tags: string[]): Promise<any>;
    updateProfile(userId: string, profile: any): Promise<any>;
}
