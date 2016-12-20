import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import UserRepository from '../src/infrastructure/repositories/userRepository'
import * as gameController from '../src/domain/game/gameController'
import {UserModel, IUserModel} from '../src/infrastructure/repositories/userModel'
import {GameModel, IGameModel} from '../src/infrastructure/repositories/gameModel'
import {PlayerModel, IPlayerModel} from '../src/infrastructure/repositories/playerModel'
import User from '../src/domain/users/user'
import Game from '../src/domain/game/game'
import * as mongoose from 'mongoose';
// Should be done better with async handling and should not rely on file order :)
mongoose.connect("mongodb://localhost/cardscores");
(mongoose as any).Promise = global.Promise

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;
const userRepository = new UserRepository()

// describe('POST api/v1/games/', () => {

//   beforeEach(() => {
//     return Promise.all([UserModel.remove({}), GameModel.remove({}), PlayerModel.remove({})]).then(() => {
//       console.log('Cleared user and game collections.')
//       return Promise.all([userRepository.save(User.newUser('test@testson.test', 'Test Testsson')), userRepository.save(User.newUser('test2@testson.test', 'Test2 Testsson'))])
//     })
//   })

//   it('responds with status 201', () => {
//     return chai.request(app).post('/api/v1/games/').send({
//       name: 'TestPlump',
//       type: 'plump',
//       userEmails: ['test@testson.test', 'test2@testson.test'],
//       numberOfRounds: 10
//     }).then(res => {
//       expect(res.status).to.equal(201)
//       expect(res).to.be.json
//       expect(res.body).to.be.an('object')
//       expect(res.body).to.have.all.keys([
//         'id',
//         'name',
//         'type',
//         'players',
//         'date'
//       ])
//       expect(res.body.name).to.equal('TestPlump')
//       expect(res.body.players.length).to.equal(2)
//     })
//   })
// })

// describe('POST api/v1/games/registerScore', () => {
//   let currentGame: Game = null
//   beforeEach(() => {
//     return Promise.all([UserModel.remove({}), GameModel.remove({}), PlayerModel.remove({})]).then(() => {
//       console.log('Cleared user and game collections.')
//       return Promise.all([userRepository.save(User.newUser('test@testson.test', 'Test Testsson')), userRepository.save(User.newUser('test2@testson.test', 'Test2 Testsson'))])
//     }).then((users) => {
//       return gameController.createGame('TestPlump', 'plump', users.map((user) => user.email), 10)
//     }).then((game) => {
//       currentGame = game
//       return game
//     })
//   })

//   it('register first score in game', () => {
//     return chai.request(app).post('/api/v1/games/registerScore').send({
//       gameId: currentGame.id,
//       playerId: currentGame.players[0].id,
//       round: 1,
//       score: 11
//     }).then(res => {
//       expect(res.status).to.equal(200)
//       expect(res).to.be.json
//       expect(res.body).to.be.an('object')
//       expect(res.body).to.have.all.keys([
//         'id',
//         'name',
//         'type',
//         'players',
//         'date'
//       ])
//       expect(res.body.name).to.equal('TestPlump')
//       expect(res.body.players[0].rounds[0] || res.body.players[1].rounds[0]).to.equal(11)
//     })
//   })

//   it('responds with correct score diff', () => {
//     // Player 0 gets 16 points in first 3 rounds
//     gameController.registerScore(currentGame.id, currentGame.players[0].id, 1, 11).then((game) => {
//       currentGame = game
//     }).then(() => gameController.registerScore(currentGame.id, currentGame.players[0].id, 2, null)).then((game) => {
//       currentGame = game
//     }).then(() => gameController.registerScore(currentGame.id, currentGame.players[0].id, 3, 5)).then((game) => {
//       currentGame = game
//       // Player 1 gets 10 points in first 3 rounds
//     }).then(() => gameController.registerScore(currentGame.id, currentGame.players[0].id, 1, null).then((game) => {
//       currentGame = game
//     })).then(() => gameController.registerScore(currentGame.id, currentGame.players[0].id, 1, 5).then((game) => {
//       currentGame = game
//     })).then(() => gameController.registerScore(currentGame.id, currentGame.players[0].id, 1, 5).then((game) => {
//       currentGame = game
//     })).then(() => {
//       expect(Math.abs(currentGame.players[0].getTotalScore() - currentGame.players[0].getTotalScore())).to.equal(6)
//     })
//   })
// })