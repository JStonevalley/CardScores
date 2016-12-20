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

  totalScore (type: string) {
    let totalscore = 0
    this.games.forEach((game: Game) => totalscore += game.type === type ? game.getPlayer(this.id).getTotalScore() : 0)
    return totalscore
  }

  averageScore (type: string) {
    let totalscore = 0
    let numberOfRounds = 0
    this.games.forEach((game: Game) => {
      console.log(game.getPlayerUserId(this.id).rounds)
      numberOfRounds += game.type === type ? game.getPlayerUserId(this.id).rounds.length : 0
      totalscore += game.type === type ? game.getPlayerUserId(this.id).getTotalScore() : 0
      console.log(totalscore, numberOfRounds)
    })
    return totalscore/numberOfRounds
  }

  static newUser(email: string, name: string) : User {
    return new User(UUID(), email, name)
  }
}
