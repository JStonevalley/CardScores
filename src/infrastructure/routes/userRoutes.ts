import {Router, Request, Response, NextFunction} from 'express';
import User from '../../domain/users/user'
import * as userController from '../../domain/users/userController'

export class UserRouter {
  router: Router
  constructor() {
    this.router = Router();
    this.init();
  }

  public getUser(req: Request, res: Response, next: NextFunction) {
    const email = req.params.email as string
    userController.getUserByEmail(email).then((user: User) => res.json(user))
  }

  public averageScore(req: Request, res: Response, next: NextFunction) {
    const email = req.params.email as string
    const type = req.params.type as string
    userController.getUserByEmail(email).then((user: User) => res.json(user.averageScore(type)))
  }

  public createUser(req: Request, res: Response, next: NextFunction) {
    const email: string = req.body.email as string
    const name: string = req.body.name as string
    userController.createUser(email, name).then(() => {
      res.status(201).send({
        message: 'Success.',
        status: res.status
      })
    }).catch(() => {
       res.status(400).send({
        message: 'Could not create user.',
        status: res.status
      })
    })
  }

  init() {
    this.router.get('/:email', this.getUser);
    this.router.get('/averageScore/:email/:type', this.averageScore);
    this.router.post('/', this.createUser);
  }

}

const userRoutes = new UserRouter();
userRoutes.init();

export default userRoutes.router;