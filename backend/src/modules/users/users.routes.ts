import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get('/reqres', usersController.getReqResUsers);
router.get('/reqres/:id', usersController.getReqResUserById);
router.post('/import/:id', usersController.importUser);
router.get('/saved', usersController.getSavedUsers);
router.get('/saved/:id', usersController.getSavedUserById);
router.delete('/saved/:id', usersController.deleteSavedUser);

export { router as usersRouter };