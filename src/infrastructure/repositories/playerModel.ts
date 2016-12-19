import {Schema, Document, model} from "mongoose";
import player from '../../domain/game/player/player'

interface IPlayerDataObject{
    id: string,
    userId: string
    name: string
    rounds: number[]
    date: Date
}

export interface IPlayerModel extends IPlayerDataObject, Document{};
const playerSchema = new Schema({
    id: String,
    userId: String,
    name: String,
    rounds: [Number],
    date: Date
});

export const PlayerModel = model<IPlayerModel>("PlayerModel", playerSchema)
