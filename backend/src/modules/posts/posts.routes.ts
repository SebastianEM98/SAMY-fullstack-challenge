import { Router } from 'express';
import { postsController } from './posts.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.post('/', postsController.create);

export { router as postsRouter };