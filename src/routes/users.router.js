import { Router } from "express";
import passport from 'passport';
import { passportCall } from "../utils.js";
import { UsersController } from "../controllers/UsersController.js";

export const router=Router()

router.get('/', UsersController.getUsers);
router.get('/error', UsersController.error);
router.post('/registro', passportCall('registro'), UsersController.registro);
router.post('/login', passportCall('login'), UsersController.login);
router.get('/current', passportCall('current'), UsersController.current);
router.get('/logout', UsersController.logout);
router.get('/github', passport.authenticate('github',
    {
            scope: ['user:email'],
            session: false
        }
    )
);
