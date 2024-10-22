const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('carts-list').addEventListener('click', (e) => {
        const idCarrito = e.target.getAttribute('data-id');

        if (e.target.classList.contains('delete-btn')) {
            socket.emit('vaciarCarrito', idCarrito);
        }
    });

    socket.on('vaciarCarrito', (idCarrito) => {
        const cartsList = document.getElementById('carts-list');
        const itemToRemove = cartsList.querySelector(`li[data-id="${idCarrito}"]`);
    });
});
