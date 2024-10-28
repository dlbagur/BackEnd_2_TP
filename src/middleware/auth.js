import jwt from "jsonwebtoken"
import { config } from "../config/config,js";

export const auth=(req, res, next)=>{
    if(!req.cookies.tokenCookie){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Acceso no autorizado - no llega Token`})
        }

    let token = req.cookies.tokenCookie

    try {
        req.user = jwt.verify(token, config.SECRET)
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Unauthorized`, detalle:error.message})
    }

    next()
}