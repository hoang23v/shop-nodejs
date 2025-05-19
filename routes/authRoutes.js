import express from 'express';
import { register, login, showLoginForm, showRegisterForm } from '../controllers/authController.js';

const router = express.Router();

router.get('/register', showRegisterForm);
router.post('/register', register);

router.get('/login', showLoginForm);
router.post('/login', login);

export default router;
