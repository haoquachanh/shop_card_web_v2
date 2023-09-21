import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import 'dotenv/config';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers["auth"];
  let jwtPayload;
  if (!token) {
    return res.status(400).json({ error: "Missing JWT token" });
  }
  
  try {
    jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  // const { userId, username } = jwtPayload;
  // const newToken = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
  //   expiresIn: "1h"
  // });
  // res.setHeader("token", newToken);

  //Call the next middleware or controller
  next();
};
