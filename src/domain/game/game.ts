import Player from './player/player'
import User from '../users/user'
import {v1 as UUID} from 'uuid'

export type GameType = 'ginrummy' | 'plump'

export default class Game {
  readonly id: string
  readonly type: string
  readonly name: string
  readonly players: Player[]
  readonly date: Date
  constructor (id: string, type: string, name: string, players: Player[], date: Date) {
    type = type.toLowerCase()
    if (type !== 'ginRummy' && type !== 'plump'){
      throw new Error('GameType is invalid.')
    }
    this.id = id
    this.type = type
    this.name = name
    this.players = players
    this.date = date
  }

  addRoundScore (playerId: string, round: number, score: number): Game {
    const playersToUpdate = this.players.map((player: Player) => {
      if (player.id === playerId) {
        return player.setRoundScore(score, round)
      } else {
        return player
      }
    })
    return new Game(this.id, this.type, this.name, playersToUpdate, new Date())
  }

  getPlayer (playerId: string): Player {
    return this.players.find((player: Player) => {
      return player.id === playerId
    })
  }

  getPlayerUserId (userId: string): Player {
    return this.players.find((player: Player) => {
      return player.userId === userId
    })
  }

  static NewGame(name: string, type: string, users: User[], numRounds: number): Game {
    console.log('NewGame', typeof numRounds)
    const players = users.map((user) => {
      return Player.newPlayer(user.id, user.name, numRounds)
    })
    return new Game(UUID(), type, name, players, new Date())
  }
}
