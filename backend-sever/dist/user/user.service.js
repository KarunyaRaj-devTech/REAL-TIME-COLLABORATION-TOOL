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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const document_service_1 = require("../document/document.service");
let UserService = UserService_1 = class UserService {
    constructor(documentService, userModel) {
        this.documentService = documentService;
        this.userModel = userModel;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async mapClientIdToUserId(fullname, email, clientId) {
        this.logger.log('Inside mapClientIdToUserId()');
        const fetchedUser = await this.getUserByEmail(email);
        if (!fetchedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const updateUserDto = {
            clientId,
        };
        const mappedUser = await this.updateUser(fetchedUser._id.toString(), updateUserDto);
        this.logger.log(`Mapped user: ${JSON.stringify(mappedUser)}`);
        return mappedUser;
    }
    async getClientInfoByClientId(clientId) {
        const [user] = await this.userModel.find({ clientId }).exec();
        return user || null;
    }
    async createUser(userDto) {
        const { fullname, email, password } = userDto;
        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
            fullname,
            email,
            password: hashedPassword,
        });
        return await newUser.save();
    }
    async getUserById(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async getUserByEmail(email) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUser(userId, updateUserDto) {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, updateUserDto, {
            new: true,
        })
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return updatedUser;
    }
    async deleteUser(userId) {
        const result = await this.userModel.deleteOne({ _id: userId }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async deleteAllUsers() {
        this.logger.log('Deleting all users');
        await this.userModel.deleteMany().exec();
    }
    async getAllUsers() {
        return this.userModel.find().exec();
    }
    async getSharedWithDocumentsByUserId(userId) {
        this.logger.log(`Getting shared documents for user: ${userId}`);
        const user = await this.userModel
            .findById(userId)
            .populate('sharedWith', 'id')
            .exec();
        if (!user || !user.sharedWith) {
            return [];
        }
        const sharedWithDocumentIds = user.sharedWith.map((document) => document._id.toString());
        this.logger.log(`Shared document IDs: ${sharedWithDocumentIds}`);
        const documentPromises = sharedWithDocumentIds.map((documentId) => this.documentService.getDocumentById(documentId));
        return await Promise.all(documentPromises);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => document_service_1.DocumentService))),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [document_service_1.DocumentService,
        mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map