import express from 'express';
import { createToken } from '../controllers/authControllers.js';
const router = express.Router();

router.post('/', createToken);

export default router;