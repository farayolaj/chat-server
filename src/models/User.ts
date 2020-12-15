import { Schema, SchemaDefinition, model, PassportLocalDocument, PassportLocalModel, PassportLocalSchema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const schema: SchemaDefinition = {
  displayname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  unreadMessages: [{
    message: {
      from: String,
      to: String,
      data: String,
      timestamp: Number
    }
  }],
  lastSeen: Number
};

const userSchema: PassportLocalSchema = new Schema(schema);

userSchema.plugin(passportLocalMongoose);

export const User = model<UserDoc, UserModel>('User', userSchema);

export interface UserDoc extends PassportLocalDocument {
  displayname: string;
  username: string;
  unreadMessages?: {
    from: string,
    to: string,
    data: string,
    timestamp: number
  }[];
  lastSeen: number
}

export type UserModel = PassportLocalModel<UserDoc>;