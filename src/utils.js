import bcrypt from "bcrypt";
import passport from "passport";

export const generaHash=password=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const validaHash=(pass, hash)=>bcrypt.compareSync(pass, hash);

export const passportCall=estrategia=>function (req, res, next) {
    passport.authenticate(estrategia, function (err, user, info, status) {
        if (err) { return next(err) }
        if (!user) {
            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`${info.message?info.message:info.toString()}`})
        }
        req.user=user;
        return next()
    })(req, res, next);
}