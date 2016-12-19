import {Schema, Document, model} from "mongoose";
import Game from '../../domain/game/game'

interface IGameDataObject{
    id: string
    type: string
    name: string
    players: string[]
    date: Date
}

export interface IGameModel extends IGameDataObject, Document{};
const gameSchema = new Schema({
    id: String,
    type: String,
    name: String,
    players: [String],
    date: Date
});

export const GameModel = model<IGameModel>("GameModel", gameSchema)
