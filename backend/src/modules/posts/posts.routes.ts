import { Router } from 'express';
import { postsController } from './posts.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.post('/', postsController.create);
router.get('/', postsController.getAll);
router.get('/:id', postsController.getById);

export { router as postsRouter };