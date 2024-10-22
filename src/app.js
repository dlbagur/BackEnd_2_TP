import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { config } from "./config/config,js";
import { connDB } from './ConnDb.js';
import productsRouter from './routes/products.router.js';
import productsManager from "./dao/ProductsManager.js"
import cartsRouter from './routes/carts.router.js';
import CartsManager from './dao/CartsManager.js';
import { router as vistasRouter } from './routes/vistas.routers.js';
import { router as sessionsRouter } from './routes/sessionsRouter.js'
import cookieParser from 'cookie-parser';
import cookiesRouter from './routes/cookies.router.js';
import sessions from 'express-session';
import { auth } from './middleware/auth.js';
import loginRouter from './routes/login.router.js';

const PORT=config.PORT;
const app = express();

const serverHTTP = app.listen(PORT, () => {
    console.log(`Server en línea en http://localhost:${PORT}`);
});

const io = new Server(serverHTTP);

// Configuración de Handlebars
app.engine('handlebars', engine({
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));
app.use(cookieParser());
app.use(sessions({
    secret:config.SECRET_SESSION,
    resave:true,
    saveUninitialized :true
}))

// Rutas
app.use('/', vistasRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/cookies', cookiesRouter);
app.use('/login', loginRouter);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('validarProducto', async (code) => {
        try {
            const existe = await productsManager.getProductBy({ code });
            socket.emit('productoExiste', !!existe);
        } catch (error) {
            console.error('Error al validar el producto:', error);
            socket.emit('productoExiste', false);
        }
    });

    socket.on('crearProducto', async (producto) => {
        try {
            const nuevoProducto = await productsManager.addproduct(producto);            
            io.emit('agregarProducto', nuevoProducto);
        } catch (error) {
            console.log("Error ", error)
            socket.emit('error', 'Error al agregar producto');
        }
    });

    socket.on('modificarProducto', async (producto) => {
        try {
            const { _id, ...dataToUpdate } = producto;
            const aModificarProducto = await productsManager.updateproduct(_id, dataToUpdate);
            io.emit('productoModificado', producto);
        } catch (error) {
            console.log("Error ", error)
            socket.emit('error', 'Error al modificar producto');
        }
    });

    socket.on('eliminarProducto', async (idProducto) => {
        try {
            await productsManager.deleteproduct(idProducto);
            io.emit('eliminarProducto', idProducto);
        } catch (error) {
            socket.emit('error', 'Error al eliminar producto');
        }
    });

    socket.on('vaciarCarrito', async (idCarrito) => {
        try {
            await CartsManager.deleteAllProductsFromCart(idCarrito);
            io.emit('vaciarCarrito', idCarrito);
        } catch (error) {
            socket.emit('error', 'Error al eliminar carrito');
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

    socket.on('realTimeProductsRequest', async (data) => {
        try {
            const { skip = 0, limit = 10 } = data;
            const productosPaginados = await productsManager.getproductsPaginate(skip, limit);
            socket.emit('realTimeProductsResponse', productosPaginados);
        } catch (error) {
            socket.emit('error', 'Error al paginar Producto');
        }
    });

    socket.on('productsPaginatedRequest', async (data) => {
        try {
            const { skip = 0, limit = 10 } = data;
            const productosPaginados = await productsManager.getproductsPaginate(skip, limit);
            socket.emit('productsPaginatedResponse', productosPaginados);
        } catch (error) {
            socket.emit('error', 'Error al paginar Producto');
        }
    });
});

connDB()

export { io };
