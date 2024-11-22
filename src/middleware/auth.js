import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

export const auth=role=>{

    return (req, res, next)=>{
        if(!req.user || !req.user?.role) {
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`Sin autorización.`})
        }

        if(req.user.role!==role){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`Sin autorización para acceder.`})
        }
        next()
    }
}

export const auth2=(roles=[])=>{
    return (req, res, next)=>{
        if(!Array.isArray(roles)){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`Error en los permisos de la ruta`})
        }
        roles=roles.map(role=>role.toLowerCase())
        if(roles.includes("public")){
            return next()
        } 

        if(!req.user || !req.user?.role){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`No autorizado - no hay rol`})
        }
        
        if(!roles.includes(req.user.role.toLowerCase())){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`No autorizado - privilegios insuficientes`})
        }

        next()
    }
}