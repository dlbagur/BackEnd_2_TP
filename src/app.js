import express from 'express';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { Server } from 'socket.io';
import { config } from "./config/config.js";
import { connDB } from './ConnDB.js';
import productsRouter from './routes/products.router.js';
import productsDAO from "./DAO/productsMongoDAO.js"
import cartsRouter from './routes/carts.router.js';
import CartsManager from './DAO/cartsMongoDAO.js';
import { router as vistasRouter } from './routes/vistas.routers.js';
import { router as usersRouter } from './routes/users.router.js';
import cookieParser from 'cookie-parser';
import cookiesRouter from './routes/cookies.router.js';
import { auth, auth2 } from './middleware/auth.js';
import sessions from 'express-session';
import passport from "passport";
import { initPassport } from './config/passport.config.js';
import { passportCall } from './utils.js';
import MongoStore from "connect-mongo";
import FileStore from "session-file-store";

const PORT=config.PORT;
const app=express();

const fileStore=FileStore(sessions)

const serverHTTP = app.listen(PORT, () => {
    console.log(`Server en línea en http://localhost:${PORT}`);
});

const io = new Server(serverHTTP);

// Configuración de Handlebars
Handlebars.registerHelper('eq', (a, b) => a === b);
app.engine('handlebars', engine({ handlebars: Handlebars }));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));
app.use(cookieParser());

// Passport
initPassport()
app.use(passport.initialize())

// Rutas
app.use('/', vistasRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('validarProducto', async (code) => {
        try {
            const existe = await productsDAO.getProductBy({ code });
            socket.emit('productoExiste', !!existe);
        } catch (error) {
            console.error('Error al validar el producto:', error);
            socket.emit('productoExiste', false);
        }
    });

    socket.on('validarProductoP', async (code) => {
        try {
            const existe = await productsDAO.getProductBy({ code });
            socket.emit('productoExisteP', !!existe);
        } catch (error) {
            console.error('Error al validar el producto:', error);
            socket.emit('productoExisteP', false);
        }
    });

    socket.on('crearProducto', async (producto) => {
        try {
            const nuevoProducto = await productsDAO.addproduct(producto);            
            io.emit('agregarProducto', nuevoProducto);
        } catch (error) {
            console.log("Error ", error)
            socket.emit('error', 'Error al agregar producto');
        }
    });

    socket.on('modificarProducto', async (producto) => {
        try {
            console.log("Modificar Producto: ", producto)
            const { _id, ...dataToUpdate } = producto;
            const aModificarProducto = await productsDAO.updateproduct(_id, dataToUpdate);
            io.emit('productoModificado', producto);
        } catch (error) {
            console.log("Error ", error)
            socket.emit('error', 'Error al modificar producto');
        }
    });

    socket.on('eliminarProducto', async (idProducto) => {
        try {
            await productsDAO.deleteproduct(idProducto);
            io.emit('eliminarProducto', idProducto);
        } catch (error) {
            socket.emit('error', 'Error al eliminar producto');
        }
    });

    socket.on('crearProductoP', async (producto) => {
        try {
            const nuevoProducto = await productsDAO.addproduct(producto);            
            io.emit('agregarProductoP', nuevoProducto);
        } catch (error) {
            console.log("Error ", error)
            socket.emit('error', 'Error al agregar producto');
        }
    });

    socket.on('modificarProductoP', async (producto) => {
        try {
            const { _id, ...dataToUpdate } = producto;
            const aModificarProducto = await productsDAO.updateproduct(_id, dataToUpdate);
            socket.emit('modificarProductoPag', producto);
        } catch (error) {
            console.log("Error ", error)
            socket.emit('error', 'Error al modificar producto');
        }

    });    
    
    socket.on('eliminarProductoP', async (idProducto) => {
        try {
            await productsDAO.deleteproduct(idProducto);
            io.emit('eliminarProductoP', idProducto);
        } catch (error) {
            socket.emit('error', 'Error al eliminar producto');
        }
    });

    socket.on('vaciarCarrito', async (idCarrito) => {
        try {
            await CartsManager.deleteAllProductsFromCart(idCarrito);
            io.emit('vaciarCarritoR', idCarrito);
        } catch (error) {
            socket.emit('error', 'Error al eliminar el contenido del carrito');
        }
    });

    socket.on('agregarProductoAlCart', async ({ cart, idProducto }) => {
        try {
            await CartsManager.addProductToCart(cart, idProducto);
            socket.emit('productoAgregado', { success: true, message: 'Producto agregado al carrito' });
            io.emit('CarritoActualizado', cart);
        } catch (error) {
            socket.emit('productoAgregado', { success: false, message: error.message });
        }
    });

    socket.on('agregarProductoAlCartP', async ({ cart, idProducto }) => {
        try {
            await CartsManager.addProductToCart(cart, idProducto);
            socket.emit('productoAgregadoP', { success: true, message: 'Producto agregado al carrito' });
            io.emit('CarritoActualizadoP', cart);
        } catch (error) {
            socket.emit('productoAgregadoP', { success: false, message: error.message });
        }
    });

    socket.on('realTimeProductsRequest', async (data) => {
        try {
            const { skip = 0, limit = 10 } = data;
            const productosPaginados = await productsDAO.getproductsPaginate(skip, limit);
            socket.emit('realTimeProductsResponse', productosPaginados);
        } catch (error) {
            socket.emit('error', 'Error al paginar Producto');
        }
    });

    socket.on('productsPaginatedRequest', async (data) => {
        try {
            const { skip = 0, limit = 10 } = data;
            const productosPaginados = await productsDAO.getproductsPaginate(skip, limit);
            socket.emit('productsPaginatedResponse', productosPaginados);
        } catch (error) {
            socket.emit('error', 'Error al paginar Producto');
        }
    });
});

connDB.conectar(config.MONGO_URL, config.DB_NAME)

export { io };