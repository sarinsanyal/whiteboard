import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser {
    nickname: string;
    sessionId: string;
    admin: boolean;
}

export interface IRoom extends Document {
    roomId: string;
    users: IUser[];
    createdTime: Date;
}

const UserSchema: Schema = new Schema({
    nickname: {
        type: String,
        required: true, 
        trim: true,
    },
    sessionId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    admin: {
        type: Boolean,
        required: true,
    },
});

const RoomSchema: Schema = new Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    users: {
        type: [UserSchema], // users array 
        default: [],
    },
    createdTime: {
        type: Date,
        default: Date.now,
    },
});

export const Room: Model<IRoom> =
    mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
