import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UpdateUserDto, UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { DocumentService } from 'src/document/document.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  
  constructor(
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async mapClientIdToUserId(
    fullname: string,
    email: string,
    clientId: string,
  ): Promise<User> {
    this.logger.log('Inside mapClientIdToUserId()');
    
    const fetchedUser = await this.getUserByEmail(email);
    
    if (!fetchedUser) {
      throw new NotFoundException('User not found');
    }

    const updateUserDto: UpdateUserDto = {
      clientId,
    };

    const mappedUser = await this.updateUser(
      fetchedUser._id.toString(), // Explicit conversion to string
      updateUserDto
    );
    
    this.logger.log(`Mapped user: ${JSON.stringify(mappedUser)}`);
    return mappedUser;
  }

  async getClientInfoByClientId(clientId: string): Promise<User | null> {
    const [user] = await this.userModel.find({ clientId }).exec();
    return user || null;
  }

  async createUser(userDto: UserDto): Promise<User> {
    const { fullname, email, password } = userDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      fullname,
      email,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateUserDto, {
        new: true,
      })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async deleteAllUsers(): Promise<void> {
    this.logger.log('Deleting all users');
    await this.userModel.deleteMany().exec();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getSharedWithDocumentsByUserId(userId: string): Promise<any[]> {
    this.logger.log(`Getting shared documents for user: ${userId}`);
    
    const user = await this.userModel
      .findById(userId)
      .populate('sharedWith', 'id')
      .exec();

    if (!user || !user.sharedWith) {
      return [];
    }

    const sharedWithDocumentIds: string[] = user.sharedWith.map((document) =>
      document._id.toString()
    );

    this.logger.log(`Shared document IDs: ${sharedWithDocumentIds}`);

    const documentPromises = sharedWithDocumentIds.map((documentId) =>
      this.documentService.getDocumentById(documentId)
    );

    return await Promise.all(documentPromises);
  }
}