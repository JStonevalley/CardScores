import {Router, Request, Response, NextFunction} from 'express';
import Game from '../../domain/game/game'
import * as gameController from '../../domain/game/gameController'

export class GameRouter {
  router: Router
  constructor() {
    this.router = Router();
    this.init();
  }

  public registerScore(req: Request, res: Response, next: NextFunction) {
    const gameId: string = req.body.gameId as string
    const playerId: string = req.body.playerId as string
    const round: number = parseInt(req.body.round)
    const score: number = parseInt(req.body.score)
    gameController.registerScore(gameId, playerId, round, score).then((game: Game) => res.json(game))
  }

  public createGame(req: Request, res: Response, next: NextFunction) {
    const name: string = req.body.name as string
    const type: string = req.body.type as string
    const userEmails: string[] = req.body.userEmails as string[]
    const numberOfRounds: number = parseInt(req.body.numberOfRounds)
    console.log('createGame', typeof numberOfRounds)
    gameController.createGame(name, type, userEmails, numberOfRounds).then((game) => {
      res.status(201)
      res.json(game)
    }).catch((error) => {
      res.status(400).send({
        message: 'Could not create Game.',
        status: res.status
      })
    })
  }

  public fetchGame(req: Request, res: Response, next: NextFunction) {
    const gameId: string = req.params.name as string
    console.log(gameId)
    gameController.fetchGame(gameId).then((game) => {
      res.status(201)
      res.json(game)
    }).catch((error) => {
      res.status(400).send({
        message: 'Could not fetch Game.',
        status: res.status
      })
    })
  }

  init() {
    this.router.post('/registerScore', this.registerScore);
    this.router.post('/', this.createGame);
    this.router.get('/:gameId', this.fetchGame);
  }

}

const gameRoutes = new GameRouter();
gameRoutes.init();

export default gameRoutes.router;