"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const member_service_1 = require("../member/member.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let UserService = class UserService {
    constructor(userRepository, memberService, jwtService) {
        this.userRepository = userRepository;
        this.memberService = memberService;
        this.jwtService = jwtService;
    }
    async findById(id) {
        const user = await this.userRepository.findOne({
            where: { id: Number(id) },
            relations: ['addresses']
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByUsername(username) {
        const user = await this.userRepository.findOne({
            where: { username }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with username ${username} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.userRepository.findOne({
            where: { email }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async register(registerDto) {
        const usernameExists = await this.userRepository.findOne({
            where: { username: registerDto.username }
        });
        if (usernameExists) {
            throw new common_1.ConflictException('Username already exists');
        }
        if (registerDto.email) {
            const emailExists = await this.userRepository.findOne({
                where: { email: registerDto.email }
            });
            if (emailExists) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        if (registerDto.phone) {
            const phoneExists = await this.userRepository.findOne({
                where: { phone: registerDto.phone }
            });
            if (phoneExists) {
                throw new common_1.ConflictException('Phone number already exists');
            }
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.userRepository.create(Object.assign(Object.assign({}, registerDto), { password: hashedPassword, isActive: true, registerIp: registerDto.ip, lastLoginIp: registerDto.ip, lastLoginTime: new Date() }));
        const savedUser = await this.userRepository.save(user);
        await this.memberService.updateUserMemberLevel(savedUser.id);
        delete savedUser.password;
        return savedUser;
    }
    async login(loginDto) {
        let user;
        if (loginDto.username) {
            user = await this.userRepository.findOne({
                where: { username: loginDto.username }
            });
        }
        else if (loginDto.email) {
            user = await this.userRepository.findOne({
                where: { email: loginDto.email }
            });
        }
        else if (loginDto.phone) {
            user = await this.userRepository.findOne({
                where: { phone: loginDto.phone }
            });
        }
        if (!user) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.BadRequestException('User account is disabled');
        }
        user.lastLoginTime = new Date();
        user.lastLoginIp = loginDto.ip;
        await this.userRepository.save(user);
        const payload = {
            sub: user.id,
            username: user.username,
            roles: user.roles || ['user']
        };
        delete user.password;
        return {
            user,
            token: this.jwtService.sign(payload)
        };
    }
    async updateProfile(userId, updateDto) {
        const user = await this.findById(userId);
        if (updateDto.email && updateDto.email !== user.email) {
            const emailExists = await this.userRepository.findOne({
                where: { email: updateDto.email }
            });
            if (emailExists && emailExists.id !== userId) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        if (updateDto.phone && updateDto.phone !== user.phone) {
            const phoneExists = await this.userRepository.findOne({
                where: { phone: updateDto.phone }
            });
            if (phoneExists && phoneExists.id !== userId) {
                throw new common_1.ConflictException('Phone number already in use');
            }
        }
        Object.assign(user, updateDto);
        const updatedUser = await this.userRepository.save(user);
        delete updatedUser.password;
        return updatedUser;
    }
    async changePassword(userId, changeDto) {
        const user = await this.userRepository.findOne({
            where: { id: Number(userId) }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const isCurrentPasswordValid = await bcrypt.compare(changeDto.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        user.password = await bcrypt.hash(changeDto.newPassword, 10);
        await this.userRepository.save(user);
        return true;
    }
    async getUserDashboard(userId) {
        const user = await this.findById(userId);
        const memberLevel = await this.memberService.getUserLevel(userId);
        const totalPoints = await this.memberService.getUserTotalPoints(userId);
        const { records: pointsHistory } = await this.memberService.getUserPointsHistory(userId, 1, 5);
        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar
            },
            membership: {
                level: memberLevel.name,
                points: totalPoints,
                discount: memberLevel.discountRate,
                nextLevel: memberLevel.level < 5 ? {
                    name: `Level ${memberLevel.level + 1}`,
                    pointsNeeded: 0
                } : null
            },
            pointsHistory
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        member_service_1.MemberService,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map