import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { MemberService } from '../member/member.service';
import { JwtService } from '@nestjs/jwt';
export declare class UserService {
    private userRepository;
    private memberService;
    private jwtService;
    constructor(userRepository: Repository<User>, memberService: MemberService, jwtService: JwtService);
    findById(id: number): Promise<User>;
    findByUsername(username: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    register(registerDto: any): Promise<User>;
    login(loginDto: any): Promise<{
        user: User;
        token: string;
    }>;
    updateProfile(userId: number, updateDto: any): Promise<User>;
    changePassword(userId: number, changeDto: any): Promise<boolean>;
    getUserDashboard(userId: number): Promise<any>;
}
