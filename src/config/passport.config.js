// Configuración de GitHub
// Callback: http://localhost:8080/api/sessions/callbackGithub
// Client ID: Iv23lissPluQN9F8e7EZ
// Client secret: b4e68fd8b704db3c39b0fa2943461ac879c1ae2e

import passport from "passport";
import passportJWT from "passport-jwt"
import local from "passport-local"
import { UsuariosManager } from "../DAO/usuariosMongoDAO.js";
import github from "passport-github2"
import { generaHash, validaHash } from "../utils.js";
import { config } from "./config.js";
import { cartsModelo } from '../DAO/models/cartsModel.js'

const buscarToken=req=>{
    let token=null
    if(req.cookies.tokenCookie){
        token = req.cookies.tokenCookie
    }
    return token
}

export const initPassport = () => {

    passport.use("registro",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, username, password, done) => {
                try {
                    const { nombre, apellido, email, edad, rol } = req.body;

                    if (!nombre || !apellido || !edad || !rol) {
                        return done(null, false, { message: "Todos los campos son obligatorios" });
                    }
                    if (isNaN(edad) || edad < 18) {
                        return done(null, false, { message: "Debes ser mayor de edad para registrarte" });
                    }

                    let existe = await UsuariosManager.getUserBy({ email:username});
                    if (existe) {
                        return done(null, false, { message: "El email ya está registrado" });
                    }

                    let carrito
                    try { 
                        carrito = await cartsModelo.create({ productos: [], usuario: username });
                    } catch (error) {
                        return done(null, false, { message: 'Error al crear el carrito: ' + error.message });
                    }

                    const passwordHash = generaHash(password);

                    const nuevoUsuario = await UsuariosManager.createUser({
                        nombre,
                        apellido,
                        email: username,
                        password: passwordHash,
                        edad,
                        rol,
                        cart: carrito._id
                    });

                    return done(null, nuevoUsuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use("login", 
        new local.Strategy(
            {
                usernameField:"email"
            },
            async(username, password, done)=>{
                try {
                    let usuario = await UsuariosManager.getUserBy({email:username})
                    if(!usuario){
                        return done(null, false, { message: "Debe ingresar los datos de acceso" });
                    }
                    if(!validaHash(password, usuario.password)){
                        return done(null, false, "Credenciales inválidas")
                    }
                    // delete usuario.password
                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use("current", 
        new passportJWT.Strategy(
            {
                secretOrKey: config.SECRET,
                jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([buscarToken])
            },
            async(usuario, done)=> {
                try {
                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.serializeUser((user, done)=>{
        return done(null, user)
    })

    passport.deserializeUser(async(user, done)=>{
        return done(null, user)
    })
}