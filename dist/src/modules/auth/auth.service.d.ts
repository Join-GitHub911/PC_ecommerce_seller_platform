import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from '../user/dto/login.dto';
import { User } from '../user/entities/user.entity';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(loginDto: LoginDto): Promise<User>;
    login(user: User): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            username: string;
            role: any;
        };
    }>;
}
