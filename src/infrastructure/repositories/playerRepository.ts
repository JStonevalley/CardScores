import Player from '../../domain/game/player/player'
import {PlayerModel, IPlayerModel} from './playerModel'
import {model} from 'mongoose'

class PlayerRepository {
  save(player: Player): Promise<Player> {
    const playerModel = new PlayerModel({
      id: player.id,
      userId: player.userId,
      name: player.name,
      rounds: player.rounds,
      date: player.date
    })
    return playerModel.save().then((p) => {
      return player
    }).catch(console.error)
  }

  fetch(id: string): Promise<Player> {
    return this.fetchMany([id]).then((players) => {
      return players.length === 1 ? players.pop() : null
    })
  }

  fetchMany(ids: string[]): Promise<Player[]> {
    if (!ids.length) {
      return Promise.resolve([])
    }
    return PlayerModel.aggregate()
      .match({id: {$in: ids}})
      .sort({date: -1})
      .group({_id: '$id', player: {$first: '$$ROOT'}})
      .then((playerModels: any[]) => {
      return playerModels.map((playerModel) => {
        playerModel = playerModel.player as IPlayerModel
        return new Player(playerModel.id, playerModel.userId, playerModel.name, playerModel.rounds, playerModel.date)
      })
    })
  }

  exists(id: string): Promise<Boolean> {
    return this.fetch(id).then((playerModel) => {
      return Boolean(playerModel)
    })
  }
}

export default PlayerRepository
