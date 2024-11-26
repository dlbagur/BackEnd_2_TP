import express from 'express';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { Server } from 'socket.io';
import { config } from "./config/config.js";
import { connDB } from './ConnDB.js';
import productsRouter from './routes/products.router.js';
import productsManager from "./DAO/productsMongoDAO.js"
import cartsRouter from './routes/carts.router.js';
import CartsManager from './DAO/cartsMongoDAO.js';
import { router as vistasRouter } from './routes/vistas.routers.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import cookieParser from 'cookie-parser';
import cookiesRouter from './routes/cookies.router.js';
import { auth, auth2 } from './middleware/auth.js';
import sessions from 'express-session';
import passport from "passport";
import { initPassport } from './config/passport.config.js';
import { passportCall } from './utils.js';
import MongoStore from "connect-mongo";
import FileStore from "session-file-store";

export class Server {
    constructor() {
        this.app = express();
        this.PORT = config.PORT;
        this.middlewares();
        this.templateEngine();
        this.routes();
        this.handleErrors();
        this.connectDatabase();
        userService.initializeAdmin();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static('./src/public'));
        iniciarPassport();
        this.app.use(passport.initialize());
        this.app.use(express.static(path.join(__dirname, '/public')));
        this.app.use((req, res, next) => {
            res.locals.isLogin = !!req.cookies.tokenCookie;
            next();
        });
    }

    templateEngine() {
        this.app.engine('handlebars', engine({
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            },
        }));
        this.app.set('view engine', 'handlebars');
        this.app.set('views', path.join(__dirname, '/views'));
    }

    routes() {
        this.app.use('/', vistasRouter);
        this.app.use('/api/products', productsRouter)
        this.app.use('/api/sessions', sessionsRouter);
        this.app.use('/api/carts', cartsRouter);
    }

    handleErrors() {
        this.app.use((req, res, next) => {
            res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
        });
        this.app.use((err, req, res, next) => {
            res.status(500).json({ error: 'Error del servidor.' });
        });
    }

    connectDatabase() {
        connDB(config.MONGO_URL, config.DB_NAME);
    }

    start() {
        this.app.listen(this.PORT, () => {
            console.log(`Server escuchando en puerto ${this.PORT}`);
        });
    }
}
