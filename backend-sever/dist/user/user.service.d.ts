import { Model } from 'mongoose';
import { User } from './user.schema';
import { UpdateUserDto, UserDto } from './user.dto';
import { DocumentService } from 'src/document/document.service';
export declare class UserService {
    private readonly documentService;
    private readonly userModel;
    private readonly logger;
    constructor(documentService: DocumentService, userModel: Model<User>);
    mapClientIdToUserId(fullname: string, email: string, clientId: string): Promise<User>;
    getClientInfoByClientId(clientId: string): Promise<User | null>;
    createUser(userDto: UserDto): Promise<User>;
    getUserById(userId: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
    deleteUser(userId: string): Promise<void>;
    deleteAllUsers(): Promise<void>;
    getAllUsers(): Promise<User[]>;
    getSharedWithDocumentsByUserId(userId: string): Promise<any[]>;
}
