import passport from "passport";
import local from "passport-local"
import { UsuariosManager } from "../dao/UsuariosManager.js";
import { generaHash, validaHash } from "../utils.js";

export const initPassport = () => {
    passport.use("registro",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, username, password, done) => {
                try {
                    const { nombre, apellido, edad, rol } = req.body;

                    if (!nombre || !apellido || !edad || !rol) {
                        return done(null, false, { message: "Todos los campos son obligatorios" });
                    }
                    if (isNaN(edad) || edad < 18) {
                        return done(null, false, { message: "Debes ser mayor de edad para registrarte" });
                    }
                    const existe = await UsuariosManager.getBy({ email: username });
                    if (existe) {
                        return done(null, false, { message: "El email ya está registrado" });
                    }

                    const passwordHash = generaHash(password);

                    const nuevoUsuario = await UsuariosManager.create({
                        nombre,
                        apellido,
                        email: username,
                        password: passwordHash,
                        edad,
                        rol
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
                    let usuario=await UsuariosManager.getBy({email:username})
                    if(!usuario){
                        return done(null, false, { message: "Debe ingresar los datos de acceso" });
                    }
                    if(!validaHash(password, usuario.password)){
                        return done(null, false, "Credenciales inválidas")
                    }
                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.serializeUser((usuario, done)=>{
        return done(null, usuario._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let usuario=await UsuariosManager.getBy({_id:id})
        return done(null, usuario)
    })
}