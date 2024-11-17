import { Router } from "express";
import { UsuariosManager } from "../dao/UsuariosManager.js";
import { generaHash, validaHash } from "../utils.js";
import { config } from "../config/config,js";
import { auth } from '../middleware/auth.js';
import passport from 'passport';
import { passportCall } from "../utils.js";
import jwt from "jsonwebtoken";

export const router=Router()

router.get("/error", 
    (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(401).json({error:`Error de autenticación.`})
})

router.post("/registro",
    passportCall("registro"),
     (req, res)=>{
        console.log("Usuario registrado:", req.user);
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({
            message: `Registro exitoso para ${req.user.nombre}`,
            usuario: req.user
        });

    }
)

router.post("/login", 
    passport.authenticate("login", {session: false, failureRedirect:"/api/sessions/error"}),
    (req, res)=>{
        const userPayload = {
            id: req.user._id,
            nombre: req.user.nombre,
            email: req.user.email,
            rol: req.user.rol,
        };
        let token=jwt.sign(req.user, config.SECRET, {expiresIn: 3600})
        res.cookie("tokenCookie", token, {httpOnly:true});
        res.cookie('cartId', req.user.cart, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({payload:`Login exitoso para ${req.user.nombre}`, usuarioLogueado:req.user, cart: req.user.cart});
    }
)

router.get("/logout",
    (req, res)=>{
        req.session.destroy(error=>{
        if(error){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`Error al efectuar el logout`})
        } else{
            res.clearCookie('tokenCookie');
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({
                payload:"Logout exitoso. Esperamos verlo de nuevo por aca"});
        }
    })
})

router.get(
    "/current",
    passportCall("current"),
    auth("admin"),
    (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ datosUsuarioLogueado: req.user });
    }
);
