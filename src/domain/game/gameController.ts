import Game from './game'
import User from '../users/user'
import GameRepository from '../../infrastructure/repositories/gameRepository'
import * as userController from '../users/userController'

const gameRepository = new GameRepository()

export const createGame = (name: string, type: string, userEmails: string[], numRounds: number): Promise<Game> => {
  return userController.getUsersByEmail(userEmails).then((users: User[]) => {
    const game = Game.NewGame(name, type, users, numRounds)
    return gameRepository.save(game).then(() => game)
  })
}

export const registerScore = (gameId : string, playerId: string, round: number, score: number): Promise<Game> => {
  return gameRepository.fetch(gameId).then((game: Game) => {
    const next = game.addRoundScore(playerId, round, score)
    return gameRepository.save(next).then(() => next)
  })
}
