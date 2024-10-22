import CartsManager from "../dao/CartsManager";

const crearCarrito = async () => {
    const nuevoCarrito = {
        usuario: 'Diego',
        productos: [
            {
                producto: 'ObjectIdDelProducto',  // Reemplaza esto con el ID de un producto existente
                quantity: 2
            }
        ]
    };

    const carritoCreado = await CartsManager.addCart(nuevoCarrito);
    console.log('Carrito creado:', carritoCreado);
};

crearCarrito();
