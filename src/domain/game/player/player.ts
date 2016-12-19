import {v1 as UUID} from 'uuid'
export default class Player {
  readonly id: string
  readonly userId: string
  readonly name: string
  readonly rounds: number[]
  readonly date: Date
  constructor (id: string, userId: string, name: string, rounds: number[], date: Date = new Date()) {
    this.id = id
    this.userId = userId
    this.name = name
    this.rounds = rounds
    this.date = date
  }

  public getTotalScore (): number {
    return this.rounds.reduce((previous, current) => {
      return current ? previous + current : previous
    })
  }

  setRoundScore (score: number, round: number) {
    const roundsToUpdate = this.rounds.slice()
    roundsToUpdate[round - 1] = score
    return new Player(this.id, this.userId, this.name, roundsToUpdate)
  }

  static newPlayer (userId: string, name: string, numRounds: number) : Player {
    return new Player(UUID(), userId, name, new Array<number>(numRounds).fill(0))
  }
}
