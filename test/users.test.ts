import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import UserRepository from '../src/infrastructure/repositories/userRepository'
import * as gameController from '../src/domain/game/gameController'
import * as userController from '../src/domain/users/userController'
import {UserModel, IUserModel} from '../src/infrastructure/repositories/userModel'
import {GameModel, IGameModel} from '../src/infrastructure/repositories/gameModel'
import {PlayerModel, IPlayerModel} from '../src/infrastructure/repositories/playerModel'
import User from '../src/domain/users/user'
import Game from '../src/domain/game/game'

import app from '../src/App';

chai.use(chaiHttp)
const expect = chai.expect
const userRepository = new UserRepository()

describe('POST api/v1/users/test@testson.test/Test%20Testson', () => {

  beforeEach(() => {
    return UserModel.remove({}).then(() => {
      console.log('Cleared user collection')
      return Promise.resolve()
    })
  })
  it('responds with status 201', () => {
  return chai.request(app).post('/api/v1/users/').send({email: 'test@testson.test', name: 'Test Testson'})
      .then(res => {
        expect(res.status).to.equal(201);
      })
  })
})

describe('GET api/v1/users/test@testson.test', () => {
  beforeEach(() => {
    return UserModel.remove({}).then(() => {
      return userRepository.save(User.newUser('test@testson.test', 'Test Testsson'))
    })
  })
  
  it('responds with JSON test@testson.test', () => {
    return chai.request(app).get('/api/v1/users/test@testson.test')
      .then(res => {
        expect(res.status).to.equal(200)
        expect(res).to.be.json
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.all.keys([
          'id',
          'email',
          'name',
          'games',
          'date'
        ])
        expect(res.body.email).to.equal('test@testson.test')
        expect(res.body.name).to.equal('Test Testsson')
      })
  })
})

describe('GET api/v1/users/averageScore/test@testson.test/plump', () => {
  let currentGame: Game = null
  beforeEach(() => {
    return Promise.all([UserModel.remove({}), GameModel.remove({}), PlayerModel.remove({})]).then(() => {
      console.log('Cleared user and game collections.')
      return Promise.all([userRepository.save(User.newUser('test@testson.test', 'Test Testsson')), userRepository.save(User.newUser('test2@testson.test', 'Test2 Testsson'))])
    }).then((users) => {
      return gameController.createGame('TestPlump', 'plump', users.map((user) => user.email), 10)
    }).then((game) => {
      currentGame = game
      return game
    })
  })
  
  it('responds with JSON test@testson.test', () => {
    const player0 = currentGame.players[0]
    const player1 = currentGame.players[1]
    // Player 0 gets 16 points in first 3 rounds
    return gameController.registerScore(currentGame.id, player0.id, 1, 11).then((game) => {
      currentGame = game
    }).then(() => gameController.registerScore(currentGame.id, player0.id, 2, null)).then((game) => {
      currentGame = game
    }).then(() => gameController.registerScore(currentGame.id, player0.id, 3, 5)).then((game) => {
      currentGame = game
      // Player 1 gets 10 points in first 3 rounds
    }).then(() => gameController.registerScore(currentGame.id, player1.id, 1, null).then((game) => {
      currentGame = game
    })).then(() => gameController.registerScore(currentGame.id, player1.id, 2, 5).then((game) => {
      currentGame = game
    })).then(() => gameController.registerScore(currentGame.id, player1.id, 3, 5).then((game) => {
      currentGame = game
    })).then(() => {
      return Promise.all([userController.getUserById(player0.userId), userController.getUserById(player1.userId)])
    }).then((users) => {
      expect(users[0].averageScore('plump')).to.equal(16/10)
      expect(users[1].averageScore('plump')).to.equal(10/10)
    })
  })
})
