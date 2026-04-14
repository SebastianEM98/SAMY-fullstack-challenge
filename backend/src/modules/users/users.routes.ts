import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get('/reqres', usersController.getReqResUsers);
router.post('/import/:id', usersController.importUser);

export { router as usersRouter };