import { Request, Response } from 'express';
import { IIdentity } from 'cesieats-service-types/src/identity';
import { Identity } from '../database';
import jwt from 'jsonwebtoken';

//Crée une identité et renvoie jwt
const registerIdentity = async (req: Request, res: Response) => {
  try {
    const identity: IIdentity = {
      email: req.body.email,
      password: req.body.password,
    };
    const result = await Identity.create(identity);

    console.log('identity: ', identity);
    console.log('result: ', result);

    const token = jwt.sign(identity, process.env.JWT_KEY!);

    res.status(200).json(token);
  } catch (error) {
    console.log('[IDENTITY-SERVICE] registerIdentity error: ', error);
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

//Connecte à une identité et renvoie jwt
const loginIdentity = async (req: Request, res: Response) => {
  try {
    const identity: IIdentity = {
      email: req.body.email,
      password: req.body.password,
    };
    const result = await Identity.findOne(identity);

    if (!result) {
      res.status(404).json({ message: 'email/password not found or incorrect' });
    }

    const token = jwt.sign(identity, process.env.JWT_KEY!);
    res.status(200).json(token);
  } catch (error) {
    console.log('[IDENTITY-SERVICE] loginIdentity error: ', error);
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

//Supprime une identité
const deleteIdentity = async (req: Request, res: Response) => {
  try {
    const result = await Identity.deleteOne({ email: res.locals.identity.email });

    if (!result) {
      res.status(404).json({ message: 'email not found' });
    }

    res.status(200).json('Account succesfully deleted!');
  } catch (error) {
    console.log('[IDENTITY-SERVICE] deleteIdentity error: ', error);
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

//Edite une identité
const editIdentity = async (req: Request, res: Response) => {
  try {
    await Identity.replaceOne({ email: res.locals.identity.email }, { password: req.body.newPassword });
    res.status(200).json('Account succesfully edited!');
  } catch (error) {
    console.log('[IDENTITY-SERVICE] editIdentity error: ', error);
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

//Crée et associe une clé Appi à une identité connectée
const createApiKeyIdentity = async (req: Request, res: Response) => {
  try {
    let apiKey = crypto.randomUUID();
    while ((await Identity.find({ apiKey: apiKey })) != null) {
      apiKey = crypto.randomUUID();
    }
    await Identity.replaceOne({ email: res.locals.identity.email }, { apiKey: apiKey });
    res.status(200).json(apiKey);
  } catch (error) {
    console.log('[IDENTITY-SERVICE] createApiKeyIdentity error: ', error);
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
};

//Vérifie la clé Api d'une identité
const verifyApiKeyIdentity = async (req: Request, res: Response) => {
  try {
    if (Identity.find({ apiKey: res.locals.identity.apiKey }) != null) {
      res.status(200).json();
    } else {
      res.status(401).json({ message: 'apiKey could not be verified' });
    }
  } catch (error) {
    console.log('[IDENTITY-SERVICE] verifyApiKeyIdentity error: ', error);
    res.status(400).json({ message: 'an unexpected error occurred' });
  }
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
