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
const User_1 = require("@/entities/User");
const bcrypt = require("bcrypt");
const nestjs_i18n_1 = require("nestjs-i18n");
let UserService = class UserService {
    constructor(userRepository, i18n) {
        this.userRepository = userRepository;
        this.i18n = i18n;
    }
    async create(createUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: [
                { username: createUserDto.username },
                { email: createUserDto.email },
            ],
        });
        if (existingUser) {
            throw new common_1.ConflictException("用户名或邮箱已存在");
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create(Object.assign(Object.assign({}, createUserDto), { password: hashedPassword }));
        return this.userRepository.save(user);
    }
    async findById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["addresses"],
        });
        if (!user) {
            throw new common_1.NotFoundException("用户不存在");
        }
        return user;
    }
    async findByUsername(username) {
        return this.userRepository.findOne({
            where: { username },
        });
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }
    async validatePassword(user, password) {
        return bcrypt.compare(password, user.password);
    }
    async getWelcomeMessage(username, lang = "zh") {
        return this.i18n.translate("USER.WELCOME", { lang, args: { username } });
    }
    async findByWechatOpenId(openid) {
        return this.userRepository.findOne({ where: { wechatOpenId: openid } });
    }
    async createByWechat(openid, wechatData) {
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        const user = this.userRepository.create({
            username: `wx_${openid.slice(-8)}`,
            wechatOpenId: openid,
            password: hashedPassword,
            email: `${openid}@wechat.user`,
        });
        return this.userRepository.save(user);
    }
    async verifyUser(userId, realName, idCard) {
        const user = await this.findById(userId);
        user.isVerified = true;
        user.realName = realName;
        user.idCard = idCard;
        return this.userRepository.save(user);
    }
    async blacklistUser(userId) {
        const user = await this.findById(userId);
        user.isBlacklisted = true;
        return this.userRepository.save(user);
    }
    async removeFromBlacklist(userId) {
        const user = await this.findById(userId);
        user.isBlacklisted = false;
        return this.userRepository.save(user);
    }
    async updateTags(userId, tags) {
        const user = await this.findById(userId);
        user.tags = tags;
        return this.userRepository.save(user);
    }
    async updateProfile(userId, profile) {
        const user = await this.findById(userId);
        user.profile = profile;
        return this.userRepository.save(user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        nestjs_i18n_1.I18nService])
], UserService);
//# sourceMappingURL=user.service.js.map