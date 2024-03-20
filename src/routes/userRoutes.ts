import express from 'express';
import { viewAvailableItems, bookItems } from '../controller/userController';

const router = express.Router();

router.get('/grocery', viewAvailableItems);
router.post('/order', bookItems);

export default router;
