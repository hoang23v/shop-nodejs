import express from 'express';
import { register, login, showLoginForm, showRegisterForm, logout} from '../controllers/authController.js';

const router = express.Router();

router.get('/register', showRegisterForm);
router.post('/register', register);

router.get('/login', showLoginForm);
router.post('/login', login);
router.post('/logout', logout);
router.get('/logout', logout);
export default router;
