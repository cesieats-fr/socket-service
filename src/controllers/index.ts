import { Request, Response } from 'express';
import { IIdentity } from 'cesieats-service-types/src/identity';
import { Identity } from '../database';
import jwt from 'jsonwebtoken';

const registerIdentity = async (req: Request, res: Response) => {
  try {
    const identity: IIdentity = {
      email: req.body.email,
      password: req.body.password,
    };
    const result = await Identity.create(identity);

    console.log('identity: ', identity);
    console.log('result: ', result);

    const token = jwt.sign(identity, process.env.JWT_SECRET!);

    res.status(200).json(token);
  } catch (error) {
    console.log('[IDENTITY-SERVICE] registerIdentity error: ', error);
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

const loginIdentity = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello, world!' });
};

const deleteIdentity = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello, world!' });
};

const editIdentity = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello, world!' });
};

const createApiKeyIdentity = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello, world!' });
};

const verifyApiKeyIdentity = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello, world!' });
};

const controller = {
  registerIdentity,
  loginIdentity,
  deleteIdentity,
  editIdentity,
  createApiKeyIdentity,
  verifyApiKeyIdentity,
};

export default controller;
