import { Request, Response } from 'express';
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import 'dotenv/config'

import { dataSource } from '../datasource';
import { User } from '../entities/User.entity';


class AuthController {
  async loginByAccount(req: Request, res: Response) {
    try {
      let { username, password } = req.body;
      if (!(username && password)) {
        res.status(400).send();
      }

      const userRepository = dataSource.getRepository(User);
      let user:User;
      try {
        user = await userRepository.findOneOrFail({ where: { username } });
      } catch (error) {
        res.status(401).send();
      }

       //Check if encrypted password match
      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        res.status(401).send();
        return;
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        err: 0,
        mes: "Login successful",
        token: token
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        err: -1,
        mes: "Iternal Error",
      });
    }
  }

  async changePassword(req: Request, res: Response) {
    const id = res.locals.jwtPayload.userId;

    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    const userRepository = dataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}

 

export default AuthController;
