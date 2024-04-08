import express, { Router } from 'express';
import controller from '../controllers';
import { middleware } from '../middlewares';

const router: Router = express.Router();

// Public
router.post('/register', controller.registerIdentity);
router.post('/login', controller.loginIdentity);

router.use(middleware);

// Private
router.put('/edit/{id}', controller.editIdentity);
router.post('/createApiKey', controller.createApiKeyIdentity);
router.post('/verifyApiKey', controller.verifyApiKeyIdentity);

export default router;
