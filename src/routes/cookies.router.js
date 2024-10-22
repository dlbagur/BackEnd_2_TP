import { Router } from "express";

const router = Router();

router.get("/setcookie", (req,res)=>{
    let datosgenerales = {
        usuario: "cliente01",
        cartUser: "01"
    }
    res.cookie("cookieDG", datosgenerales)
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Cookies configuradas"});
})

router.get("/getcookies", (req,res)=>{
    let cookies = req.cookies
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({cookies});
})

router.get("/delcookie", (req,res)=>{
    // let cookie = req.cookies()
    res.clearCookie("cookieDG");
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Cookie eliminada"});
})

export default router;
