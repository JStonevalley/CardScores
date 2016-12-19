import {Schema, Document, model} from "mongoose";
import User from '../../domain/users/user'
import Game from '../../domain/game/game'

interface IUserDataObject {
    id: string
    email: string
    name: string
    games: string[]
    date: Date
}

export interface IUserModel extends IUserDataObject, Document{};
var userSchema = new Schema({
    id: String,
    email: String,
    name: String,
    games: [String],
    date: Date
});

export const UserModel = model<IUserModel>("UserModel", userSchema)
