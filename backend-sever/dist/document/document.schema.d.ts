import * as mongoose from 'mongoose';
export interface IDocument extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    title: string;
    content: string;
    collaborators: [mongoose.Schema.Types.ObjectId];
}
export declare const DocumentSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    userId: mongoose.Types.ObjectId;
    title: string;
    content: string;
    collaborators: mongoose.Types.ObjectId[];
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    title: string;
    content: string;
    collaborators: mongoose.Types.ObjectId[];
}>, {}> & mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    title: string;
    content: string;
    collaborators: mongoose.Types.ObjectId[];
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const DocumentModel: mongoose.Model<IDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocument, {}> & IDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
