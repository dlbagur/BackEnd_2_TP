import { Router } from 'express';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
   let {nombre, password}=req.query;
   if (!nombre || !password){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`Complete nombre y contraseña`})      
   }
   let usuario=usuarios.find(u=>u.nombre===nombre && u.password===password)
   if (!usuario){
      res.setHeader('Content-Type','application/json');
      return res.status(401).json({error:`Credenciales inválidas`})
   }

   req.session.usuario=usuario;
   res.setHeader('Content-Type','application/json');
   return res.status(200).json({payload:`Login exitoso para ${usuario.nombre}`});
});

router.get('/datos', auth, (req,res)=>{
   res.setHeader('Content-Type','application/json');
   return res.status(200).json({payload:"Datos protegidos", usuarioLogueado:req.session.usuario});
});

export default router;