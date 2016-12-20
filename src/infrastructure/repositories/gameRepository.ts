import Game, {GameType} from '../../domain/game/game'
import {GameModel, IGameModel} from './gameModel'
import PlayerRepository from './playerRepository'
import UserRepository from './userRepository'
import {model} from 'mongoose'

class GameRepository {
  playerRepository: PlayerRepository
  constructor() {
    this.playerRepository = new PlayerRepository()
  }
  save(game: Game): Promise<IGameModel> {
    const gameModel = new GameModel({
      id: game.id,
      type: game.type,
      name: game.name,
      players: game.players.map((player) => player.id),
      date: game.date
    })
    return Promise.all(game.players.map(this.playerRepository.save)).then(() => {
      return gameModel.save()
    }).catch(console.error)
  }

  fetch(id: string): Promise<Game> {
    return this.fetchMany([id]).then((games) => {
      return games.length === 1 ? games.pop() : null
    })
  }

  fetchMany(ids: string[]): Promise<Game[]> {
    if (!ids.length) {
      return Promise.resolve([])
    }
    return GameModel.aggregate()
      .match({id: {$in: ids}})
      .sort({date: -1})
      .group({_id: '$id', game: {$first: '$$ROOT'}})
      .then((gameModels: any[]) => {
        return Promise.all(gameModels.map((gameModel) => {
          gameModel = gameModel.game as IGameModel
          return this.playerRepository.fetchMany(gameModel.players).then((players) => {
            return new Game(gameModel.id, gameModel.type, gameModel.name, players, gameModel.date)
          })
        }))
    })
  }

  exists(id: string): Promise<Boolean> {
    return this.fetch(id).then((gameModel) => {
      return Boolean(gameModel)
    })
  }
}

export default GameRepository
