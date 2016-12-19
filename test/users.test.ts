import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import UserRepository from '../src/infrastructure/repositories/userRepository'
import {UserModel, IUserModel} from '../src/infrastructure/repositories/userModel'
import User from '../src/domain/users/user'

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
