import { Model } from 'mongoose';
import { DocumentDto, UpdateDocumentDto } from './document.dto';
import { IDocument } from './document.schema';
import { UserService } from 'src/user/user.service';
export declare class DocumentService {
    private readonly userService;
    private readonly documentModel;
    private readonly logger;
    constructor(userService: UserService, documentModel: Model<IDocument>);
    getAllDocuments(): Promise<IDocument[]>;
    getDocumentById(id: string): Promise<IDocument>;
    getDocumentsByUserId(userId: string): Promise<IDocument[]>;
    createDocument(documentDto: DocumentDto): Promise<IDocument>;
    hasAccess: (userId: string, document: IDocument) => boolean;
    updateDocument(id: string, updateDocumentDto: UpdateDocumentDto, userId: string): Promise<IDocument>;
    deleteDocument(id: string): Promise<void>;
    deleteAllDocuments(): Promise<void>;
    getCollaborators(documentId: string): Promise<any>;
    addCollaborator(collaboratorsData: any): Promise<any>;
}
