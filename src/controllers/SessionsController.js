import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import UsuariosDTO from '../DTO/UsuariosDTO.js';

export class SessionsController {

    static async registro(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ message: "Registro exitoso", nuevoUsuario: req.user });
    }

    static async error(req, res) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Error de autenticación.`})
    }

    static async login (req, res) {
        const userPayload = {
            id: req.user._id,
            first_name: req.user.first_name,
            email: req.user.email,
            role: req.user.role,
        };
        let token=jwt.sign(req.user, config.SECRET, {expiresIn: 3600})
        res.cookie("tokenCookie", token, {httpOnly:true});
        res.cookie('cartId', req.user.cart, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({payload:`Login exitoso para ${req.user.first_name}`, usuarioLogueado:req.user, cart: req.user.cart});
    }


    static async logout (req, res) {
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
    }

    static async current (req, res) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ datosUsuarioLogueado: req.user });
    }

}