import { User } from '../models/User';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const createUser: RequestHandler = async (req, res, next) => {
  const { displayname, username, password } = req.body;

  const user = new User({ displayname, username });

  try {
    await user.setPassword(password);
    await user.save();
  } catch (err) {
    next(createHttpError(500, err));
  }

  res.sendStatus(201);
};