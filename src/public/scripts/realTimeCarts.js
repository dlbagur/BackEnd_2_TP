const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('carts-list').addEventListener('click', (e) => {
        const idCarrito = e.target.getAttribute('data-id');

        if (e.target.classList.contains('delete-btn')) {
            socket.emit('vaciarCarrito', idCarrito);
        }
    });
    const irAlMenuBtn = document.getElementById('irAlMenu');
    if (irAlMenuBtn) {
        irAlMenuBtn.addEventListener('click', () => {
            window.location.href = "/"
        });
    }
    socket.on('vaciarCarritoR', (idCarrito) => {
        const cartsList = document.getElementById('carts-list');
        const itemToRemove = cartsList.querySelector(`li[data-id="${idCarrito}"]`);
    });
});
