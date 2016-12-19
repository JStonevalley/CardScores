import Game from '../game/game'
import {v1 as UUID} from 'uuid'

export default class User {
  readonly id: string
  readonly email: string
  readonly name: string
  readonly games: Map<string, Game>
  readonly date: Date
  constructor (id: string, email: string, name: string, games: Map<string, Game> = new Map<string, Game>(), date: Date = new Date()) {
    this.id = id
    this.email = email
    this.name = name
    this.games = games
    this.date = date
  }

  addGame (game: Game): User {
    if (this.games.has(game.id)){
      return this
    }
    const gamesToUpdate = new Map(this.games)
    gamesToUpdate.set(game.id, game)
    return new User(this.id, this.email, this.name, gamesToUpdate)
  }

  totalScore () {
    let totalscore = 0
    this.games.forEach((game: Game) => totalscore += game.getPlayer(this.id).getTotalScore())
    return totalscore
  }

  static newUser(email: string, name: string) : User {
    return new User(UUID(), email, name)
  }
}
