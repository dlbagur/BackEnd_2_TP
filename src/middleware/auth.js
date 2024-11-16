import jwt from "jsonwebtoken"
import { config } from "../config/config,js";

export const auth=rol=>{

    return (req, res, next)=>{
        if(!req.user || !req.user?.rol) {
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`Sin autorización `})
        }

        if(req.user.rol!==rol){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`Sin autorización `})
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
        roles=roles.map(rol=>rol.toLowerCase())
        if(roles.includes("public")){
            return next()
        } 

        if(!req.user || !req.user?.rol){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`No autorizado - no hay rol`})
        }
        
        if(!roles.includes(req.user.rol.toLowerCase())){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`No autorizado - privilegios insuficientes`})
        }

        next()
    }
}