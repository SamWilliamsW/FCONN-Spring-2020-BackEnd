import express from 'express';
const router = express.Router();

import { signin, signup, businesssignup } from '../controllers/user.js';


router.post('/signin', signin);
router.post('/signup', signup);
router.post('/businesssignup', businesssignup);

export default router;