import { Router } from "express";
import { usuariosMongoDAO } from "../DAO/usuariosMongoDAO.js";
import { generaHash, validaHash } from "../utils.js";
import { config } from "../config/config.js";
import { auth } from '../middleware/auth.js';
import passport from 'passport';
import { passportCall } from "../utils.js";
import jwt from "jsonwebtoken";
import { SessionsController } from "../controllers/SessionsController.js";

export const router=Router()

router.get('/error', SessionsController.error);
router.post('/registro', passportCall('registro'), SessionsController.registro);
router.post('/login', passportCall('login'), SessionsController.login);
router.get('/current', passportCall('current'), SessionsController.current);
router.get('/logout', SessionsController.logout);
router.get('/github', passport.authenticate('github',
    {
            scope: ['user:email'],
            session: false
        }
    )
);
