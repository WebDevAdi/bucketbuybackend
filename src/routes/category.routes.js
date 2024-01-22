import express from 'express';
import categories from '../controllers/category.controller.js';

const router = express.Router();

router.get('/').get(categories)

export default router;