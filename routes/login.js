import express from "express";
const loginRouter = express.Router();

import { addUser, login, getAllUsers } from '../controllers/login.js';

// Assign the controller methods to the routes
loginRouter.post('/', login);
loginRouter.post('/register', addUser);
loginRouter.get('/', getAllUsers);

export default loginRouter;
