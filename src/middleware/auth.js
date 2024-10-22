export const auth=(req, res, next)=>{
    let {web}=req.query
    if(!req.session.usuario){
        if(web){
            return res.redirect("/login?mensaje=No hay usuarios autenticados")
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`No hay usuarios autenticados`})
        }
    }

    return next()
}