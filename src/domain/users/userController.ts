import User from './user'
import UserRepository from '../../infrastructure/repositories/userRepository'

const userRepository = new UserRepository()

export const createUser = (email: string, name: string) : Promise<User> => {
  const user: User = User.newUser(email, name)
  return userRepository.save(user).then(() => user)
}

export const getUserByEmail = (email: string) : Promise<User> => {
  return userRepository.fetchByEmail(email)
}

export const getUsersByEmail = (emails: string[]) : Promise<User[]> => {
  return userRepository.fetchManyByEmail(emails)
}

export const getUserById = (id: string) : Promise<User> => {
  return userRepository.fetchById(id)
}

export const getUsersById = (ids: string[]) : Promise<User[]> => {
  return userRepository.fetchManyById(ids)
}

export const userExists = (email: string) : Promise<Boolean> => {
  return userRepository.exists(email)
}
