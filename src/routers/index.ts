import express, { Router, Request, Response } from 'express';
import controller from '..controllers';

const router: Router = express.Router();

router.post('/register', controller.registerIdentity);

router.post('/login', controller.loginIdentity );

router.put('/edit/{id}', controller.editIdentity);

router.post('/createApiKey', controller.createApiKeyIdentity);

router.post('/verifyApiKey', controller.verifyApiKeyIdentity);

export default router;
