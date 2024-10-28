import { Router } from "express";
import { UsuariosManager } from "../dao/UsuariosManager.js";
import { generaHash, validaHash } from "../utils.js";
import { config } from "../config/config,js";
import passport from 'passport';
import jwt from "jsonwebtoken";

export const router=Router()

router.get("/error", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(401).json({error:`Error de autenticación.`})
})

router.get("/github", 
    passport.authenticate("github", {})
)

router.get("/callbackGithub", 
   passport.authenticate("github", {failureRedirect: "/api/sessions/error"}), (req, res)=>{
        req.session.usuario=req.user
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Login exitoso con Github", usuarioLogueado: req.user});
})

router.post("/registro", 
    passport.authenticate("registro", {session: false, failureRedirect:"/api/sessions/error"}), 
    (req, res)=>{
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({payload:`Registro exitoso para ${req.user.nombre}`, usuario: req.user});
    }
)

router.post("/login", 
    passport.authenticate("login", {session: false, failureRedirect:"/api/sessions/error"}), 
    (req, res)=>{
        let token=jwt.sign(req.user, config.SECRET, {expiresIn:3600})
        res.cookie("tokenCookie", token)
        res.setHeader('Content-Type','application/json');
        res.status(201).json({
            payload:`Ingreso exitoso para ${req.user.nombre}`, 
            usuarioLogueado:req.user, token});
    }
)

router.get("/logout", (req, res)=>{
    let {web}=req.query
    req.session.destroy(error=>{
        if(error){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`Error al efectuar el logout`})
        }
        if(web){
            return res.redirect("/login?mensaje=Logout exitoso")
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({payload:"Logout exitoso. Esperamos verlo de nuevo por aca"});
        }
    })
})