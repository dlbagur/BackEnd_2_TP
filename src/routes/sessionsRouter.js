import { Router } from "express";
import { UsuariosManager } from "../dao/UsuariosManager.js";
import crypto from "crypto";
import { config } from "../config/config,js";

export const router=Router()

router.post('/registro', async(req,res)=>{

    let {nombre, apellido, email, password, edad, cart, rol}=req.body
    if(!nombre || !apellido || !email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Complete los datos`})
    }
    if(edad<18){
        alert("Debe ser mayor de edad para registrarse en este sitio")
        return
    }
    try {
        let existe=await UsuariosManager.getBy({email});
        if(existe){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ya existe un usuario con email ${email}`})
        }

        password = crypto.createHmac("sha256", config.SECRET).update(password).digest("hex")
        let nuevoUsuario = await UsuariosManager.create({nombre, apellido, email, edad, password, cart, rol})

        res.setHeader('Content-Type','application/json');
        return res.status(201).json({mensaje: "Registro exitoso", nuevoUsuario});

    }catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }
})

router.post("/login", async(req, res)=>{
    let {email, password}=req.body
    if(!email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Complete los datos de ingreso.`})
    }

    try {
        password=crypto.createHmac("sha256", config.SECRET).update(password).digest("hex")
        let usuario=await UsuariosManager.getBy({email, password})
        if(!usuario){
            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`Credenciales inválidas`})
        }

        delete usuario.password
        req.session.usuario=usuario

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({mensaje:"Login exitoso ", usuarioLogueado: usuario});
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
    }
})

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