import mongoose, { Schema, Document } from 'mongoose';
import { IDocument } from 'src/document/document.schema';
export interface User extends Document {
    fullname: string;
    email: string;
    password: string;
    documents: [IDocument];
    clientId: string;
    sharedWith: [IDocument];
}
export declare const UserSchema: Schema<User>;
export declare const UserModel: mongoose.Model<User, {}, {}, {}, mongoose.Document<unknown, {}, User, {}> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
