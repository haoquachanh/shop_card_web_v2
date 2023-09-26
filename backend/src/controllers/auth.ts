import { Request, Response } from 'express';
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import 'dotenv/config'

import { dataSource } from '../datasource';
import { User } from '../entities/User';


class AuthController {
  async loginByAccount(req: Request, res: Response) {
    try {
      let { email, password } = req.body;
      if (!(email && password)) {
        res.status(400).json({
          err:1,
          mes: "Missing password or email"
        });
      }

      const userRepository = dataSource.getRepository(User);
      let user:User;
      user = await userRepository.findOne({ where: { email } });
      if (!user) return res.status(404).json({
        err: 1,
        mes: "User not found"
      })

       //Check if encrypted password match
      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        res.status(401).json({
          err:1,
          mes: "Invalid password"
        });
        return;
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email , fullname: user.fullname},
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
    userRepository.save(user);

    res.status(204).send();
  };
}

 

export default AuthController;
