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
    const round: number = req.body.round as number
    const score: number = req.body.score as number
    gameController.registerScore(gameId, playerId, round, score).then((game: Game) => res.json(game))
  }

  public createGame(req: Request, res: Response, next: NextFunction) {
    const name: string = req.body.name as string
    const type: string = req.body.type as string
    const userEmails: string[] = req.body.userEmails as string[]
    const numberOfRounds: number = req.body.numberOfRounds as number
    gameController.createGame(name, type, userEmails, numberOfRounds).then((game) => {
      res.status(201)
      res.json(game)
    }).catch((error) => {
      res.status(400).send({
        message: 'Could not create user.',
        status: res.status
      })
    })
  }

  init() {
    this.router.post('/registerScore', this.registerScore);
    this.router.post('/', this.createGame);
  }

}

const gameRoutes = new GameRouter();
gameRoutes.init();

export default gameRoutes.router;