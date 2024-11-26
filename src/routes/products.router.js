import { Router } from "express";
import productsManager from "../DAO/productsMongoDAO.js"
import { error } from "console"
import { isValidObjectId } from "mongoose";
import { io } from '../app.js';
import { ProductosController } from "../controllers/ProductsController.js";

const router = Router();

const categoriasValidas = ["Tintos", "Blancos", "Rosados", "Espumantes"];    

router.get("/", ProductosController.getProducts)
router.get("/:id", ProductosController.getProductsById)
router.post("/", ProductosController.createProduct)
router.put("/:id", ProductosController.updateProduct)


// router.get("/", async (req, res) => {
//   let { limit, skip, sort, page, category, inStock } = req.query;
//   page = page ? Number(page) : 1;
//   limit = limit ? Number(limit) : 10;
//   if (!skip) {
//     skip = (page - 1) * limit;
//   } else {
//     skip = Number(skip);
//   }

//   let sortOptions = {};
//   if (sort && (sort === 'asc' || sort === 'desc')) {
//       sortOptions = { price: sort };
//   }
//   const filters = {};
//   if (category) {
//       filters.category = category;
//   }
//   if (inStock === 'true') {
//     filters.stock = { $gt: 0 };
//   }

//   try {
//     const products = await productsManager.getproductsPaginate(skip, limit, page, sortOptions, filters);
//     const userRole = req.user?.role || "guest";
//     const productsWithRoles = products.docs.map(product => ({
//       ...product,
//       userRole: req.user?.role || "guest",
//       userIsAdmin: req.user?.role === "admin",
//       userIsUser: req.user?.role === "user"
//   }));
//     res.render("productsPaginated", {
//       products: productsWithRoles,
//       userRole: req.user?.role || "guest",
//       userIsAdmin: req.user?.role === "admin",
//       userIsUser: req.user?.role === "user",   
//       page: products.page,
//       totalPages: products.totalPages,
//       hasNextPage: products.hasNextPage,
//       hasPrevPage: products.hasPrevPage,
//       nextPage: products.nextPage,
//       prevPage: products.prevPage,
//       limit: limit,
//       sort: sort,
//       category: category,
//       inStock: inStock
//     });
//     } catch (error) {
//       res.setHeader("Content-Type", "application/json");
//       return res.status(500).json({
//           error: `Error inesperado en el servidor. Intente más tarde`,
//           detalle: `${error.message}`,
//       });
//     }
// });

// router.get("/:id", async (req, res) => {
//   let { id } = req.params
//   if(!isValidObjectId(id)){
//     res.setHeader('Content-Type','application/json');
//     return res.status(400).json({error:`id con format inválido`})
//   }
//   try {
//     let product = await productsManager.getProductById(id);
//     if(!product){
//         res.setHeader('Content-Type','application/json');
//         return res.status(400).json({error:`No existe un producto con id ${id}`})
//       } else {
//         return res.status(200).json({ product });
//       }
    
//   } catch (error) {
//       res.setHeader("Content-Type", "applcation/json");
//     return res.status(500).json({
//       error: `Error inesperado en el servidor, Intente mas tarde`,
//       detalle: `${error.mensaje}`,
//     });
//   }
// });

// router.post("/", async (req, res) => {
//   let {code, category, title, description, price, stock, status, thumbnails, ...otros} = req.body
//   if (!title || !description || !code || !price || !stock || !category) {
//     res.setHeader("Content-Type", "applcation/json");
//     return res.status(400).json({ 
//       error: 'Es obligatorio completar los campos title, description, code, price, stock y category' 
//     });
//   }
//   let precio = Number(price)
//   if(isNaN(precio)) {
//     {return res.status(400).json({ 
//         error: 'El campo PRECIO debe ser numérico' 
//       })
//     }
//     }else{
//       if(precio<0) {
//         {return res.status(400).json({ 
//             error: 'El campo PRECIO debe ser mayor o igual a 0' 
//           })
//         }
//       }
//     }
//     price = precio
//     let disponible = Number(stock);
//     if(isNaN(disponible)) {
//     {return res.status(400).json({ 
//         error: 'El campo STOCK debe ser numérico' 
//       })
//     } 
//     }else{
//       if(disponible<0) {
//         {return res.status(400).json({ 
//             error: 'El campo STOCK debe ser mayor o igual a 0' 
//           })
//         }
//       }
//     }
//   stock = disponible 
//   if (!categoriasValidas.includes(category)) {
//     res.setHeader("Content-Type", "applcation/json");
//     return res.status(400).json({ 
//       error: `Las categorias válidas son: "Tintos", "Blancos", "Rosados" o "Espumantes"` 
//     });
//   }
//   status = true
//   thumbnails = []
//   let existe
//   try {
//     existe = await productsManager.getProductBy({code});
//   } catch (error) {
//       res.setHeader("Content-Type", "applcation/json");
//     return res.status(500).json({
//       error: `Error inesperado en el servidor, Intente mas tarde`,
//       detalle: `${error.mensaje}`,
//     });
//   }
//   if (!existe) {
//     try {
//         let newProd= await productsManager.addproduct({code, category, title, description, price, stock, status, thumbnails, ...otros});
//         io.emit('agregarProducto', newProd);
//         res.setHeader("Content-Type", "applcation/json");
//         return res.status(200).json({ newProd });
//     } catch (error) {
//         res.setHeader("Content-Type", "applcation/json");
//         res.status(500).json({ error: `Error ${error.mensaje} al agregar producto ${productoNuevo}` });
//     }
//   } else {
//     res.setHeader("Content-Type", "applcation/json");
//     return res
//       .status(400)
//       .json({ error: `Ya existe un producto de nombre ${code}`});
//   }
// });

// router.put("/:id", async (req, res) => {
//   let { id } = req.params;
//   let producto
//   try {
//       producto = await productsManager.getProductById(id);
//     } catch (error) {
//       res.setHeader("Content-Type", "application/json");
//     return res.status(500).json({
//       error: `Error inesperado en el servidor. Intente más tarde`,
//       detalle: `${error.message}`,
//     });
//   }
//   if (!producto) {
//     res.setHeader("Content-Type", "application/json");
//     return res.status(400).json({ error: `No existe product con id: ${id}` });
//   }
//   let aModificar = req.body;
//   if (aModificar.price) {
//     let precio = Number(aModificar.price);
//     if(isNaN(precio)) {
//       {return res.status(400).json({ 
//           error: 'El campo PRECIO debe ser numérico' 
//         })
//       } 
//       }else{
//         if(precio<0) {
//           {return res.status(400).json({ 
//               error: 'El campo PRECIO debe ser mayor o igual a 0' 
//             })
//           }
//         }
//       }
//     aModificar.price=precio
//   }
//   if(aModificar.stock) {
//     let disponible = Number(aModificar.stock);
//     if(isNaN(disponible)) {
//       {return res.status(400).json({ 
//           error: 'El campo STOCK debe ser numérico' 
//         })
//       }
//       }else{
//         if(disponible<0) {
//           {return res.status(400).json({ 
//               error: 'El campo STOCK debe ser mayor o igual a 0' 
//             })
//           }
//         }
//       };
//       aModificar.stock=disponible
//     }
//     if(aModificar.category) {
//     if (!categoriasValidas.includes(aModificar.category)) {
//         res.setHeader("Content-Type", "applcation/json");
//         return res.status(400).json({ 
//           error: `Las categorias válidas son: "Tintos", "Blancos", "Rosados" o "Espumantes"` 
//         });
//       }
//     }
//     if (aModificar.code) {
//       let existe = productsManager.getProductByCode(aModificar.code)
//       if (existe) {
//         res.setHeader("Content-Type", "application/json");
//         return res
//           .status(400)
//           .json({ error: `Ya existe otro product llamado ${aModificar.code}` });
//       }
//   }
//   let productModificado
//   try {
//     productModificado = await productsManager.updateproduct(id, aModificar);
//     res.setHeader("Content-Type", "application/json");
//     return res.status(200).json({ productModificado });
//   } catch (error) {
//     res.setHeader("Content-Type", "application/json");
//     return res.status(500).json({
//       error: `Error inesperado en el servidor al actualizar producto. Intente más tarde`,
//       detalle: `${error.message}`,
//     });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   let {id}= req.params
//   if(!isValidObjectId(id)){
//     res.setHeader('Content-Type','application/json');
//     return res.status(400).json({error:`id invalido ${id}`})
//   }
//   let productoExiste = await productsManager.getProductById(id)
//   if(!productoExiste){
//       res.setHeader('Content-Type','application/json');
//       return res.status(400).json({error:`No existe el producto con id: ${id}`})
//   }
//   try {
//       let productoEliminado=await productsManager.deleteproduct(id)
//       if(!productoEliminado){
//           res.setHeader('Content-Type','application/json');
//           return res.status(400).json({error:`No se ha podido eliminar el producto`})
//       }
//       res.setHeader('Content-Type','application/json');
//       return res.status(200).json({productoEliminado});
//   } catch (error) {
//       console.log(error);
//       res.setHeader('Content-Type','application/json');
//       return res.status(500).json(
//           { error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
//             detalle:`${error.message}`
//           }
//       )
//   }
// });

export default router;