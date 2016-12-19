import User from '../../domain/users/user'
import Game from '../../domain/game/game'
import {UserModel, IUserModel} from './userModel'
import GameRepository from './gameRepository'

class UserRepository {
  gameRepository: GameRepository
  constructor() {
    this.gameRepository = new GameRepository()
  }

  save(user: User): Promise<User> {
    const games: Game[] = []
    user.games.forEach((game) => {
      games.push(game)
    })
    const userModel = new UserModel({
      id: user.id,
      email: user.email,
      name: user.name,
      games: games.map((game) => {
        return game.id
      }),
      date: user.date
    })
    return Promise.all(games.map(this.gameRepository.save)).then(() => {
      return userModel.save().then(() => user).catch(console.error)
    })
  }

  fetchByEmail(email: string): Promise<User> {
    return this.fetch(email, 'email')
  }

  fetchById(id: string): Promise<User> {
    return this.fetch(id, 'id')
  }

  fetch(ids: string, type: string = 'id'): Promise<User> {
    return this.fetchMany([ids], 'email').then((games) => {
      return games.length === 1 ? games.pop() : null
    })
  }

  fetchManyByEmail(emails: string[]): Promise<User[]> {
    return this.fetchMany(emails, 'email')
  }

  fetchManyById(ids: string[]): Promise<User[]> {
    return this.fetchMany(ids, 'id')
  }

  fetchMany(ids: string[], type: string = 'id'): Promise<User[]> {
    if (!ids.length) {
      return Promise.resolve([])
    }
    return UserModel.aggregate()
      .match(type === 'id' ? {id: {$in: ids}} : {email: {$in: ids}})
      .sort({date: -1})
      .group({_id: '$email', user: {$first: '$$ROOT'}})
      .then((userModels: any[]) => {
        return Promise.all(userModels.map((userModel) => {
          userModel = userModel.user as IUserModel
          return this.gameRepository.fetchMany(userModel.games).then((games) => {
            return new User(userModel.id, userModel.email, userModel.name, games.reduce((games, game) => games.set(game.id, game), new Map()), userModel.date)
          })
        }))
    })
  }

  exists(email: string): Promise<Boolean> {
    return this.fetch(email).then((userModel) => {
      return Boolean(userModel)
    })
  }
}

export default UserRepository
